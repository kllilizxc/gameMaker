import * as BABYLON from 'babylonjs'
import store from '../store'
const sceneStore = store.state.scene

function getScriptObject(script) {
    const { name, Behavior } = script
    const events = Behavior(BABYLON, sceneStore.scene)
    return { name, ...events }
}

function registerScript(id, { name, path }) {
    const { scriptsMap, scripts } = sceneStore
    scriptsMap[id] = scriptsMap[id] || {}
    if (!scripts[name]) scripts[name] = path
    scriptsMap[id][name] = {}
}

export default class Script {
    constructor(script, gameObject) {
        const scriptObject = getScriptObject(script)
        Object.keys(scriptObject).forEach(key => this[key] = scriptObject[key])
        registerScript(gameObject.id, script)
    }
    action(name, ...args) {
        if (!this.actions) return
        const action = this.actions[name]
        action && action(...args)
    }
}
