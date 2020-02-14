const fs = require('fs-extra')
const yaml = require('js-yaml')
const { join } = require('path')
const isUrl = require('is-url-superb')

const DEBUG = process.env.ENV === "DEVELOPMENT"

const isEmpty = (string) => !string || string.trim().length == 0

/** Checks if everything is valid and if the data is complete */
function validate(appData) {
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

    if (!appData.meta || isEmpty(appData.meta.tags)) {
        error("meta.tags missing")
    }

    if (!appData.meta || isEmpty(appData.meta.category)) {
        error("meta.category missing")
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


    if (errors.length > 0) {
        throw new Error(errors.join('\n '))
    }
}

async function main() {

    const PUBLIC = join(__dirname, '../public')
    await fs.ensureDir(PUBLIC)
    await fs.emptyDir(PUBLIC)

    const APPS = join(__dirname, '../apps')

    const files = await fs.readdir(APPS)

    let success = true
    let apps = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log("... Processing", file, '...')
        try {
            const yaml_content = await fs.readFile(join(APPS, file), 'utf-8')
            const appData = yaml.load(yaml_content)
            validate(appData)
            appData.slug = file
            apps.push(appData)
        } catch (error) {
            console.error(`Error/s in ${file}:\n`, error.message)
            success = false
        }
    }

    await fs.writeJSON(join(PUBLIC, 'data.json'), {
        version: 1,
        generated_at: Date.now(),
        apps
    }, { spaces: DEBUG ? 1 : 0 })

    if (!success) {
        process.exit(1)
    }
}

main()