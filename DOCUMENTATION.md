# Documentation

## Format

Each app has its own yaml-file that describes it.

Each categories has such an yaml file too.
in the app description files you can only use categories that were defined before.

## Category format

### .name

Name of the category.

### .description (optional)

Description of the category.

### .icon
Icon of the category, must be an id of a fontawesome icon (only free icons, for a list of availible icons see https://fontawesome.com/icons?d=gallery&m=free)

```yaml
icon: fa_plane
```

## App format

### .name

Name of the app. 

```yaml
name: Example App
```

### .description

Description of the app. What is the about about?
```yaml
description: This is just an example app, it does nothing special.
```

### .icon

Url of an png icon of the app.
```yaml
icon: "https://app.example.com/icon.png"
```

### .download
An object that contains a url to the app and the version it is in.
```yaml
download:
  url: https://github.com/strukturart/rss-reader/blob/master/build/rss-reader.zip
  version: "1.0"
```

### .type 

The type of the app can be one of these:

type        | meaning
------------|--------------------------
`weblink`   | just a link to a website, that site is not optimized for kaiOS / ffOS / GerdaROM
`hosted`    | hosted app (real app with manifest and made to run on kaiOS)
`packaged`  | similar to hosted, but comes in a zip file without auto-updates
`privileged`| same as packaged, but runs with more rights
`certified` | basically same rights as system webapps
`root`      | runs native software (wallace app for example)

also see https://developer.kaiostech.com/core-developer-topics/permissions for more information on the permission scopes.

```yaml
type: packaged
```

### .author
Who made the app?
Value: person, group or organisation
```yaml
author: Maria Mustermann <m1997@example.com>
```

### .maintainer
Who maintains and packaged the app package that is referenced in `.download`.
Most of the time this is the same person/group/organisation as the author, 
but it differs when for example the store brings out a patched version of WhatsApp. 
```yaml
maintainer: Maria Mustermann <m1997@example.com>
```

### .meta

#### .meta.tags
A string of tags to make the search results better, seperated by `; ` (semicolons).
#### .meta.categories
Array of the categories that this app should appear in. Make sure the category is defined, if its not you need to create it first. (see [Category format](#Category-format))

```yaml
meta:
  tags: map; openstreatmap; osm; maps; travel;
  categories: 
   - travel
   - tools
```

### .license

link to license, name of opensource license or `Unknown`
```yaml
license: MIT
```

### .screenshots (optional)
Array of screenshots from the app running on a device.
```yaml
screenshots:
  - "https://raw.githubusercontent.com/strukturart/osm-map/master/images/image-2.png"
  - "https://raw.githubusercontent.com/strukturart/osm-map/master/images/image-3.png"
  - "https://raw.githubusercontent.com/strukturart/osm-map/master/images/image-4.png"
```

### .website (optional)
Link to the website of the app (if it has one)

### .git_repo (optional)
Link to the git repo of the app (if it has one)
