let disableBidirect = false
let mass = 1
let restitution = 0
let friction = 0
let type = 'BoxImpostor'
let checkCollisions = true

fields = [
    {
        name: 'type',
        type: 'ENUM',
        get: () => type,
        set: val => type = val,
        options: { label: 'type', options: ['BoxImpostor', 'SphereImpostor'] }
    },
    {
        name: 'disableBidirect',
        type: 'BOOLEAN',
        get: () => disableBidirect,
        set: val => disableBidirect = val,
        options: { label: 'disableBidirect' }
    },
    {
        name: 'checkCollisions',
        type: 'BOOLEAN',
        get: () => checkCollisions,
        set: val => checkCollisions = val,
        options: { label: 'checkCollisions' }
    },
    {
        name: 'mass',
        type: 'NUMBER',
        get: () => mass,
        set: val => mass = val,
        options: { label: 'mass' }
    },
    {
        name: 'friction',
        type: 'NUMBER',
        get: () => friction,
        set: val => friction = val,
        options: { label: 'friction' }
    },
    {
        name: 'restitution',
        type: 'NUMBER',
        get: () => restitution,
        set: val => restitution = val,
        options: { label: 'restitution' }
    }
]

function init() {
    this.checkCollisions = checkCollisions
    this.physicsImpostor =
        new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor[type], { mass, friction, restitution, disableBidirect }, scene)
}
