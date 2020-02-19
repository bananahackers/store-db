## Documentation

### Format

Each app has its own yaml-file that describes it.

Each categories has such an yaml file too.
in the app description files you can only use categories that were defined before.

#### Category format

(TODO, for now look at the other apps and at the template inside of the examples folder)

#### App format

(TODO, for now look at the other apps and at the template inside of the examples folder)


###### App.type

type        | meaning
------------|--------------------------
`weblink`   | just a link to a website, that site is not optimized for kaiOS / ffOS / GerdaROM
`hosted`    | hosted app (real app with manifest and made to run on kaiOS)
`packaged`  | similar to hosted, but comes in a zip file without auto-updates
`priviliged`| same as packaged, but runs with more rights
`certified` | basically same rights as system webapps
`root`      | runs native software (wallace app for example)

also see https://developer.kaiostech.com/core-developer-topics/permissions for more information on the permission scopes.

(todo technical part for app.type - validation, implementation)