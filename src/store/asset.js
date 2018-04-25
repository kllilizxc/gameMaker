// @flow
import { stateToGetters, trimFilename } from '../common/util'
import AssetManager from '@/common/asset-manager'

type State = {}

const state: State = {
    assets: {
        models: [],
        textures: [],
        scripts: [],
        others: []
    },
    filesMap: {}
}

export default {
    state,
    getters: stateToGetters(state),
    mutations: {},
    actions: {
        uploadAssets: ({ state, commit }, files) => {
            const isSingle = !files[0]
            const toReturn = Promise.all((isSingle ? [files] : [...files])
                .map(file => AssetManager.readLocalFile(file, true)
                    .then(data => {
                        const fileData = { name: trimFilename(file.name), data }
                        const uploadFile = type => {
                            const assets = state.assets[type]
                            if (assets.find(filename => filename === fileData.name)) return
                            assets.push(fileData.name)
                            state.filesMap[fileData.name] = fileData.data
                        }
                        switch (file.type) {
                            case 'image/png':
                            case 'image/gif':
                                uploadFile('textures')
                                break
                            case 'application/javascript':
                                uploadFile('scripts')
                                break
                            default:
                                uploadFile('others')
                                break
                        }
                        return fileData
                    })))
            return isSingle
                ? toReturn.then(data => data[0])
                : toReturn
        }
    }
}
