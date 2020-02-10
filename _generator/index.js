const fs = require('fs-extra')
const yaml = require('js-yaml')
const { join } = require('path')
const DEBUG = process.env.ENV === "DEVELOPMENT"

/** Checks if everything is valid and if the data is complete */
function validate(appData) {

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
        console.log("processing", file)
        try {
            const yaml_content = await fs.readFile(join(APPS, file), 'utf-8')
            const appData = yaml.load(yaml_content)
            validate(appData)
            appData.slug = file
            apps.push(appData)
        } catch (error) {
            console.error(`Error in ${file}`, error)
            success = false
        }
    }

    await fs.writeJSON(join(PUBLIC, 'data.json'), {
        generated_at: Date.now(),
        apps
    }, { spaces: DEBUG ? 1 : 0 })

    if (!success) {
        process.exit(1)
    }
}

main()