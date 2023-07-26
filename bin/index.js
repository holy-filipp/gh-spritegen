#! /usr/bin/env node

import sharpsheet from 'sharpsheet';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));
import fs from 'fs';
import path from 'path';
import slash from 'slash';
import boxen from 'boxen';
import chalk from 'chalk';

const argv = yargs.options({
    a: { type: 'string', alias: 'assets', demandOption: true },
    o: { type: 'string', alias: 'output', demandOption: true },
    p: { type: 'boolean', alias: 'prettyjson', demandOption: false, default: true }
}).argv;

const defaultOptions = {
    outputFormat: "png",
    outputQuality: 100,
    outputFilename: 'coords_temp.json'
}

async function findAssets() {
    const assets = [];

    const files = await fs.promises.readdir(argv.a);

    for(const file of files) {
        const fullPath = path.join(argv.a, file);
        const isDirectory = (await fs.promises.lstat(fullPath)).isDirectory();

        if(isDirectory) {
            assets.push(fullPath);
        }
    }
    
    return assets;
}

async function readConfig(dir) {
    const configPath = path.join(dir, 'config.json')
    const raw = await fs.promises.readFile(configPath);
    const json = await JSON.parse((raw == '' ? undefined : raw) ?? '{}');

    if(!json.border || !json.sheetDimension) {
        console.log(chalk.bgRed.white(`Failed to load config in ${configPath}`));
        process.exit();
    }

    return json;
}

async function giveResult(configs) {
    let out = '';
    
    for(const assetsPath in configs) {
        out += `${configs[assetsPath].name} • ${configs[assetsPath].count} images${Object.keys(configs)[Object.keys(configs).length - 1] == assetsPath ? '' : '\n'}`;
    }

    return out;
}

async function main() {
    const startTime = Date.now() / 1000 | 0;
    const assets = await findAssets();
    const configs = {};

    for(const assetsPath of assets) {
        const options = {
            ...await readConfig(assetsPath),
            ...defaultOptions,
            name: path.parse(assetsPath).name
        }

        configs[assetsPath] = options;
    }

    if(!fs.existsSync(path.resolve(argv.o))) {
        await fs.promises.mkdir(path.resolve(argv.o));
    }

    for(const assetsPath in configs) {
        const outputPath = path.resolve(path.join(argv.o, configs[assetsPath].name));
        const options = configs[assetsPath];

        if(!fs.existsSync(outputPath)) {
            await fs.promises.mkdir(outputPath);
        }

        const spriter = await sharpsheet(slash(path.resolve(assetsPath, '*.png')), outputPath, options);

        const coordsRaw = await fs.promises.readFile(path.join(outputPath, defaultOptions.outputFilename));
        const oldCoords = JSON.parse(coordsRaw);

        const coords = {};
        Object.keys(oldCoords.spritesheets[0].sprites).forEach(sprite => {
            sprite = oldCoords.spritesheets[0].sprites[sprite];
            coords[sprite.name] = `${sprite.position.x} ${sprite.position.y} ${sprite.dimension.w} ${sprite.dimension.h}`;
        });

        configs[assetsPath].count = Object.keys(oldCoords.spritesheets[0].sprites).length;

        const newCoords = {
            name: options.name,
            coords: {
                ...coords
            }
        }

        const newRaw = JSON.stringify(newCoords, null, argv.p ? '    ' : '');
        fs.writeFileSync(path.join(outputPath, 'coords.json'), newRaw);
        fs.unlink(path.join(outputPath, 'coords_temp.json'), () => {});
    }

    let text = `Done in ${(Date.now() / 1000 | 0 ) - startTime} seconds!\n\n${await giveResult(configs)}`;

    console.log(boxen(text, { borderColor: 'green', borderStyle: 'round', padding: 1, textAlignment: 'center' }));
}

main();