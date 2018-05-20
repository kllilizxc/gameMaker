import * as BABYLON from 'babylonjs'
import { removeInArray, getScriptObject } from '../common/util'
import { FILE_TYPE } from '@/components/script-field'
import Script from './script'
import GameObject from './gameObject'

export default class Game {
    engine = null
    scene = null
    canvas = null

    scriptsMap = {}
    gameObjects = []
    filesMap = {}

    setCanvas(canvas) {
        this.canvas = canvas
        this.init()
    }

    init() {
        this.engine = createEngine(this.canvas)
        this.scene = createScene(this.engine)
        this.scene.canvas = this.canvas
        window.scene = this.scene
    }

    dispose() {
        if (!this.engine) return
        this.gameObjects = []
        this.engine.stopRenderLoop()
        this.engine.scenes.forEach(scene => scene.dispose())
        this.engine.dispose()
    }

    clearData() {
        this.scriptsMap = {}
        this.gameObjects = []
        this.filesMap = {}
    }

    setScriptsMap(scriptsMap) {
        this.scriptsMap = scriptsMap
    }

    setFilesMap(filesMap) {
        this.filesMap = filesMap
    }

    reload() {
        this.dispose()
        this.init()
    }

    setFileValue(name, content) {
        this.filesMap[name] = content
    }

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject)
    }

    setGameObjects(gameObjects) {
        this.gameObjects = gameObjects
    }

    removeGameObject(gameObject) {
        removeInArray(this.gameObjects, ({ id }) => id === gameObject.id)
    }

    setGameObjectParent({ child, parent }) {
        if (parent && isParent(parent, child)) return
        child.setParent(parent)
        this.removeGameObject(child)
        if (!parent) this.addGameObject(child)
    }

    setGroupScriptValue(gameObject, { scriptName, groupName, fieldName, value, type }) {
        if (type === FILE_TYPE) {
            value = value.name
        }
        setObjectIfUndefined(this.scriptsMap, gameObject.id, scriptName, 'values', groupName)
        this.scriptsMap[gameObject.id][scriptName].values[groupName][fieldName] = value
    }

    setScriptValue(gameObject, { scriptName, fieldName, value, type }) {
        if (type === FILE_TYPE) {
            value = value.name
        }
        setObjectIfUndefined(this.scriptsMap, gameObject.id, scriptName, 'values')
        this.scriptsMap[gameObject.id][scriptName].values[fieldName] = value
    }

    addScript(gameObject, file) {
        gameObject.addScript(new Script(getScriptObject(file.name, file.data, gameObject)))
    }

    removeScript(gameObject, scriptName) {
        if (this.scriptsMap[gameObject.id])
            delete this.scriptsMap[gameObject.id][name]

        gameObject.getMesh().dispose()
        this.removeGameObject(this)
    }

    disposeGameObject(gameObject) {
        delete this.scriptsMap[gameObject.id]
        this.removeGameObject(gameObject)
    }

    loadGameObject(rawGameObject, parent) {
        const gameObject = this.getNewGameObject(rawGameObject)
        rawGameObject.children.forEach(child => {
            this.loadGameObject(child, gameObject)
            this.setGameObjectParent({ child: gameObject, parent })
        })
        this.addGameObject(gameObject)
        return gameObject
    }

    getNewGameObject({ id, name, sort }, mesh) {
        return new GameObject(name, mesh || createMesh(name, this.scene), sort, id)
    }

    async createGameObject({ name, script, scripts, id, mesh }) {
        if (script) scripts = [script]
        const gameObject = this.getNewGameObject({ id, name }, this.scene, mesh)
        await gameObject.addDefaultScripts(scripts)
        this.addGameObject(gameObject)
        return gameObject
    }

    setCameraTarget(gameObject) {
        const { scene } = this
        if (scene && scene.activeCamera && scene.activeCamera.setTarget)
            scene.activeCamera.setTarget(gameObject.getMesh().getAbsolutePosition())
    }

    getGameObjectById(id) {
        const mesh = this.scene.getMeshByID(id)
        return mesh && mesh.gameObject
    }

    getMaxGameObjectsSort() {
        return this.gameObjects.reduce((max, cur) => Math.max(max, cur.sort), -1)
    }

    cloneScriptsMap(sourceId, targetId) {
        this.scriptsMap[targetId] = JSON.parse(JSON.stringify(this.scriptsMap[sourceId]))
    }
}

function isParent(child, parent) {
    if (!child.getParent()) return false
    return (child.getParent() === parent) || isParent(child.getParent(), parent)
}

function setObjectIfUndefined(obj, ...keys) {
    keys.forEach(key => {
        obj[key] = obj[key] || {}
        obj = obj[key]
    })
}

function createEngine(canvas) {
    return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true })
}

function createScene(engine) {
    return new BABYLON.Scene(engine)
}

function createMesh(name, scene) {
    return new BABYLON.Mesh(name, scene)
}