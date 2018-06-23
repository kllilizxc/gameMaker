import {
    getDuplicatedName,
    stateToActions, stateToGetters, stateToMutations
} from '../common/util'
import AssetManager from '@/common/asset-manager'
import Game from '../classes/game'
import UndoableAction from '@/classes/undoableAction'

const logger = console

const simpleState = {
    isLoading: false,
    isPlaying: false,
    game: new Game(),
    currentFile: null
}

const state = {
    gameObject: null,
    currentFileUpdated: false
}

export default {
    state: { ...simpleState, ...state },
    getters: stateToGetters({ ...simpleState, ...state }),
    mutations: {
        ...stateToMutations(simpleState)
    },
    actions: {
        ...stateToActions(simpleState),
        setGameObject({ state }, gameObject) {
            UndoableAction.addAction(new UndoableAction(state.gameObject, gameObject, val => state.gameObject = val))
        },
        currentFileUpdate: ({ state }) =>
            state.currentFileUpdated = !state.currentFileUpdated,
        setFileValue: ({ state, dispatch }, { name, content }) => {
            state.game.setFileValue(name, content)
            dispatch('currentFileUpdate')
        },
        createFile: ({ dispatch }, file) =>
            dispatch('setFileValue', { name: file.name, content: file.data }),
        editFileName: ({ state: { game } }, { oldName, name }) => {
            const value = game.filesMap[oldName]
            delete game.filesMap[oldName]
            game.filesMap[name] = value
        },
        newScene: ({ state: { game }, dispatch }) => {
            dispatch('clearAssets')
            game.clearData()
            game.reload()
            dispatch('setGameObject', null)
        },
        saveScene: ({ state: { game }, rootState: { asset } }) => {
            const serializedScene = {}
            serializedScene.scriptsMap = game.scriptsMap
            serializedScene.filesMap = game.filesMap
            serializedScene.assets = asset.assets
            serializedScene.rawGameObjects = getRawGameObjects(game.gameObjects)
            // logger.log(serializedScene)
            AssetManager.writeFile('scene.scene', JSON.stringify(serializedScene))
        },
        openScene: ({ state: { game }, dispatch, commit }, file) =>
            AssetManager.readLocalFile(file)
                .then(data => {
                    // A scene file contains following data:
                    // 1. A raw gameObjects tree, containing the ids, names and parenting data of gameObjects in the scene
                    // 2. A scripts map, containiing the scripts attached to each gameObject and the values of the script fields
                    // 3. A files map, containing the content of the files uploaded to the scene
                    // 4. A assets map, containing the category of each file uploaded to the scene

                    data = JSON.parse(data)
                    game.clearData()
                    game.setScriptsMap(data.scriptsMap)
                    game.setFilesMap(data.filesMap)
                    dispatch('setAssets', data.assets)
                    commit('SET_GAMEOBJECT', null)
                    commit('SET_ISPLAYING', false)
                    // logger.log(data, game)
                    return dispatch('loadRawGameObjects', data.rawGameObjects)
                }),
        restoreScene: ({ dispatch, state: { game: { gameObjects } } }) =>
            dispatch('loadRawGameObjects', getRawGameObjects(gameObjects)),
        loadRawGameObjects: ({ dispatch, state: { game } }, rawGameObjects) => {
            game.reload()
            rawGameObjects.sort((a, b) => a.sort - b.sort)
                .forEach(gameObject => game.loadGameObject(gameObject))
        },
        removeScript({ state, dispatch }, name) {
            const { gameObject, game } = state
            return dispatch('setGameObject', game.removeScript(gameObject, name))
        },
        createGameObject: ({ state: { game }, dispatch }, data) =>
            game.createGameObject(data)
                .then(gameObject => {
                    dispatch('setGameObject', gameObject)
                    return gameObject
                }),
        duplicateGameObject: ({ dispatch, state: { gameObject, game } }) => {
            const cloned = gameObject.clone(getDuplicatedName(gameObject.name))
            if (!cloned.getParent()) game.addGameObject(cloned)
            return dispatch('setGameObject', cloned)
        }
    }
}

export const getRawGameObject = gameObject => {
    const { mesh, id, name, sort } = gameObject
    return {
        id,
        name,
        sort,
        className: mesh.getClassName(),
        children: getRawGameObjects(gameObject.getChildren())
    }
}

const getRawGameObjects = gameObjects => gameObjects.map(getRawGameObject)
