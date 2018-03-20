import { stateToActions, stateToGetters, stateToMutations, readScriptFromFile } from '../common/util'

const readDefaultScript = name => readScriptFromFile(`static/scripts/${name}.js`)

function initScript(gameObject) {
    const promises = []
    if (gameObject.position)
        promises.push(readDefaultScript('transform'))

    return Promise.all(promises).then(scripts => gameObject.scripts = scripts)
}

function initScripts(scene) {
    initScript(scene).then(() =>
        scene.meshes && scene.meshes.forEach(child => initScripts(child)))
}

const SET_SCENE = 'SET_SCENE'

const simpleState = {
    gameObject: null,
    gameObjects: [],
    isPlaying: false
}

const state = {
    scene: null
}

export default {
    state: { ...simpleState, ...state },
    getters: stateToGetters({ ...simpleState, ...state }),
    mutations: {
        ...stateToMutations(simpleState),
        [SET_SCENE](state, scene) {
            initScripts(scene)
            state.scene = scene
        }
    },
    actions: {
        ...stateToActions(simpleState),
        setScene: ({ commit, dispatch }, scene) => {
            commit(SET_SCENE, scene)
            window.scene = scene
            console.log(scene)
            dispatch('setGameObject', scene)
            dispatch('setGameObjects', scene.meshes)
        }
    }
}
