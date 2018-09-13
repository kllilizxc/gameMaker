let player
let offset

fields = {
    player: {
        type: 'GAMEOBJECT',
        get: () => player,
        set: val => player = val
    }
}

function init() {
    if (!player) return
    offset = this.getMesh().position.subtract(player.getMesh().position)
}

function update() {
    if (!player) return
    this.getMesh().position = player.getMesh().position.add(offset)
}
