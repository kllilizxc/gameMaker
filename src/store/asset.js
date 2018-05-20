// @flow
import { stateToGetters, trimFilename, getScriptObject } from '../common/util'
import AssetManager from '@/common/asset-manager'
import Script from '../classes/script'

const CLEAR_ASSETS = 'CLEAR_ASSETS'
const SET_ASSETS = 'SET_ASSETS'

export const getDefaultAssets = () => ({
    models: [],
    textures: [],
    scripts: [],
    others: []
})

type State = {}

const state: State = {
    assets: getDefaultAssets()
}

export default {
    state,
    getters: stateToGetters(state),
    mutations: {
        [CLEAR_ASSETS](state) {
            state.assets = getDefaultAssets()
        },
        [SET_ASSETS](state, assets) {
            state.assets = assets
        }
    },
    actions: {
        clearAssets: ({ commit }) => commit(CLEAR_ASSETS),
        setAssets: ({ commit }, data) => commit(SET_ASSETS, data),
        uploadAssets: ({ state, rootState: { scene: { game } }, commit }, files) => {
            const isSingle = !files[0]
            const toReturn = Promise.all((isSingle ? [files] : [...files])
                .map(file => {
                    const extension = file.name.match(/\.([0-9a-z]+)$/i)[1].toLowerCase()
                    // set read mode
                    let mode = 'DataURL'
                    if (extension === 'js' || extension === 'obj' || extension === 'gltf' || extension === 'babylon') mode = 'Text'
                    else if (extension === 'stl') mode = 'ArrayBuffer'

                    return AssetManager.readLocalFile(file, mode) // load scripts as plain text and others as data url
                        .then(data => {
                            const fileData = { name: trimFilename(file.name), data }
                            const uploadFile = type => {
                                const assets = state.assets[type]
                                if (!assets.find(filename => filename === fileData.name))
                                    assets.push(fileData.name)
                                game.setFileValue(fileData.name, fileData.data)
                            }

                            switch (extension) {
                                case 'png':
                                case 'gif':
                                case 'jpg':
                                    uploadFile('textures')
                                    break
                                case 'js':
                                    uploadFile('scripts')
                                    break
                                case 'stl':
                                case 'obj':
                                case 'gltf':
                                case 'babylon':
                                    uploadFile('models')
                                    break
                                default:
                                    uploadFile('others')
                                    break
                            }
                            return fileData
                        })
                }))
            return isSingle
                ? toReturn.then(data => data[0])
                : toReturn
        },
        editFile({ ootState: { scene: { gameObjects, game } } }, { file, value }) {
            game.setFileValue('file', value)
            gameObjects.forEach(gameObject => gameObject.forEach(obj => {
                if (obj.scripts[file])
                    obj.addScript(new Script(getScriptObject(file, value, obj), obj))
            }))
        }
    }
}
