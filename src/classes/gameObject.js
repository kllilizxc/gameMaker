import { UUID, readScriptFromFile } from '../common/util'
import Script from './script'
import store from '../store'
import { GAMEOBJECT_TYPE, GROUP_TYPE } from '../components/script-field'

const sceneStore = store.state.scene

const getDefaultScriptsPath = name => `static/scripts/${name}.js`

const defaultScripts = [
    { name: 'transform', checks: ['position', 'rotation', 'scaling'] }
]

const checkScript = (gameObject, checks) => checks.reduce((result, check) => result && gameObject.getMesh()[check], true)

const restoreFieldsValues = (fields, values) => Object.keys(fields).forEach(name => {
    const field = fields[name]
    if (!field) return
    field.options = field.options || {}
    const { type, get, set, options, children } = field
    if (type === GROUP_TYPE)
        return restoreFieldsValues(children, values[name])
    else if (type === GAMEOBJECT_TYPE)
        options.value = GameObject.findGameObjectById(values[name])
    else
        options.value = (values && values[name]) || get()
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
        } else {
            this.addDefaultScripts()
        }
    }

    static findGameObjectById(id) {
        return sceneStore.scene.getMeshByID(id) && sceneStore.scene.getMeshByID(id).gameObject
    }

    addDefaultScript(name) {
        return readScriptFromFile(getDefaultScriptsPath(name), this)
            .then(script => this.addScript(new Script(script, this)))
    }

    addDefaultScripts() {
        return Promise.all(defaultScripts.map(({ name, checks }) =>
            checkScript(this, checks) && this.addDefaultScript(name)))
    }

    getMesh() {
        return this.mesh
    }

    getScript(name) {
        return this.scripts[name]
    }

    addScript(scriptObject) {
        this.scripts[scriptObject.name] = scriptObject
    }

    getParent() {
        return this.mesh.parent && this.mesh.parent.gameObject
    }

    getChildren() {
        return this.mesh.getChildren().map(child => child.gameObject)
    }

    setParent(parent) {
        this.mesh.parent = parent && parent.mesh
    }
}
