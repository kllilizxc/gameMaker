// @flow
import AssetManager from './asset-manager'

export function afterTransition(el, callback: () => void): void {
    const handler: () => void = () => {
        callback()
        el.removeEventListener('transitionend', handler)
    }
    el.addEventListener('transitionend', handler)
}

export function doTransition(el): void {
    return new Promise((resolve, reject) => {
        const handler: () => void = () => {
            resolve()
            el.removeEventListener('transitionend', handler)
        }
        el.addEventListener('transitionend', handler)
    })
}

export function getFunctionalUIComponent(name, hasInputEvent = true) {
    return {
        functional: true,
        render(h, { listeners, props, children, data }) {
            data = { ...data, props }
            if (hasInputEvent) data.on = { input: listeners['input'] }
            return h(name, data, children)
        }

    }
}

export const logger = console

export const stateToGetters = state =>
    Object.keys(state).reduce((obj, cur) => {
        obj[cur] = state => state[cur]
        return obj
    }, {})

const getMutationName = key => `SET_${key.toUpperCase()}`
const getActionName = key => `set${key.charAt(0).toUpperCase() + key.slice(1)}`

export const stateToMutations = state =>
    Object.keys(state).reduce((obj, key) => {
        obj[getMutationName(key)] = (state, data) => state[key] = data
        return obj
    }, {})

export const stateToActions = state =>
    Object.keys(state).reduce((obj, key) => {
        obj[getActionName(key)] = ({ commit }, data) => commit(getMutationName(key), data)
        return obj
    }, {})

export const trimFilenameExtension = filename => filename.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, '')

const events = ['fields', 'init', 'update']
const returnValues = `return {${events.join(',')}}`
export const readScriptFromFile = (file, gameObject) =>
    AssetManager.readLocalFile(typeof file === 'string' ? file : file.path).then((content: string) =>
        Promise.resolve({
            name: trimFilenameExtension(typeof file === 'string' ? file : file.name),
            path: typeof file === 'string' ? file : file.name,
            Behavior: new Function('BABYLON', ...events, `${content}\n${returnValues}`).bind(gameObject)
        }))

export const random16Bytes = () => btoa(Math.random().toString(16).substr(7))
export const random64Bytes = () => random16Bytes() + random16Bytes() + random16Bytes() + random16Bytes()
export const UUID = random64Bytes
