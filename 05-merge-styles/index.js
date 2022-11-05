const fs = require('fs')
const path = require('path')

fs.rm(path.resolve(`05-merge-styles/project-dist/`, 'bundle.css'), {
    recursive: true
}, () => { })

fs.readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
    encoding: 'utf8'
}, (error, files) => {
    if (error) throw error

    files.forEach(element => {
        const postFix = path.extname(element.name)
        if (element.isFile() && postFix === '.css') {

            const readStream = fs.createReadStream(path.resolve(`05-merge-styles/styles/`, element.name))

            readStream.on('data', (chunk) => {

                fs.appendFile(path.resolve(`05-merge-styles/project-dist/`, 'bundle.css'), chunk, 'utf8', (err) => {
                    if (err) throw err
                })
            })
        }
    })
})
