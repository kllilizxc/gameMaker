let mass = 1
let restitution = 0
let friction = 0
let type = 'BoxImpostor'
let checkCollisions = true

fields = {
    type: {
        type: 'ENUM',
        get: () => type,
        set: val => type = val,
        options: { options: ['BoxImpostor', 'SphereImpostor'] }
    },
    checkCollisions: {
        type: 'BOOLEAN',
        get: () => checkCollisions,
        set: val => checkCollisions = val
    },
    mass: {
        type: 'NUMBER',
        get: () => mass,
        set: val => mass = val
    },
    friction: {
        name: 'friction',
        type: 'NUMBER',
        get: () => friction,
        set: val => friction = val
    },
    restitution: {
        type: 'NUMBER',
        get: () => restitution,
        set: val => restitution = val
    }
}

actions = {
    applyForce: force => {
        if (!this.physicsImpostor) return
        this.physicsImpostor.applyForce(force, this.getMesh().getAbsolutePosition())
    },
    setLinearVelocity: velocity => {
        if (!this.physicsImpostor) return
        this.physicsImpostor.setLinearVelocity(velocity)
    }
}

function init() {
    this.checkCollisions = checkCollisions
    this.physicsImpostor =
        new BABYLON.PhysicsImpostor(this.getMesh(), BABYLON.PhysicsImpostor[type], { mass, friction, restitution }, scene)
}

function update() {
}
