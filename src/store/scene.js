import { stateToGetters, stateToMutations, stateToActions } from '../common/util'

const state = {
    gameObject: null,
    gameObjects: [],
    isPlaying: false,
    scene: null
}

export default {
    state,
    getters: stateToGetters(state),
    mutations: stateToMutations(state),
    actions: stateToActions(state)
}
