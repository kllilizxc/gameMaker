// @flow
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

export const stateToGetters = state => {
    return Object.keys(state).reduce((obj, cur) => {
        obj[cur] = state => state[cur]
        return obj
    }, {})
}

export const trimFilenameExtension = filename => filename.replace(/\.[^/.]+$/, "")
