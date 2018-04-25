import * as BABYLON from 'babylonjs'
import store from '../store'

const sceneStore = store.state.scene
const assetStore = store.state.asset

function getScriptObject(script) {
    const { name, Behavior } = script
    const events = Behavior(BABYLON, sceneStore.scene)
    return { name, ...events }
}

function registerScript(id, { name, content }, sort) {
    const { scriptsMap } = sceneStore
    const { filesMap } = assetStore
    scriptsMap[id] = scriptsMap[id] || {}
    // register in filesMap
    if (!filesMap[name]) filesMap[name] = content
    scriptsMap[id][name] = scriptsMap[id][name] || { sort, values: {} }
}

export default class Script {
    constructor(script, gameObject, sort) {
        const scriptObject = getScriptObject(script)
        Object.keys(scriptObject).forEach(key => this[key] = scriptObject[key])
        this.sort = sort !== undefined
            ? sort
            : Object.keys(gameObject.scripts)
            .reduce((max, cur) => Math.max(max, gameObject.scripts[cur].sort), -1) + 1
        registerScript(gameObject.id, script, this.sort)
        this.actions && Object.keys(this.actions).forEach(name => this[name] = this.actions[name])
    }

    action(name, ...args) {
        if (!this.actions) return
        const action = this.actions[name]
        action && action(...args)
    }
}
