// @flow
export function afterTransition(el, callback: () => void): void {
    const handler = () => {
        callback()
        el.removeEventListener('transitionend', handler)
    }
    el.addEventListener('transitionend', handler)
}

export function doTransition(el) {
    return new Promise((resolve, reject) => {
        const handler = () => {
            resolve()
            el.removeEventListener('transitionend', handler)
        }
        el.addEventListener('transitionend', handler)
    })
}
