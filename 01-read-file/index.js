const fs = require('fs')
const path = require('path')

let textPath = path.resolve('01-read-file/text.txt')

let stream = fs.createReadStream(textPath)

stream.on('data', (data) => {
    console.log(data.toString())
})