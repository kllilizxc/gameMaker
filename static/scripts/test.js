let speed = 0.001
let gameObject

fields = [
    {
        name: 'speed',
        type: 'NUMBER',
        get: () => speed,
        set: val => speed = val,
        options: { label: 'speed', name: 'speed' }
    },
    {
        name: 'obj',
        type: 'GAMEOBJECT',
        get: () => gameObject,
        set: val => gameObject = val,
        options: { label: 'gameObject' }
    }
]

function update() {
    this.checkCollisions = true
    gameObject && (gameObject.rotation.x += speed)
}
