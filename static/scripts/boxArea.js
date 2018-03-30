let width = 1, height = 1, depth = 1
const setGeometry = () => {
    const vertexData = BABYLON.VertexData.CreateBox({ width, height, depth })
    vertexData.applyToMesh(this.getMesh(), true)
}
setGeometry()
const mesh = this.getMesh()
mesh.checkCollisions = true
mesh.showBoundingBox = false

const matBB = new BABYLON.StandardMaterial('matBB', scene)
matBB.emissiveColor = new BABYLON.Color3(1, 1, 1)
matBB.wireframe = true

mesh.material = matBB

let intersect
const onEnterHandlers = []
const onExitHandlers = []

mesh.actionManager = new BABYLON.ActionManager(scene)

fields = {
    size: {
        type: 'GROUP',
        children: {
            width: {
                type: 'NUMBER',
                get: () => width,
                set: val => {
                    width = val
                    setGeometry()
                }
            },
            height: {
                type: 'NUMBER',
                get: () => height,
                set: val => {
                    height = val
                    setGeometry()
                }
            },
            depth: {
                type: 'NUMBER',
                get: () => depth,
                set: val => {
                    depth = val
                    setGeometry()
                }
            }
        }
    },
    intersect: {
        type: 'GAMEOBJECT',
        get: () => intersect,
        set: val => intersect = val
    }
}

actions = {
    registerEnterEvent: handler => onEnterHandlers.push(handler),
    registerExitEvent: handler => onExitHandlers.push(handler)
}

function init() {
    mesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: intersect
        }, () => onEnterHandlers.forEach(handler => handler(this, intersect))))

    mesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
            parameter: intersect
        }, () => onExitHandlers.forEach(handler => handler(this, intersect))))
}
