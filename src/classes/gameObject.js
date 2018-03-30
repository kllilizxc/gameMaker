import { UUID, readScriptFromFile } from '../common/util'
import Script from './script'
import store from '../store'
import { GAMEOBJECT_TYPE, GROUP_TYPE } from '../components/script-field'

const sceneStore = store.state.scene

const getDefaultScriptsPath = name => `static/scripts/${name}.js`

const restoreFieldsValues = (fields, values) => Object.keys(fields).forEach(name => {
    const field = fields[name]
    if (!field) return
    field.options = field.options || {}
    const { type, get, set, options, children } = field
    if (type === GROUP_TYPE)
        return restoreFieldsValues(children, values[name])
    else if (type === GAMEOBJECT_TYPE)
        options.value = GameObject.findGameObjectById(values[name])
    else {
        options.value = values && values[name]
        if (options.value === undefined) options.value = get()
    }
    set(options.value)
})

export default class GameObject {
    constructor(name, mesh, id = UUID()) {
        this.id = id
        this.name = name
        this.mesh = mesh
        this.mesh.id = id
        this.mesh.gameObject = this
        this.scripts = {}
        const scriptsMap = sceneStore.scriptsMap[this.id]
        if (scriptsMap) {
            Object.keys(scriptsMap).map(name => {
                const scriptPath = sceneStore.scripts[name]
                const values = scriptsMap[name]
                readScriptFromFile(scriptPath, this).then(script => {
                    const scriptObject = new Script(script, this)
                    const { fields } = scriptObject
                    fields && restoreFieldsValues(fields, values)
                    this.addScript(scriptObject)
                })
            })
        }
    }

    static findGameObjectById(id) {
        return sceneStore.scene.getMeshByID(id) && sceneStore.scene.getMeshByID(id).gameObject
    }

    addDefaultScript(name) {
        return readScriptFromFile(getDefaultScriptsPath(name), this)
            .then(script => this.addScript(new Script(script, this)))
    }

    getMesh() {
        return this.mesh
    }

    setMesh(mesh) {
        const { parent } = this.mesh
        if (parent) mesh.parent = parent
        this.mesh.dispose()
        this.mesh = mesh
    }

    getScript(name) {
        return this.scripts[name]
    }

    addScript(scriptObject) {
        this.scripts[scriptObject.name] = scriptObject
        this[scriptObject.name] = scriptObject
    }

    getParent() {
        return this.mesh.parent && this.mesh.parent.gameObject
    }

    getChildren() {
        return this.mesh.getChildren().map(child => child.gameObject).filter(o => o)
    }

    setParent(parent) {
        this.mesh.parent = parent && parent.mesh
    }
}
