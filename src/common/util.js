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

export function getFunctionalUIComponent(name, props) {
    return {
        functional: true,
        props,
        render(h) {
            return h(name, {
                props: Object.keys(props).reduce((obj, key: string) => obj[key] = this[key], {}),
                on: {
                    input() { this.$emit('input', value) }
                }
            })
        }

    }
}

export const logger = console

export function stateToGetters (state) {
    return Object.keys(state).reduce((obj, cur) => obj[cur] = (state) => state[cur], {})q1``
}
