let time, deltaTime, player

fields = {
    player: {
        type: 'GAMEOBJECT',
        get: () => player,
        set: val => player = val
    }
}

function init() {
    time = Date.now()
    deltaTime = 0
    console.log(player)
}

function update() {
    deltaTime = Date.now() - time
    time = Date.now()
    this.getMesh().rotate(new BABYLON.Vector3(15, 30, 45), deltaTime / 1000)
    if (player && this.getMesh().intersectsMesh(player.getMesh())) {
        this.getMesh().isVisible = false
        setTimeout(() => this.getMesh().isVisible = true, 3000)
    }
}
