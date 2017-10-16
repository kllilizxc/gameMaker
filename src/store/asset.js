// @flow
import Vue from 'vue'
import { stateToGetters } from '../common/util'
import AssetManager from '../common/asset-manager'
import { trimFilenameExtension } from '../common/util'

import { Script } from '../common/types'

const ADD_SCRIPT = 'ADD_SCRIPT'

const state = {
    scripts: {}
}

export default {
    namespaced: true,
    state,
    getters: stateToGetters(state),
    mutations: {
        [ADD_SCRIPT](state, { gameObjectID, script }: { gameObjectID: string, script: Script }) {
            Vue.set(state.scripts, gameObjectID, script)
        }
    },
    actions: {
        readScriptFromFile: ({ commit }, { gameObjectID, file }: { gameObjectID: string, file: any }) =>
            AssetManager.readFile(file).then((content: string) =>
                commit(ADD_SCRIPT, {
                    gameObjectID, script: {
                        name: trimFilenameExtension(file.name),
                        Behavior: new Function(content)
                    }
                })
            )

    }
}
