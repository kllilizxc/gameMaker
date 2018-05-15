let speed = 10
let lifeTime = 3

fields = {
    speed: {
        type: 'NUMBER',
        get: () => speed,
        set: val => speed = val
    },
    lifeTime: {
        type: 'NUMBER',
        get: () => lifeTime,
        set: val => lifeTime = val
    }
}

function init() {
    // setTimeout(() => this.dispose(), lifeTime * 1000)
}

function update() {
    this.getMesh().position.z += speed
}
