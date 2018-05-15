import {
    stateToActions, stateToGetters, stateToMutations, getScriptObject, removeInArray
} from '../common/util'
import * as BABYLON from 'babylonjs'
import AssetManager from '@/common/asset-manager'
import GameObject from '../classes/gameObject'
import Script from '../classes/script'
import { FILE_TYPE } from '@/components/script-field'
import { getDefaultAssets } from './asset'

const SET_SCENE = 'SET_SCENE'
const ADD_GAMEOBJECT = 'ADD_GAMEOBJECT'
const SET_GAMEOBJECTS = 'SET_GAMEOBJECTS'
const ADD_SCRIPT = 'ADD_SCRIPT'
const SET_SCRIPT_VALUE = 'SET_SCRIPT_VALUE'
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
    rawGameObjects: {},
    filename: null
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
            return gameObjects
        },
        [SET_GAMEOBJECTS](state, gameObjects) {
            state.gameObjects = gameObjects
        },
        [ADD_SCRIPT]({ gameObject }, script) {
            gameObject.addScript(new Script(script, gameObject))
        },
        [SET_GROUP_SCRIPT_VALUE]({ gameObject, scriptsMap }, { scriptName, groupName, fieldName, value, type }) {
            if (type === FILE_TYPE) {
                value = value.name
            }
            setObjectIfUndefined(scriptsMap, gameObject.id, scriptName, 'values', groupName)
            scriptsMap[gameObject.id][scriptName].values[groupName][fieldName] = value
        },
        [SET_SCRIPT_VALUE]({ gameObject, scriptsMap }, { scriptName, fieldName, value, type }) {
            if (type === FILE_TYPE) {
                value = value.name
            }
            setObjectIfUndefined(scriptsMap, gameObject.id, scriptName, 'values')
            scriptsMap[gameObject.id][scriptName].values[fieldName] = value
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
        addScript: ({ commit, state }, file) => state.gameObject && commit(ADD_SCRIPT, getScriptObject(file.name, file.data, state.gameObject)),
        setGameObjectParent: ({ state: { gameObjects, childrenGameObjects } }, { child, parent }) => {
            if (parent && isParent(parent, child)) return
            child.setParent(parent)
            removeInArray(gameObjects, ({ id }) => id === child.id)
            if (!parent) gameObjects.push(child)
        },
        newScene: ({ rootState, state, dispatch }) => {
            state.scriptsMap = {}
            rootState.asset.filesMap = {}
            rootState.asset.assets = getDefaultAssets()
            state.gameObjects = []
            state.filename = ''
            return dispatch('setScene', new BABYLON.Scene(state.engine))
        },
        saveScene: ({ state, rootState }) => {
            const serializedScene = {}
            serializedScene.scriptsMap = state.scriptsMap
            serializedScene.filesMap = rootState.asset.filesMap
            serializedScene.assets = rootState.asset.assets
            serializedScene.rawGameObjects = getMeshes(state.gameObjects)
            logger.log(serializedScene)
            AssetManager.writeFile('scene.scene', JSON.stringify(serializedScene))
        },
        openScene: ({ state, rootState, dispatch, commit }, file) => {
            AssetManager.readLocalFile(file)
                .then(data => {
                    data = JSON.parse(data)
                    state.scriptsMap = data.scriptsMap
                    rootState.asset.filesMap = data.filesMap
                    rootState.asset.assets = data.assets
                    state.gameObjects = []
                    state.gameObject = null
                    state.scene = null
                    state.isPlaying = false
                    logger.log(data)
                    dispatch('loadScene', data.rawGameObjects)
                })
        },
        restoreScene: ({ dispatch, state: { gameObjects } }) =>
            dispatch('loadScene', getMeshes(gameObjects)),
        loadScene: ({ dispatch }, rawGameObjects) =>
            dispatch('setScene', new BABYLON.Scene(state.engine)).then(() =>
                rawGameObjects.sort((a, b) => a.sort - b.sort)
                    .forEach(rawGameObject => dispatch('loadGameObject', { rawGameObject }))),
        removeScript({ state, dispatch }, name) {
            if (state.scriptsMap[state.gameObject.id])
                delete state.scriptsMap[state.gameObject.id][name]
            const { gameObject } = state
            dispatch('setGameObject', null)
            gameObject.getMesh().dispose()
            removeInArray(state.gameObjects, obj => obj === this)
            state.gameObject = null
            return dispatch('restoreGameObject', gameObject)
                .then(gameObject => state.gameObject = gameObject)
        },
        restoreGameObject: ({ dispatch }, gameObject) =>
            dispatch('loadGameObject', { rawGameObject: getMesh(gameObject) }),
        loadGameObject: ({ state, dispatch }, { rawGameObject, parent }) => {
            const gameObject = getNewGameObject(rawGameObject, state.scene)
            return Promise.all(rawGameObject.children.map(child =>
                dispatch('loadGameObject', { rawGameObject: child, parent: gameObject })))
                .then(() => dispatch('setGameObjectParent', { child: gameObject, parent }))
                .then(() => gameObject)
        },
        setScriptValue: ({ commit }, data) => commit(SET_SCRIPT_VALUE, data),
        setGroupScriptValue: ({ commit }, data) => commit(SET_GROUP_SCRIPT_VALUE, data),
        createGameObject({ state: { scene }, dispatch, commit }, { name, script, scripts, id, mesh }) {
            const gameObject = getNewGameObject({ id, name }, scene, mesh)
            if (script) scripts = [script]
            return gameObject.addDefaultScripts(scripts)
                .then(() => {
                    dispatch('addGameObject', gameObject)
                    dispatch('setGameObject', gameObject)
                    return gameObject
                })
        },
        duplicateGameObject: ({ dispatch, state: { gameObject } }) => {
            const match = gameObject.name.match(/(.*?)(\d+)?$/)
            const cloned = gameObject.clone(match[1] + (+(match[2] || 0) + 1))
            if (!cloned.getMesh().parent) dispatch('addGameObject', cloned)
            return dispatch('setGameObject', cloned)
        },
        build({ state, dispatch }) {
            const getFilePathFromDir = (dir, filename) => `${dir}/${filename}`
            AssetManager.pickFile('', { directory: true })
                .then(dir => {
                    dispatch('saveScene', getFilePathFromDir(dir, 'index.scene'))
                })
        }
    }
}

function getNewGameObject({ id, name, sort }, scene, mesh) {
    return new GameObject(name, mesh || new BABYLON.Mesh(name, scene), sort, id)
}

function isParent(child, parent) {
    if (!child.getParent()) return false
    return (child.getParent() === parent) || isParent(child.getParent(), parent)
}

const getMesh = gameObject => {
    const { mesh, id, name, sort } = gameObject
    return {
        id,
        name,
        sort,
        className: mesh.getClassName(),
        children: getMeshes(gameObject.getChildren())
    }
}

const getMeshes = gameObjects => gameObjects.map(getMesh)
