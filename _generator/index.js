const fs = require('fs-extra')
const yaml = require('js-yaml')
const { join } = require('path')
const isUrl = require('is-url-superb')

const DEBUG = process.env.ENV === "DEVELOPMENT"

const isEmpty = (string) => typeof string !== "string" || string.trim().length == 0

const APP_TYPES = ['weblink', 'hosted', 'packaged', 'privileged', 'certified', 'root']

/** Checks if everything is valid and if the data is complete */
function validate_apps(appData, availibleCategories) {
    const errors = []
    const error = error => errors.push("- " + error)

    if (isEmpty(appData.name)) {
        error("Name is missing")
    }

    if (isEmpty(appData.description)) {
        error("Description is missing")
    }

    if (isEmpty(appData.icon)) {
        error("Icon is missing")
    } else if (!isUrl(appData.icon)) {
        error("Icon url invalid")
    }

    if (appData.download) {
        if (isEmpty(appData.download.url)) {
            error("download.url missing")
        } else if (!isUrl(appData.download.url)) {
            error("download.url invalid")
        }
        if (isEmpty(appData.download.version)) {
            error("download.version missing")
        }
    } else {
        error("Download field missing")
    }

    if (isEmpty(appData.author)) {
        error("Author is missing")
    }

    if (isEmpty(appData.maintainer)) {
        error("Maintainer is missing")
    }


    if (appData.meta) {
        if (isEmpty(appData.meta.tags)) {
            error("meta.tags missing")
        }

        if (Array.isArray(appData.meta.categories)) {
            // todo check if they were defined
            appData.meta.categories.forEach(category => {
                if (availibleCategories.indexOf(category) === -1) {
                    error(`meta.categories: "${category}" was not found, did you forget define it in the 'categories' folder?`)
                }
            })
        } else {
            error("meta.categories missing or not an array")
        }
    } else {
        error("meta is missing")
    }

    if (isEmpty(appData.type)) {
        error("type missing")
    } else if (!APP_TYPES.includes(appData.type)) {
        error(appData.type + "is not a valid app type, this field can contain one of " + APP_TYPES.join(', '))
    }

    if (isEmpty(appData.license)) {
        error("License is missing")
    }

    if (typeof appData.has_tracking !== "boolean") {
        error("has Tracking is missing")
    }

    if (typeof appData.has_ads !== "boolean") {
        error("has Ads is missing")
    }

    // Optional

    if (Array.isArray(appData.screenshots)) {
        appData.screenshots.forEach(screenshot_url => {
            if (!isUrl(screenshot_url)) {
                error(`Screenshot url invalid: "${screenshot_url}"`)
            }
        });
    }

    if (appData.website) {
        if (!isUrl(appData.website)) {
            error(`Website url invalid: "${appData.website}"`)
        }
    }

    if (appData.git_repo) {
        if (!isUrl(appData.git_repo)) {
            error(`Git repo url invalid: "${appData.git_repo}"`)
        }
    }

    if (appData.donation) {
        if (!isUrl(appData.donation)) {
            error(`donation url invalid: "${appData.donation}"`)
        }
    }


    if (errors.length > 0) {
        throw new Error(errors.join('\n '))
    }
}

function validate_category(category) {
    const errors = []
    const error = error => errors.push("- " + error)

    if (isEmpty(category.name)) {
        error("Name is missing")
    }

    // description is optional
    // if (isEmpty(category.description)) {
    //     error("Description is missing")
    // }

    if (isEmpty(category.icon)) {
        error("Icon is missing")
    } else if (false /** todo check if it is an valid font awesome icon */ ) {
        error("Icon code is not a valid font awesome icon")
    }

    if (errors.length > 0) {
        throw new Error(errors.join('\n '))
    }
}

async function main() {
    let success = true

    const PUBLIC = join(__dirname, '../public')
    await fs.ensureDir(PUBLIC)
    await fs.emptyDir(PUBLIC)

    console.log("Processing categories:")
    const CATEGORIES = join(__dirname, '../categories')
    const cfiles = await fs.readdir(CATEGORIES)

    let categories = {}

    for (let i = 0; i < cfiles.length; i++) {
        const file = cfiles[i]
        console.log("... Processing", file, '...')
        try {
            const yaml_content = await fs.readFile(join(CATEGORIES, file), 'utf-8')
            const data = yaml.load(yaml_content)
            validate_category(data)
            categories[file.replace(/.ya?ml/, "")] = data
        } catch (error) {
            console.error(`Error/s in ${file}:\n`, error.message)
            success = false
        }
    }

    // log all found categories
    console.log("Found the following Categories:", Object.keys(categories), "\n")

    console.log("Processing apps:")

    const APPS = join(__dirname, '../apps')
    const afiles = await fs.readdir(APPS)

    let apps = []

    for (let i = 0; i < afiles.length; i++) {
        const file = afiles[i]
        console.log("... Processing", file, '...')
        try {
            const yaml_content = await fs.readFile(join(APPS, file), 'utf-8')
            const appData = yaml.load(yaml_content)
            validate_apps(appData, Object.keys(categories))
            appData.slug = file.replace(/.ya?ml/, "")
            apps.push(appData)
        } catch (error) {
            console.error(`Error/s in ${file}:\n`, error.message)
            success = false
        }
    }

    await fs.writeJSON(join(PUBLIC, 'data.json'), {
        $schema: "./schema.json",
        version: 1,
        generated_at: Date.now(),
        categories,
        apps
    }, { spaces: DEBUG ? 1 : 0 })

    await fs.copyFile(join(__dirname, 'schema.json'), join(PUBLIC, 'schema.json'))

    if (!success) {
        process.exit(1)
    }
}

main()