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

Url of an png, jpeg or gif icon of the app.
```yaml
icon: "https://app.example.com/icon.png"
```
this url can't be shortened because it must include `.png`, `.jpeg` or `.gif` at the end

### .download
An object that contains a url to the app and the manifest. The manifest is used
to fetch the latest version, so it must contain a `version` property.
**Old apps have a generated manifest in this repository. If you are the owner
of an app and did not add a manifest URL yet, you should replace it with a link
to your manifest, make sure that it has a version and delete the generated
file.**

See [Package Format](#package-format) for the app package format.

```yaml
download:
  url: https://app.example.com/package.zip
  manifest: https://app.example.com/manifest.webapp
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
maintainer: 
  - Maria Mustermann <m1997@example.com>
  - Tonka Pinkuy <tp@example.com>
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

> **IMPORTANT NOTE (for app owners):** 
> While it is possible to choose licence of an app `Unknown` it is highly
> recommended that you choose a licence for your app, preferably a FOSS one.
> **Why?** Because if you don't and according to [Berne convention](https://en.wikipedia.org/wiki/Berne_Convention)
> your app will be closed source and propiety which no one else can re-distribute or change
> **even if you release its source code** on Github or Gitlab or anywhere else.

{: .alert .alert-danger}

### .screenshots (optional)
Array of screenshots from the app running on a device.
```yaml
screenshots:
  - "https://raw.githubusercontent.com/strukturart/osm-map/master/images/image-2.png"
  - "https://raw.githubusercontent.com/strukturart/osm-map/master/images/image-3.png"
  - "https://raw.githubusercontent.com/strukturart/osm-map/master/images/image-4.png"
```
this urls can't be shortened because they must include `.png`, `.svg`, `.jpeg` or `.gif` at the end

### .website (optional)
Link to the website of the app (if it has one)

### .git_repo (optional)
Link to the git repo of the app (if it has one)

### .donation (optional)
Link to paypal, buymeacoffee.com or other providers
```yaml
.donation: "https://..."
```

### .has_tracking
the app tracks the user to evaluate data
```yaml
.has_tracking: true
```

### .has_ads
if advertising will appear
```yaml
.has_ads: true
```

## Package format

Packages are in the [OmniSD format](https://wiki.bananahackers.net/en/development/your-first-app#the-app-format-accepted-by-omnisd). The app package is a zip
containing two files:

 - `application.zip` - a nested zip containing the app code
 - `metadata.json` - the metadata file.

> **IMPORTANT: The manifestURL in the metadata file must be the same as the
> `download.manifest` property in the app's `.yml` file, otherwise some clients
> might fail to identify an installed app.**

Here is an example metadata file:
```json
{
  "version": 1,
  "manifestURL": "https://app.example.com/manifest.webapp"
}
```

`version` must always be `1` since it is the version of the package format, not
the app version.
