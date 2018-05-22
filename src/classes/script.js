import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'
import store from '../store'

const { game } = store.state.scene

function getScriptEvents(script) {
    const { Behavior } = script
    return Behavior(BABYLON, game.scene)
}

function registerScript(id, { name, content }, sort) {
    const { scriptsMap } = game
    scriptsMap[id] = scriptsMap[id] || {}
    // register in filesMap
    game.setFileValue(name, content)
    scriptsMap[id][name] = scriptsMap[id][name] || { sort, values: {} }
}

export default class Script {
    constructor(script, gameObject, sort) {
        this.name = script.name
        const scriptEvents = getScriptEvents(script)
        Object.keys(scriptEvents).forEach(key => scriptEvents[key] && (this[key] = scriptEvents[key]))
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
