// @flow
export default class AssetManager {
    static readFile = file => new Promise(resolve => {
        let reader = new FileReader()
        reader.onload = e => resolve(e.target.result)
        reader.readAsText(file)
    })
    static readFileSync = async file => await this.readFile(file)
}
