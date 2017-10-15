// @flow
import Vue from 'vue'
import { stateToGetters } from '../common/util'
import { readFile } from '../common/file-manager'

import { Script } from '../common/type'

const ADD_SCRIPT = 'ADD_SCRIPT'

const state = {
    scripts: {}
}

export default {
    getters: stateToGetters(state),
    mutations: {
        [ADD_SCRIPT](state, { gameObjectID, script }: { gameObjectID: string, script: Script }) {
            Vue.set(state.scripts, gameObjectID, script)
        }
    },
    actions: {
        readScriptFromFile({ commit }, { gameObjectID, filename }) {
            readFile(filename).then(content =>
                commit(ADD_SCRIPT, { gameObjectID, script: {
                    name: filename,
                    func: new Function(content)
                } }))
        }
    }
}
