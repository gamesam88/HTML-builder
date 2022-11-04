const fs = require('fs')
const path = require('path')

let dirPath = path.resolve('03-files-in-folder/secret-folder')

fs.readdir(dirPath, {
    withFileTypes: true,
    encoding: 'utf8'
}, (err, files) => {
    files.forEach(element => {
        if (element.isFile()) {
            let pos = path.extname(element.name)
            let fileName = path.basename(element.name, pos)
            fs.stat(path.resolve(`${dirPath}/${element.name}`), (err, stat) => {
                console.log(`${fileName} - ${pos.slice(1)} - ${(stat.size / 1024).toFixed(3)}kb`)
            })
        }
    })
})
