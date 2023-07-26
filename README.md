# `gh-spritegen`

Spritegen is a CLI utility for creating sprite sheets.

This sprite sheets is used in an addon named GloriousHUD for Garry's mod.

*Addon is available on gmodstore https://www.gmodstore.com/market/view/7f16245d-f949-4333-b68c-525426b1e8f0*

## Usage

```
spritegen <options>

Options:
      --help        Show help                                          [boolean]
      --version     Show version number                                [boolean]
  -a, --assets                                               [string] [required]
  -o, --output                                               [string] [required]
  -p, --prettyjson                                     [boolean] [default: true]
```

### Preapre

Before you run CLI utility, you must prepare your assets folder. <br>
Every folder inside assets is sprite sheet with parameters. <br>
Parameters is specified in JSON file named `config.json`

```json
//config.json

{
    "border": 2, //gap between images
    "sheetDimension": 1024 //size of texture
}
```

As a result, this is how the structure will look like:

```
📦assets
 ┣ 📂custom
 ┃ ┣ 📜config.json
 ┃ ┣ 📜dot.png
 ┃ ┣ 📜filled-circle.png
 ┃ ┣ 📜inner.png
 ┃ ┗ 📜lines.png
 ┣ 📂flags
 ┃ ┣ 📜ac.png
 ┃ ┣ 📜ad.png
 ┃ ┣ 📜ae.png
 ┃ ┣ 📜af.png
 ┃ ┣ 📜config.json
 ┗ 📂lucide
 ┃ ┣ 📜accessibility.png
 ┃ ┣ 📜activity-square.png
 ┃ ┣ 📜config.json
 
```

### Executing

After this step you can execute command:

```
spritegen --a ./assets/ --o ./output/
```

### Result

The output is divided into folders that match the folder names in assets. <br>
In a folder called by name of sprite sheet, you can see the texture and JSON file with meta-info and coordinates.

```json
{
    "name": "custom",
    "coords": {
        "inner": "2 2 512 512", //here is format "x y width heigth"
        "lines": "518 2 512 512",
        "dot": "1034 2 128 128",
        "filled-circle": "1166 2 64 64"
    }
}
```

## API

There is no API and it not planned yet.

## Credits

- https://www.npmjs.com/package/sharpsheet
- https://www.npmjs.com/package/boxen
- https://www.npmjs.com/package/chalk
- https://www.npmjs.com/package/slash
- https://www.npmjs.com/package/yargs