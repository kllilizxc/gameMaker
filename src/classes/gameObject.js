import { UUID } from '../common/util'

export default class GameObject {
    constructor(name, mesh) {
        this.id = UUID()
        this.name = name
        this.mesh = mesh
        this.mesh.gameObject = this
        this.scripts = []
    }
    getMesh() {
        return this.mesh
    }
    getScript(name) {
        return this.scripts.find(script => script.name === name)
    }
    addScript(name, scriptObject) {
        this.scripts[name] = scriptObject
    }
    getParent() {
        return this.mesh.parent && this.mesh.parent.gameObject
    }
    getChildren() {
        return this.mesh.getChildren().map(child => child.gameObject)
    }
    setParent(parent) {
        this.mesh.parent = parent.mesh
    }
}
