let speed = 10

fields = {
    speed: {
        type: 'NUMBER',
        get: () => speed,
        set: val => speed = val
    }
}

function update() {
    let moveHorizontal = scene.pointerX
    let moveVertical = scene.pointerY

    let movement = new BABYLON.Vector3((moveHorizontal / scene.canvas.clientWidth) * 2 - 1, 0, 1 - (moveVertical / scene.canvas.clientHeight) * 2)
    this.physics.applyForce(movement.scale(speed))
}
