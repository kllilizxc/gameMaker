export function afterTransition(el, callback: () => void) {
    const handler = () => {
        callback()
        el.removeEventListener('transitionend', handler)
    }
    el.addEventListener('transitionend', handler)
}
