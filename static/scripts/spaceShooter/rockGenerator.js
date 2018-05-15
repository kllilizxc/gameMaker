let rock
let interval = 3
let rocks = []
let player

fields = {
    rock: {
        type: 'GAMEOBJECT',
        get: () => rock,
        set: val => rock = val
    },
    player: {
        type: 'GAMEOBJECT',
        get: () => player,
        set: val => player = val
    },
    interval: {
        type: 'NUMBER',
        get: () => interval,
        set: val => interval = val
    }
}

function removeRock(rock) {
    rocks.splice(rocks.findIndex(theRock => theRock === rock), 1)
    rock.dispose()
}

function init() {
    setInterval(() => {
        const newRock = rock.getMesh().clone()
        newRock.position = new BABYLON.Vector3((Math.random() * 2 - 1) * 10, 0, 20)
        rocks.push(newRock)
    }, interval * 1000)
}

function update() {
    rocks.forEach(r => {
        r.position.z -= 0.1
        if (player && r.intersectsMesh(player.getMesh()))
            alert('you lose!')

        let intersects
        if ((intersects = gm.getIntersects(r, scene)).length > 0)
            if (intersects.find(i => i.tag === 'bullet'))
                removeRock(r)

        if (r.position.z < -10) removeRock(r)
    })
}
