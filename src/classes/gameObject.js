import { UUID, readScriptFromFile, removeInArray } from '../common/util'
import Script from './script'
import store from '../store'
import { GAMEOBJECT_TYPE, GROUP_TYPE, FILE_TYPE } from '../components/script-field'

const sceneStore = store.state.scene

const getDefaultScriptsPath = name => `static/scripts/${name}.js`

const restoreFieldsValues = (fields, values) => Object.keys(fields).forEach(name => {
    if (values[name] === undefined) return
    const field = fields[name]
    if (!field) return
    field.options = field.options || {}
    const { type, get, set, options, children } = field
    if (type === GROUP_TYPE)
        return restoreFieldsValues(children, values[name])
    else if (type === GAMEOBJECT_TYPE)
        options.value = GameObject.findGameObjectById(values[name])
    else if (type === FILE_TYPE) {
        options.value = values && sceneStore.filesMap[values[name]]
    } else {
        options.value = values && values[name]
        if (options.value === undefined) options.value = get()
    }
    set(options.value)
})

export default class GameObject {
    constructor(name, mesh, sort, id = UUID()) {
        this.id = id
        this.name = name
        this.mesh = mesh
        this.mesh.id = id
        this.mesh.receiveShadows = true
        this.mesh.checkCollisions = true
        this.mesh.gameObject = this
        this.scripts = {}
        this.scriptsReadyHandlers = []
        const scriptsMap = sceneStore.scriptsMap[this.id]
        this.sort = sort !== undefined
            ? sort
            : sceneStore.gameObjects.reduce((max, cur) => Math.max(max, cur.sort), -1) + 1
        if (scriptsMap) {
            Object.keys(scriptsMap)
                .sort((a, b) => scriptsMap[a].sort - scriptsMap[b].sort)
                .map(name => {
                    const scriptPath = sceneStore.scripts[name]
                    const values = scriptsMap[name].values
                    return readScriptFromFile(scriptPath, this).then(script => {
                        const scriptObject = new Script(script, this, scriptsMap[name].sort)
                        const { fields } = scriptObject
                        fields && restoreFieldsValues(fields, values)
                        this.addScript(scriptObject)
                    })
                })
        }
    }

    clone(name) {
        const id = UUID()
        sceneStore.scriptsMap[id] = JSON.parse(JSON.stringify(sceneStore.scriptsMap[this.id]))
        this.mesh.gameObject = null
        const clonedMesh = this.mesh.clone()
        this.mesh.gameObject = this
        clonedMesh.gameObject = new GameObject(name, clonedMesh, null, id)
        return clonedMesh.gameObject
    }

    static findGameObjectById(id) {
        return sceneStore.scene.getMeshByID(id) && sceneStore.scene.getMeshByID(id).gameObject
    }

    addDefaultScript(name) {
        const path = getDefaultScriptsPath(name)
        return readScriptFromFile(path, this)
            .then(script => this.addScript(new Script({ ...script, path }, this)))
    }

    addDefaultScripts(scriptNames) {
        return Promise.all(scriptNames.map(name => {
            const path = getDefaultScriptsPath(name)
            return readScriptFromFile(path, this).then(script => ({ ...script, path }))
        })).then(scripts => scripts.forEach(script => this.addScript(new Script(script, this))))
    }

    onScriptsReady() {
        this.scriptsReadyHandlers.forEach(handler => handler())
    }

    registerScriptsReadyHandler(handler) {
        if (!this.scriptsReadyHandlers.find(h => h === handler))
            this.scriptsReadyHandlers.push(handler)
    }

    removeScriptsReadyHanlder(handler) {
        removeInArray(this.scriptsReadyHandlers, h => h === handler)
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
        if (scriptObject.actions)
            Object.keys(scriptObject.actions).forEach(name => this[name] = scriptObject.actions[name])
        this.onScriptsReady()
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

    dispose() {
        this.mesh.dispose()
        delete sceneStore.scriptsMap[this.id]
        removeInArray(sceneStore.gameObjects, obj => obj === this)
        sceneStore.gameObject = null
    }

    callEvent(eventName) {
        const { scripts } = this
        scripts && Object.keys(scripts).map(key => scripts[key])
            .forEach(script => script[eventName] && script[eventName].bind(this)())

        const children = this.getChildren()
        if (children)
            children.forEach(child => this.callEvent.call(child, eventName))
    }
}
