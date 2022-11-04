const fs = require('fs')
const path = require('path')
const { stdin: input, stdout: output } = require('process')

const writeStream = fs.createWriteStream(path.join(__dirname, 'new-text.txt'), 'utf-8')

output.write('Hello! Write anything... ')

input.on('data', (data) => {
    if (data.toString().trim() == 'exit') {
        output.write('\nThanks for everything!')
        process.exit()
    }
    writeStream.write(data)
})

process.on('SIGINT', () => {
    output.write('\nThanks for everything!')
    process.exit()
});
