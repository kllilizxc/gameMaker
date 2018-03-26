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
    engine: null
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
            readScriptFromFile(file, gameObject)
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
        setScene: ({ commit, dispatch }, scene) => {
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
            const getMeshes = gameObjects => gameObjects.map(({ id, mesh }) => {
                return {
                    id,
                    name: mesh.name,
                    className: mesh.getClassName(),
                    children: getMeshes(mesh.getChildren())
                }
            })
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
                    dispatch('newScene').then(() => {
                        console.log(data)
                        data.rawGameObjects.forEach(({ id, name }) => dispatch('createGameObject', { name, id }))
                    })
                })
            state.filename = filename
        },
        setScriptValue: ({ commit }, data) => commit(SET_SCRIPTVALUE, data),
        setGroupScriptValue: ({ commit }, data) => commit(SET_GROUP_SCRIPT_VALUE, data),
        createGameObject({ state: { scene }, dispatch, commit }, { name, script, scripts, id }) {
            const box = new GameObject(name, new BABYLON.Mesh(name, scene), id)
            if (script) scripts = [script]
            scripts && Promise.all(scripts.map(name => box.addDefaultScript(name)))
                .then(() => {
                    dispatch('addGameObject', box)
                    dispatch('setGameObject', box)
                })
        }
    }
}

function isParent(child, parent) {
    if (!child.getParent()) return false
    return (child.getParent() === parent) || isParent(child.getParent(), parent)
}
