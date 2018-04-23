// @flow
import { stateToGetters } from '../common/util'
import AssetManager from '@/common/asset-manager'

type State = {}

const state: State = {
    assets: {
        models: [],
        textures: [],
        scripts: [],
        others: []
    }
}

export default {
    state,
    getters: stateToGetters(state),
    mutations: {},
    actions: {
        uploadAssets: ({ state, commit }, files) =>
            Promise.all([...files]
                .map(file => AssetManager.readLocalFile(file)
                    .then(data => {
                        const fileData = { name: file.name, data }
                        switch (file.type) {
                            case 'image/png':
                                state.assets.textures.push(fileData)
                                break
                            case 'application/javascript':
                                state.assets.scripts.push(fileData)
                                break
                            default:
                                state.assets.others.push(fileData)
                                break
                        }
                        return fileData
                    })))
    }
}
