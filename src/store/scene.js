import { stateToActions, stateToGetters, stateToMutations, readScriptFromFile, UUID } from '../common/util'
import * as BABYLON from 'babylonjs'
import AssetManager from '@/common/asset-manager'

const readDefaultScript = (name, gameObject) => {
    return readScriptFromFile(`static/scripts/${name}.js`, gameObject)
}

function getScriptObject(gameObject, script) {
    const { name, Behavior } = script
    const { fields, init, update } = Behavior(BABYLON)
    return { name, fields, init, update }
}

function initScript(gameObject) {
    const promises = []
    if (gameObject.position)
        promises.push(readDefaultScript('transform', gameObject))

    return Promise.all(promises).then(scripts =>
        gameObject.scripts = scripts.map(script =>
            getScriptObject(gameObject, script)))
}

function initScripts(gameObjects) {
    gameObjects.forEach(gameObject =>
        initScript(gameObject).then(() =>
            initScripts(gameObject.getChildren())))
}

function addScript(gameObject, script) {
    gameObject.scripts = gameObject.scripts || []
    gameObject.scripts.push(getScriptObject(gameObject, script))
}

const SET_SCENE = 'SET_SCENE'
const ADD_GAMEOBJECT = 'ADD_GAMEOBJECT'
const SET_GAMEOBJECTS = 'SET_GAMEOBJECTS'
const ADD_SCRIPT = 'ADD_SCRIPT'

const simpleState = {
    gameObject: null,
    isPlaying: false,
    engine: null
}

const state = {
    scene: null,
    gameObjects: []
}

export default {
    state: { ...simpleState, ...state },
    getters: stateToGetters({ ...simpleState, ...state }),
    mutations: {
        ...stateToMutations(simpleState),
        [SET_SCENE](state, scene) {
            state.scene = scene
        },
        [ADD_GAMEOBJECT](state, gameObjects) {
            if (!Array.isArray(gameObjects)) gameObjects = [gameObjects]
            gameObjects.forEach(gameObject => gameObject.id = UUID())
            initScripts(gameObjects)
            state.gameObjects = state.gameObjects.concat(gameObjects)
        },
        [SET_GAMEOBJECTS](state, gameObjects) {
            initScripts(state.gameObjects)
            state.gameObjects = gameObjects
        },
        [ADD_SCRIPT](state, script) {
            addScript(state.gameObject, script)
        }
    },
    actions: {
        ...stateToActions(simpleState),
        setScene: ({ commit, dispatch }, scene) => {
            commit(SET_SCENE, scene)
            window.scene = scene
            console.log(scene)
            dispatch('setGameObject', scene)
            dispatch('setGameObjects', scene.meshes.concat(scene.lights).concat(scene.cameras))
        },
        addGameObject: ({ commit }, gameObjects) => commit(ADD_GAMEOBJECT, gameObjects),
        setGameObjects: ({ commit }, gameObjects) => commit(SET_GAMEOBJECTS, gameObjects),
        addScript: ({ commit, state: { gameObject } }, file) =>
            readScriptFromFile(file, gameObject).then(script => commit(ADD_SCRIPT, script)),
        removeGameObject: ({ state: { gameObjects } }, obj) => {
            obj.dispose()
            gameObjects.splice(gameObjects.findIndex(gameObject => gameObject === obj), 1)
        },
        saveScene: ({ state: { scene } }, filename) => {
            const serializedScene = BABYLON.SceneSerializer.Serialize(scene)
            AssetManager.writeFile(filename, JSON.stringify(serializedScene))
        },
        openScene: ({ state: { scene, engine }, dispatch }, filename) => {
            BABYLON.SceneLoader.Load('', filename, engine, newScene => dispatch('setScene', newScene))
        }
    }
}
