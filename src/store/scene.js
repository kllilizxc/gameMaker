import { stateToActions, stateToGetters, stateToMutations, readScriptFromFile, UUID } from '../common/util'
import * as BABYLON from 'babylonjs'
import AssetManager from '@/common/asset-manager'

const getDefaultScriptsPath = name => `static/scripts/${name}.js`

const readDefaultScript = (name, gameObject) => {
    return readScriptFromFile(getDefaultScriptsPath(name), gameObject)
}

const defaultScripts = [
    { name: 'transform', check: 'position' }
]

function getScriptObject(gameObject, script) {
    const { name, Behavior } = script
    const { fields, init, update } = Behavior(BABYLON)
    return { name, fields, init, update }
}

function initScript(gameObject) {
    const promises = []
    defaultScripts.forEach(({ name, check }) =>
        gameObject[check] && promises.push(readDefaultScript(name, gameObject)))

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
const RESTORE_SCRIPTS = 'RESTORE_SCRIPTS'

const simpleState = {
    gameObject: null,
    isPlaying: false,
    engine: null
}

const state = {
    scene: null,
    gameObjects: [],
    scriptsMap: {}
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
            gameObjects.forEach(gameObject => {
                gameObject.id = UUID()
                defaultScripts.forEach(({ name, check }) => {
                    if (!gameObject[check]) return
                    if (!state.scriptsMap[gameObject.id]) state.scriptsMap[gameObject.id] = []
                    state.scriptsMap[gameObject.id].push(getDefaultScriptsPath(name))
                })
            })
            initScripts(gameObjects)
            state.gameObjects = state.gameObjects.concat(gameObjects)
        },
        [SET_GAMEOBJECTS](state, gameObjects) {
            initScripts(state.gameObjects)
            state.gameObjects = gameObjects
        },
        [ADD_SCRIPT]({ gameObject, scriptsMap }, script) {
            if (!scriptsMap[gameObject.id]) scriptsMap[gameObject.id] = []
            scriptsMap[gameObject.id].push(script.path)
            addScript(gameObject, script)
        },
        [RESTORE_SCRIPTS]({ gameObjects, scriptsMap }) {
            console.log(gameObjects.map(({id}) => id), scriptsMap)
            Object.keys(scriptsMap).forEach(id => {
                const gameObject = gameObjects.find(obj => obj.id === id)
                if (!gameObject) return
                gameObject.scripts = gameObject.scripts || []
                scriptsMap[id].forEach(path =>
                    readScriptFromFile(path, gameObject)
                        .then(script => gameObject.scripts.push(getScriptObject(gameObject, script))))
            })
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
        saveScene: ({ state: { scene, scriptsMap } }, filename) => {
            const serializedScene = BABYLON.SceneSerializer.Serialize(scene)
            serializedScene.scriptsMap = scriptsMap
            AssetManager.writeFile(filename, JSON.stringify(serializedScene))
        },
        openScene: ({ state: { scene, engine }, dispatch, commit }, filename) => {
            BABYLON.SceneLoader.Load('', filename, engine, newScene =>
                dispatch('setScene', newScene).then(() => commit(RESTORE_SCRIPTS)))
            AssetManager.readLocalFile(filename, 'utf8')
                .then(data => state.scriptsMap = JSON.parse(data).scriptsMap)
        }
    }
}
