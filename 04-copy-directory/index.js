const fs = require('fs')
const path = require('path')

async function copyDir() {
    const newFolder = path.join(__dirname, 'files-copy')

    await fs.promises.mkdir(newFolder, { recursive: true })

    fs.readdir(path.join(__dirname, 'files'), 'utf8', (error, files) => {
        if (error) throw error

        files.forEach(element => {
            const from = path.join(__dirname, `files/${element}`)
            const to = path.join(__dirname, `files-copy/${element}`)

            fs.copyFile(from, to, (error) => {
                if (error) throw error
            })

        })
    })
}

copyDir()