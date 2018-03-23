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

function getScriptObject(scene, gameObject, script) {
    const { name, Behavior } = script
    const { fields, init, update } = Behavior(BABYLON, scene)
    return { name, fields, init, update }
}

function initScript(scene, gameObject) {
    const promises = []
    defaultScripts.forEach(({ name, check }) =>
        gameObject[check] && promises.push(readDefaultScript(name, gameObject)))

    return Promise.all(promises).then(scripts =>
        gameObject.scripts = scripts.map(script =>
            getScriptObject(scene, gameObject, script)))
}

function initScripts(scene, gameObjects) {
    gameObjects.forEach(gameObject =>
        initScript(scene, gameObject).then(() =>
            initScripts(scene, gameObject.getChildren())))
}

function addScript(scene, gameObject, script) {
    gameObject.scripts = gameObject.scripts || []
    gameObject.scripts.push(getScriptObject(scene, gameObject, script))
}

const SET_SCENE = 'SET_SCENE'
const ADD_GAMEOBJECT = 'ADD_GAMEOBJECT'
const SET_GAMEOBJECTS = 'SET_GAMEOBJECTS'
const ADD_SCRIPT = 'ADD_SCRIPT'
const RESTORE_SCRIPTS = 'RESTORE_SCRIPTS'

const logger = console

const simpleState = {
    gameObject: null,
    isPlaying: false,
    engine: null
}

const state = {
    scene: null,
    gameObjects: [],
    scriptsMap: {},
    filename: null
}

function removeInArray(array, compareFunc) {
    const index = array.findIndex(a => compareFunc(a))
    if (index !== -1) array.splice(index, 1)
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
            initScripts(state.scene, gameObjects)
            state.gameObjects = state.gameObjects.concat(gameObjects)
        },
        [SET_GAMEOBJECTS](state, gameObjects) {
            initScripts(state.scene, state.gameObjects)
            state.gameObjects = gameObjects
        },
        [ADD_SCRIPT]({ gameObject, scriptsMap, scene }, script) {
            if (!scriptsMap[gameObject.id]) scriptsMap[gameObject.id] = []
            scriptsMap[gameObject.id].push(script.path)
            addScript(scene, gameObject, script)
        },
        [RESTORE_SCRIPTS]({ gameObjects, scriptsMap, scene }) {
            Object.keys(scriptsMap).forEach(id => {
                const gameObject = gameObjects.find(obj => obj.id === id)
                if (!gameObject) return
                gameObject.scripts = gameObject.scripts || []
                scriptsMap[id].forEach(path =>
                    readScriptFromFile(path, gameObject)
                        .then(script => gameObject.scripts.push(getScriptObject(scene, gameObject, script))))
            })
        }
    },
    actions: {
        ...stateToActions(simpleState),
        setScene: ({ commit, dispatch }, scene) => {
            commit(SET_SCENE, scene)
            window.scene = scene
            logger.log(scene)
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
        setGameObjectParent: ({ state: { gameObjects, childrenGameObjects } }, { child, parent }) => {
            if (isParent(parent, child)) return
            child.parent = parent
            removeInArray(gameObjects, ({ id }) => id === child.id)
        },
        saveScene: ({ state }, filename) => {
            const serializedScene = BABYLON.SceneSerializer.Serialize(state.scene)
            serializedScene.scriptsMap = state.scriptsMap
            AssetManager.writeFile(filename, JSON.stringify(serializedScene))
            state.filename = filename
        },
        openScene: ({ state, dispatch, commit }, filename) => {
            BABYLON.SceneLoader.Load('', filename, state.engine, newScene =>
                dispatch('setScene', newScene).then(() => commit(RESTORE_SCRIPTS)))
            AssetManager.readLocalFile(filename, 'utf8')
                .then(data => state.scriptsMap = JSON.parse(data).scriptsMap)
            state.filename = filename
        }
    }
}

function isParent(child, parent) {
    if (!child.parent) return false
    return (child.parent === parent) || isParent(child.parent, parent)
}
