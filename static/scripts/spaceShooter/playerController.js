let scale = 10, offset = 0.6
let bullet
let bullets = []

fields = {
    scale: {
        type: 'NUMBER',
        get: () => scale,
        set: val => scale = val
    },
    offset: {
        type: 'NUMBER',
        get: () => offset,
        set: val => offset = val
    },
    bullet: {
        type: 'GAMEOBJECT',
        get: () => bullet,
        set: val => bullet = val
    }
}

function init() {
}

function update() {
    let moveHorizontal = scene.pointerX
    let moveVertical = scene.pointerY

    let movement = new BABYLON.Vector3((moveHorizontal / scene.canvas.clientWidth) * 2 - 1, 0, 1 - (moveVertical / scene.canvas.clientHeight) * 2)
    this.getMesh().position = movement.add(new BABYLON.Vector3(0, 0, offset)).scale(scale)

    bullets.forEach(b => b.position.z += 0.2)
}

function keydown(e) {
    shot()
}

function pointerdown() {
    shot()
}

const shot = () => {
    const newBullet = bullet.getMesh().clone()
    newBullet.position = this.getMesh().position
    newBullet.tag = 'bullet'
    bullets.push(newBullet)
    setTimeout(() => {
        bullets.shift().dispose()
    }, 5000)
}
