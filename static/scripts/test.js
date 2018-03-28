let scaling = 0
let gameObject

fields = {
    gameObject: {
        type: 'GAMEOBJECT',
        get: () => gameObject,
        set: val => gameObject = val
    },
    scaling: {
        type: 'NUMBER',
        get: () => scaling,
        set: val => {
            scaling = val
            console.log(gameObject)
            gameObject && gameObject.getScript('transform').action('setScaling', val)
        }
    }
}

function update() {
}
