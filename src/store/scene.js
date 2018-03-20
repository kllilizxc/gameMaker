import { stateToActions, stateToGetters, stateToMutations, readScriptFromFile } from '../common/util'

const readDefaultScript = name => readScriptFromFile(`static/scripts/${name}.js`)

function initScript(gameObject) {
    const promises = []
    if (gameObject.position)
        promises.push(readDefaultScript('transform'))

    return Promise.all(promises).then(scripts => gameObject.scripts = scripts)
}

function initScripts(gameObjects) {
    gameObjects.forEach(gameObject => initScript(gameObject).then(() => initScripts(gameObject.getChildren())))
}

const SET_SCENE = 'SET_SCENE'
const ADD_GAMEOBJECT = 'ADD_GAMEOBJECT'
const SET_GAMEOBJECTS = 'SET_GAMEOBJECTS'

const simpleState = {
    gameObject: null,
    isPlaying: false
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
            gameObjects = gameObjects.filter(object => !state.gameObjects.some(o => o.id === object.id))
            initScripts(gameObjects)
            state.gameObjects = state.gameObjects.concat(gameObjects)
        },
        [SET_GAMEOBJECTS](state, gameObjects) {
            initScripts(state.gameObjects)
            state.gameObjects = gameObjects
        }
    },
    actions: {
        ...stateToActions(simpleState),
        setScene: ({ commit, dispatch }, scene) => {
            commit(SET_SCENE, scene)
            window.scene = scene
            console.log(scene)
            dispatch('setGameObject', scene)
            dispatch('setGameObjects', scene.meshes.concat(scene.lights))
        },
        addGameObject: ({ commit }, gameObjects) => commit(ADD_GAMEOBJECT, gameObjects),
        setGameObjects: ({ commit }, gameObjects) => commit(SET_GAMEOBJECTS, gameObjects)
    }
}
