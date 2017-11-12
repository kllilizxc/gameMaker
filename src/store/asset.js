// @flow
import Vue from 'vue'
import { stateToGetters } from '../common/util'
import AssetManager from '../common/asset-manager'
import { trimFilenameExtension } from '../common/util'

import type { Script } from '../common/types'

const ADD_SCRIPT = 'ADD_SCRIPT'

type State = {
    scripts: any
}

const state: State = {
    scripts: {}
}

export default {
    namespaced: true,
    state,
    getters: stateToGetters(state),
    mutations: {
        [ADD_SCRIPT](state: State, { gameObjectID, script }: { gameObjectID: string, script: Script }) {
            Vue.set(state.scripts, gameObjectID, script)
        }
    },
    actions: {
        readScriptFromFile: ({ commit }: any, { gameObjectID, file }: { gameObjectID: string, file: any }) =>
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
