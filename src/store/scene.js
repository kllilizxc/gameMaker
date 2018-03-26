import {
    stateToActions, stateToGetters, stateToMutations, readScriptFromFile, isLight,
    isCamera
} from '../common/util'
import * as BABYLON from 'babylonjs'
import AssetManager from '@/common/asset-manager'
import { GAMEOBJECT_TYPE, GROUP_TYPE } from '../components/script-field'
import GameObject from '../classes/gameObject'

const getDefaultScriptsPath = name => `static/scripts/${name}.js`

const readDefaultScript = (name, gameObject) => {
    return readScriptFromFile(getDefaultScriptsPath(name), gameObject)
}

const defaultScripts = [
    { name: 'transform', checks: ['position', 'rotation', 'scaling'] }
]

function getScriptObject(scene, script) {
    const { name, Behavior } = script
    const { fields, init, update } = Behavior(BABYLON, scene)
    return { name, fields, init, update }
}

function initScript(scene, gameObject) {
    const promises = []
    defaultScripts.forEach(({ name, checks }) =>
        checkScript(gameObject, checks) && promises.push(readDefaultScript(name, gameObject)))

    return Promise.all(promises).then(scripts =>
        gameObject.scripts = scripts.map(script =>
            getScriptObject(scene, script)))
}

function initScripts(scene, gameObjects) {
    gameObjects.forEach(gameObject =>
        initScript(scene, gameObject).then(() =>
            initScripts(scene, gameObject.getChildren())))
}

function addScript(scene, gameObject, script) {
    gameObject.scripts.push(getScriptObject(scene, script))
}

function registerScript({ scriptsMap, scripts }, id, { name, path }) {
    scriptsMap[id] = scriptsMap[id] || []
    if (!scripts[name]) scripts[name] = path
    scriptsMap[id].push({ name, values: {} })
}

const checkScript = (gameObject, checks) => checks.reduce((result, check) => result && gameObject.getMesh()[check], true)

const SET_SCENE = 'SET_SCENE'
const ADD_GAMEOBJECT = 'ADD_GAMEOBJECT'
const SET_GAMEOBJECTS = 'SET_GAMEOBJECTS'
const ADD_SCRIPT = 'ADD_SCRIPT'
const RESTORE_SCRIPTS = 'RESTORE_SCRIPTS'
const SET_SCRIPTVALUE = 'SET_SCRIPTVALUE'

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
                defaultScripts.forEach(({ name, checks }) => {
                    if (!checkScript(gameObject, checks)) return
                    registerScript(state, gameObject.id, { name, path: getDefaultScriptsPath(name) })
                })
            })
            initScripts(state.scene, gameObjects)
            state.gameObjects = state.gameObjects.concat(gameObjects)
        },
        [SET_GAMEOBJECTS](state, gameObjects) {
            initScripts(state.scene, state.gameObjects)
            state.gameObjects = gameObjects
        },
        [ADD_SCRIPT]({ gameObject, scriptsMap, scripts, scene }, script) {
            console.log(script)
            registerScript({ scriptsMap, scripts }, gameObject.id, script)
            addScript(scene, gameObject, script)
        },
        [RESTORE_SCRIPTS]({ gameObjects, scriptsMap, scripts, scene }) {
            Object.keys(scriptsMap).forEach(id => {
                const gameObject = gameObjects.find(obj => obj.id === id)
                if (!gameObject) return
                scriptsMap[id].map(({ name, values }) => {
                    if (!scripts[name]) return
                    readScriptFromFile(scripts[name], gameObject)
                        .then(script => {
                            const scriptObject = getScriptObject(scene, script)
                            scriptObject.fields.forEach(({ name, type, get, set, options }) => {
                                if (type === GROUP_TYPE) return
                                if (type === GAMEOBJECT_TYPE)
                                    options.value = scene.getMeshByID(values[name]).gameObject
                                else
                                    options.value = values[name] || get()
                                set(options.value)
                            })
                            gameObject.scripts.push(scriptObject)
                        })
                })
            })
        },
        [SET_SCRIPTVALUE]({ gameObject, scriptsMap }, { scriptName, fieldName, value }) {
            const scriptMap = scriptsMap[gameObject.id].find(({ name }) => name === scriptName)
            scriptMap.values = scriptMap.values || {}
            scriptMap.values[fieldName] = value
        }
    },
    actions: {
        ...stateToActions(simpleState),
        setScene: ({ commit, dispatch }, scene) => {
            commit(SET_SCENE, scene)
            window.scene = scene
            logger.log(scene)
            dispatch('setGameObject', null)
            dispatch('setGameObjects', scene.meshes.concat(scene.lights).concat(scene.cameras).filter(obj => !obj.parent).map(obj => new GameObject(obj.name, obj)))
        },
        addGameObject: ({ commit }, gameObjects) => commit(ADD_GAMEOBJECT, gameObjects),
        setGameObjects: ({ commit }, gameObjects) => commit(SET_GAMEOBJECTS, gameObjects),
        addScript: ({ commit, state: { gameObject } }, file) =>
            readScriptFromFile(file, gameObject).then(script => commit(ADD_SCRIPT, script)),
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
        saveScene: ({ state }, filename) => {
            const serializedScene = BABYLON.SceneSerializer.Serialize(state.scene)
            serializedScene.scriptsMap = state.scriptsMap
            serializedScene.scripts = state.scripts
            const getMeshes = gameObjects => gameObjects.map(({ mesh }) => {
                return {
                    id: mesh.id,
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
            BABYLON.SceneLoader.Load('', filename, state.engine, newScene =>
                dispatch('setScene', newScene).then(() => commit(RESTORE_SCRIPTS)))
            AssetManager.readLocalFile(filename, 'utf8')
                .then(data => {
                    data = JSON.parse(data)
                    state.scriptsMap = data.scriptsMap
                    state.scripts = data.scripts
                    state.rawGameObjects = data.rawGameObjects
                })
            state.filename = filename
        },
        setScriptValue: ({ commit }, data) => commit(SET_SCRIPTVALUE, data)
    }
}

function isParent(child, parent) {
    if (!child.getParent()) return false
    return (child.getParent() === parent) || isParent(child.getParent(), parent)
}
