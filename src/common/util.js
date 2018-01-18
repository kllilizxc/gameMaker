// @flow
import AssetManager from './asset-manager'

export function afterTransition(el: any, callback: () => void): void {
    const handler: () => void = () => {
        callback()
        el.removeEventListener('transitionend', handler)
    }
    el.addEventListener('transitionend', handler)
}

export function doTransition(el: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const handler: () => void = () => {
            resolve()
            el.removeEventListener('transitionend', handler)
        }
        el.addEventListener('transitionend', handler)
    })
}

export function getFunctionalUIComponent(name: string, hasInputEvent: boolean = true) {
    return {
        functional: true,
        render(h: any, { listeners, props, children, data }: any) {
            data = { ...data, props }
            if (hasInputEvent) data.on = { input: listeners['input'] }
            return h(name, data, children)
        }

    }
}

export const logger = console

export const stateToGetters = (state: any) => {
    return Object.keys(state).reduce((obj, cur) => {
        obj[cur] = state => state[cur]
        return obj
    }, {})
}

export const trimFilenameExtension = (filename: string) => filename.replace(/\.[^/.]+$/, '')

export const readScriptFromFile = (file: any) =>
    AssetManager.readFile(file).then((content: string) =>
        Promise.resolve({
            name: trimFilenameExtension(typeof file === 'string' ? file : file.name),
            Behavior: new Function('gameObject', content)
        })
    )
