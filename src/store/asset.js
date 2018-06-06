// @flow
import { stateToGetters, trimFilename, getScriptObject, getFileExtension, getDuplicatedName } from '../common/util'
import AssetManager from '@/common/asset-manager'
import Script from '../classes/script'

const CLEAR_ASSETS = 'CLEAR_ASSETS'
const SET_ASSETS = 'SET_ASSETS'
const CREATE_ASSET = 'CREATE_ASSET'
const EDIT_ASSET_NAME = 'EDIT_ASSET_NAME'
const REMOVE_ASSET = 'REMOVE_ASSET'

export const getDefaultAssets = () => ({
    models: [],
    textures: [],
    scripts: [],
    prefabs: [],
    templates: [],
    animations: [],
    others: []
})

const extensions = {
    animations: '.anim',
    scripts: '.js',
    prefabs: '.pref',
    templates: '.temp'
}

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
        },
        [CREATE_ASSET](state, { name, category }) {
            state.assets[category].push(name)
        },
        [EDIT_ASSET_NAME](state, { oldName, name }) {
            Object.keys(state.assets).forEach(category => {
                const fileNames = state.assets[category]
                const index = fileNames.findIndex(fileName => fileName === oldName)
                if (index !== -1) fileNames[index] = name
            })
        },
        [REMOVE_ASSET](state, name) {
            Object.keys(state.assets).forEach(category => {
                const fileNames = state.assets[category]
                const index = fileNames.findIndex(fileName => fileName === name)
                if (index !== -1) fileNames.splice(index, 1)
            })
        }
    },
    actions: {
        clearAssets: ({ commit }) => commit(CLEAR_ASSETS),
        setAssets: ({ commit }, data) => commit(SET_ASSETS, data),
        createAsset: ({ dispatch, commit, rootState: { scene: { game } } }, { name, data, category }) => {
            while (game.filesMap[name + extensions[category]] !== undefined) name = getDuplicatedName(name)
            name += extensions[category]
            const file = { name, data }
            commit(CREATE_ASSET, { name, category })
            dispatch('setCurrentFile', name)
            return dispatch('createFile', file)
        },
        editAssetName: ({ dispatch, commit, rootState: { scene: { game } } }, data) => {
            let count = 0
            while (game.filesMap[data.name] !== undefined && count++) // change name until get the second duplicated name
                data.name = getDuplicatedName(data.name)
            commit(EDIT_ASSET_NAME, data)
            dispatch('editFileName', data)
        },
        removeAsset: ({ dispatch, commit, rootState: { scene: { game } } }, name) => {
            commit(REMOVE_ASSET, name)
            delete game.filesMap[name]
            dispatch('setCurrentFile', null)
        },
        uploadAssets: ({ state, dispatch, commit }, files) => {
            const isSingle = !files[0]
            const toReturn = Promise.all((isSingle ? [files] : [...files])
                .map(file => {
                    const extension = getFileExtension(file.name)
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
                                dispatch('setFileValue', { name: fileData.name, content: fileData.data })
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
                                case 'pref':
                                    uploadFile('prefabs')
                                    break
                                case 'temp':
                                    uploadFile('templates')
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
        editFile({ dispatch, rootState: { scene: { gameObjects, game } } }, { file, value }) {
            game.setFileValue(file, value)
            gameObjects && gameObjects.forEach(gameObject => gameObject.forEach(obj => {
                if (obj.scripts[file])
                    obj.addScript(new Script(getScriptObject(file, value, obj), obj))
            }))
        }
    }
}
