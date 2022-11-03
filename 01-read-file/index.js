const fs = require('fs')
const path = require('path')

let textPath = path.resolve('text.txt')

let stream = fs.createReadStream(textPath)

stream.on('data', (data)=>{
  console.log(data.toString())
})