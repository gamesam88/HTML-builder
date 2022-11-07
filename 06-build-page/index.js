const fs = require('fs')
const path = require('path')


function streamToString(stream, callback) {
    const chunks = []
    stream.on('data', (chunk) => {
        chunks.push(chunk.toString());
    })
    stream.on('end', () => {
        callback(chunks.join(''))
    })
}

// ------ create HTML -----

let stream = fs.createReadStream('./06-build-page/template.html')

let result = ''

fs.mkdir('./06-build-page/project-dist', { recursive: true }, (err) => {
    if (err) {
        console.error(err)
    }
})

streamToString(stream, (template) => {

    fs.readFile('./06-build-page/components/header.html', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        result = template.replace(/{{header}}/g, data);

        fs.readFile('./06-build-page/components/articles.html', 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            result = result.replace(/{{articles}}/g, data);

            fs.readFile('./06-build-page/components/footer.html', 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                result = result.replace(/{{footer}}/g, data);

                fs.writeFile('./06-build-page/project-dist/index.html', result, (err) => {
                    if (err) {
                        console.error(err)
                    }

                })
            });
        });
    });
})

// ------- create CSS ---------

fs.rm(path.resolve(`06-build-page/project-dist/`, 'style.css'), {
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

            const readStream = fs.createReadStream(path.resolve(`06-build-page/styles/`, element.name))

            readStream.on('data', (chunk) => {

                fs.appendFile(path.resolve(`06-build-page/project-dist/`, 'style.css'), chunk, 'utf8', (err) => {
                    if (err) throw err
                })
            })
        }
    })
})


// ------- create Assets ---------


async function copyDir(dirFrom, dirTo) {

    const pathFrom = path.resolve(__dirname, dirFrom)
    const pathTo = path.resolve(__dirname, dirTo)

    const newFolder = path.resolve(__dirname, dirFrom)

    await fs.promises.mkdir(newFolder, { recursive: true })

    fs.readdir(pathFrom, 'utf8', (error, files) => {
        if (error) throw error

        files.forEach(element => {

            fs.stat(path.resolve(pathFrom, element), (err, stats) => {
                if (err) {
                    console.error(err)
                    return
                }

                if (stats.isDirectory()) {
                    const newFolder = path.resolve(pathTo, element)
                    fs.promises.mkdir(newFolder, { recursive: true })

                    copyDir(path.resolve(pathFrom, element), path.resolve(pathTo, element))
                }

                if (stats.isFile()) {

                    const from = path.resolve(pathFrom, element)
                    const to = path.resolve(pathTo, element)

                    fs.copyFile(from, to, (error) => {
                        if (error) throw error
                    })
                }
            })
        })
    })
}

copyDir('assets', 'project-dist/assets/')










