// @flow

export default class AssetManager {
    static readFile = file => fetch(file).then(response => Promise.resolve(response.text()))

    static readFileSync = async file => await this.readFile(file)

    static readLocalFileByPath = file => fetch(file).then(data => {
        console.log(data)
        return data
    })

    static readLocalFile = (file, asUrl = false) => new Promise(resolve => {
        if (typeof file === 'string') return AssetManager.readLocalFileByPath(file)

        const reader = new FileReader()

        // Closure to capture the file information.
        reader.onload = e => resolve(e.target.result)

        // Read in the image file as a data URL.
        reader[asUrl ? 'readAsDataURL' : 'readAsText'](file)
    })

    static writeFile = (filename, data) => {
        const file = new Blob([data])
        const a = document.createElement('a')
        const url = URL.createObjectURL(file)
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        setTimeout(function() {
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        }, 0)
    }

    static pickFile = (filters = '', { multiple, directory }) => new Promise(resolve => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = filters
        input.multiple = multiple
        input.directory = directory
        input.addEventListener('change', () => resolve(input.files))
        input.click()
    })
}