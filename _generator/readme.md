## Generator

This small nodejs program validates all apps, downloads their screenshots and app icon and then generates the files that are accessible on the endpoint that is to be consumed by the apps.

Before starting it you need to go into this directory and install its dependencies via `npm install`. (If npm is not installed you need to install nodejs first, we recommend instalation via https://github.com/nvm-sh/nvm).

To start the generation run:

```
HOST_PREFIX="banana-hackers.gitlab.io/store-db/" node index.js
```

If you want to run this command on windows instead you need to define the `HOST_PREFIX` enviroment variable with different method.

## Settings

Currently there is only the `HOST_PREFIX` variable which tells the generator where its output should be hosted.

## Documentation

The output of the generator has the following structure:

```sh
├── data.json # the dataset with all apps and categories
├── icons
│   ├── [appid]
│   │   ├── screenshot[index].png
│   │   └── ...
│   ├── [appid].png
│   └── ...
├── lastUpdate.txt # unix timestamp
└── schema.json # machine readable documentation of the data.json format
```

`schema.json` is a [json schema](http://json-schema.org/) describing the format of `data.json`.
It can be used to generate typedefinitons or to generate a human readable documentation file.


### Changing the structure

First create an issue and discuss your change with the others.
Then sumbit a merge request containing everything that is needed for such a change:


- **If** your change changes the input (`.yaml`) format:**
  - make sure to update `all apps`/`all categories` to be compliant with the new format
  - make sure the `DOCUMENTATION.md` file and the example files in the `example/`-folder are up to date with your format change
  - makes sure the validation part of the generator is happy and does not produce any errors. (run the generator to find out)

- **If** you change the output format (`data.json` and for that matter everything else the generator script spits out):
  - make sure you have also updated `_generator/schema.json` to document your change.
  - **If** the change is incompatible (for example removed a property, changed type of property, (re)moved files) with older clients:
    - increase the `data.json`- version number by 1 (you can need to adjust that number inside of `index.js`)