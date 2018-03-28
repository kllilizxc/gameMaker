import {
    stateToActions, stateToGetters, stateToMutations, readScriptFromFile, isLight,
    isCamera
} from '../common/util'
import * as BABYLON from 'babylonjs'
import AssetManager from '@/common/asset-manager'
import GameObject from '../classes/gameObject'
import Script from '../classes/script'

const SET_SCENE = 'SET_SCENE'
const ADD_GAMEOBJECT = 'ADD_GAMEOBJECT'
const SET_GAMEOBJECTS = 'SET_GAMEOBJECTS'
const ADD_SCRIPT = 'ADD_SCRIPT'
const SET_SCRIPTVALUE = 'SET_SCRIPTVALUE'
const SET_GROUP_SCRIPT_VALUE = 'SET_GROUP_SCRIPT_VALUE'

const logger = console

const simpleState = {
    gameObject: null,
    isPlaying: false,
    engine: null,
    canvas: null
}

const state = {
    scene: null,
    gameObjects: [],
    scriptsMap: {},
    scripts: {},
    rawGameObjects: {},
    filename: null
}

function removeInArray(array, compareFunc) {
    const index = array.findIndex(a => compareFunc(a))
    if (index !== -1) array.splice(index, 1)
}

function setObjectIfUndefined(obj, ...keys) {
    keys.forEach(key => {
        obj[key] = obj[key] || {}
        obj = obj[key]
    })
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
            state.gameObjects = state.gameObjects.concat(gameObjects)
        },
        [SET_GAMEOBJECTS](state, gameObjects) {
            state.gameObjects = gameObjects
        },
        [ADD_SCRIPT]({ gameObject }, file) {
            return readScriptFromFile(file, gameObject)
                .then(script => gameObject.addScript(new Script(script, gameObject)))
        },
        [SET_GROUP_SCRIPT_VALUE]({ gameObject, scriptsMap }, { scriptName, groupName, fieldName, value }) {
            setObjectIfUndefined(scriptsMap, gameObject.id, scriptName, groupName)
            scriptsMap[gameObject.id][scriptName][groupName][fieldName] = value
        },
        [SET_SCRIPTVALUE]({ gameObject, scriptsMap }, { scriptName, fieldName, value }) {
            setObjectIfUndefined(scriptsMap, gameObject.id, scriptName)
            scriptsMap[gameObject.id][scriptName][fieldName] = value
        }
    },
    actions: {
        ...stateToActions(simpleState),
        setScene: ({ state, commit, dispatch }, scene) => {
            scene.canvas = state.canvas
            commit(SET_SCENE, scene)
            window.scene = scene
            logger.log(scene)
            dispatch('setGameObject', null)
        },
        addGameObject: ({ commit }, gameObjects) => commit(ADD_GAMEOBJECT, gameObjects),
        setGameObjects: ({ commit }, gameObjects) => commit(SET_GAMEOBJECTS, gameObjects),
        addScript: ({ commit }, file) => commit(ADD_SCRIPT, file),
        removeGameObject: ({ state: { gameObjects } }, obj) => {
            obj.getMesh().dispose()
            gameObjects.splice(gameObjects.findIndex(gameObject => gameObject === obj), 1)
        },
        setGameObjectParent: ({ state: { gameObjects, childrenGameObjects } }, { child, parent }) => {
            if (parent && (isLight(parent.getMesh()) || isCamera(parent.getMesh()) || isParent(parent, child))) return
            child.setParent(parent)
            removeInArray(gameObjects, ({ id }) => id === child.id)
            if (!parent) gameObjects.push(child)
        },
        newScene: ({ state: { engine }, dispatch }) => dispatch('setScene', new BABYLON.Scene(engine)),
        saveScene: ({ state }, filename) => {
            const serializedScene = {}
            serializedScene.scriptsMap = state.scriptsMap
            serializedScene.scripts = state.scripts
            serializedScene.rawGameObjects = getMeshes(state.gameObjects)
            logger.log(serializedScene)
            AssetManager.writeFile(filename, JSON.stringify(serializedScene))
            state.filename = filename
        },
        openScene: ({ state, dispatch, commit }, filename) => {
            AssetManager.readLocalFile(filename, 'utf8')
                .then(data => {
                    data = JSON.parse(data)
                    state.scriptsMap = data.scriptsMap
                    state.scripts = data.scripts
                    state.gameObjects = []
                    state.gameObject = null
                    state.scene = null
                    state.isPlaying = false
                    dispatch('loadScene', data.rawGameObjects)
                })
            state.filename = filename
        },
        restoreScene: ({ dispatch, state: { gameObjects } }) =>
            dispatch('loadScene', getMeshes(gameObjects)),
        loadScene: ({ dispatch }, rawGameObjects) => {
            const setMeshes = (gameObjects, parent) => gameObjects && Promise.all(gameObjects.map(rawGameObject => {
                const gameObject = getNewGameObject(rawGameObject, state.scene)
                return setMeshes(rawGameObject.children, gameObject)
                    .then(() => dispatch('setGameObjectParent', { child: gameObject, parent }))
            }))
            dispatch('newScene').then(() => setMeshes(rawGameObjects))
        },
        setScriptValue: ({ commit }, data) => commit(SET_SCRIPTVALUE, data),
        setGroupScriptValue: ({ commit }, data) => commit(SET_GROUP_SCRIPT_VALUE, data),
        createGameObject({ state: { scene }, dispatch, commit }, { name, script, scripts, id }) {
            const gameObject = getNewGameObject({ id, name }, scene)
            if (script) scripts = [script]
            return (scripts
                ? Promise.all(scripts.map(name => gameObject.addDefaultScript(name))).then(() => gameObject)
                : Promise.resolve(gameObject))
                .then(gameObject => {
                    dispatch('addGameObject', gameObject)
                    dispatch('setGameObject', gameObject)
                })
        }
    }
}

function getNewGameObject({ id, name }, scene) {
    return new GameObject(name, new BABYLON.Mesh(name, scene), id)
}

function isParent(child, parent) {
    if (!child.getParent()) return false
    return (child.getParent() === parent) || isParent(child.getParent(), parent)
}

const getMeshes = gameObjects => gameObjects.map(gameObject => {
    const { mesh, id, name } = gameObject
    return {
        id,
        name,
        className: mesh.getClassName(),
        children: getMeshes(gameObject.getChildren())
    }
})
