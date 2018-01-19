import { stateToGetters } from '../common/util'

const SET_GAMEOBJECT = 'SET_GAMEOBJECT'

const state = {
    gameObject: null
}

export default {
    state,
    getters: stateToGetters(state),
    mutations: {
        [SET_GAMEOBJECT](state, gameObject) {
            state.gameObject = gameObject
        }
    },
    actions: {
        setGameObject: ({ commit }, gameObject) =>
            commit(SET_GAMEOBJECT, gameObject)
    }
}
