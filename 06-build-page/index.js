const fs = require('fs')
const path = require('path')


async function streamToString(stream, callback) {
    const chunks = []
    await stream.on('data', (chunk) => {
        chunks.push(chunk.toString());
    })
    await stream.on('end', () => {
        callback(chunks.join(''))
    })
}

async function clear() {
    await fs.promises.rm(path.resolve(__dirname, 'project-dist'), { recursive: true, force: true })
    await fs.promises.mkdir(path.resolve(__dirname, 'project-dist/assets'), { recursive: true }, (err) => {
        if (err) {
            console.error(err)
        }
    })
}

let stream = fs.createReadStream(path.resolve(__dirname, 'template.html'))

streamToString(stream, async (template) => {

    await clear()

    // ------ create HTML -----

    let result = template
    let tags = []

    const components = await fs.promises.readdir(path.resolve('06-build-page/components'), {
        withFileTypes: true,
        encoding: 'utf8'
    })

    components.forEach(element => {
        const postFix = path.extname(element.name)
        if (element.isFile() && postFix === '.html') {
            tags.push(element.name)
        }
    })

    for (let element of tags) {

        let file = await fs.promises.readFile(path.resolve('06-build-page/components/', element))
        result = result.replace(`{{${path.basename(element, '.html')}}}`, file);
    }

    await fs.promises.writeFile('./06-build-page/project-dist/index.html', result, (err) => {
        if (err) {
            console.error(err)
        }
    })

    // ------- create CSS ---------

    let styleFiles = await fs.promises.readdir(path.join(__dirname, 'styles'), {
        withFileTypes: true,
        encoding: 'utf8'
    })

    for (let element of styleFiles) {
        const postFix = path.extname(element.name)
        if (element.isFile() && postFix === '.css') {

            const readStream = fs.createReadStream(path.resolve(`06-build-page/styles/`, element.name))

            readStream.on('data', async (chunk) => {
                await fs.promises.appendFile(path.resolve(`06-build-page/project-dist/`, 'style.css'), chunk, 'utf8', (err) => {
                    if (err) throw err
                })
            })
        }
    }

    copyDir('assets', 'project-dist/assets/')
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












