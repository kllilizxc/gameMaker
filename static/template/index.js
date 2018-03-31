const canvas = document.getElementById('renderCanvas')
const engine = new BABYLON.Engine(canvas, true)
const scene = new BABYLON.Scene(engine)
scene.canvas = canvas
window.scene = scene
let scriptsMap
let scripts
const gameObjects = []

// const readLocalFile = filename => fetch(filename).then(response => response.text())

const readLocalFile = filename => new Promise((resolve, reject) => {
    var rawFile = new XMLHttpRequest()
    rawFile.open('GET', filename, true)
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            var allText = rawFile.responseText
            resolve(allText)
        }
    }
    rawFile.send()
})

Promise.all([
    readLocalFile('scripts.json'),
    readLocalFile('index.scene')
]).then(data => {
    scripts = JSON.parse(data[0])
    window.scripts = scripts

    data = JSON.parse(data[1])
    scriptsMap = data.scriptsMap
    const setMeshes = (rawGameObjects, parent) => rawGameObjects && Promise.all(rawGameObjects.map(rawGameObject => {
        const gameObject = getNewGameObject(rawGameObject)
        return setMeshes(rawGameObject.children, gameObject)
            .then(() => {
                gameObject.setParent(parent)
                if (!parent) gameObjects.push(gameObject)
            })
    }))

    setMeshes(data.rawGameObjects).then(() => {
        window.gameObjects = gameObjects
        initScene()
    })
    window.scriptsMap = scriptsMap
})

function initScene() {
    scene.clearColor = new BABYLON.Color4(0.41, 0.42, 0.38, 1.0)
bn b nbn
    scene.activeCamera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
    scene.activeCamera.setTarget(BABYLON.Vector3.Zero())
    scene.activeCamera.attachControl(canvas, true)
    scene.collisionsEnabled = true
    scene.enablePhysics(null, new BABYLON.CannonJSPlugin())

    init()
    engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene
        update()
        animate()
        scene.render()
    })
}

function animate() {
}

function init() {
    gameObjects.forEach(gameObject => {
        const { scripts } = gameObject
        scripts && Object.keys(scripts).map(key => scripts[key]).forEach(({ init }) => init && init.bind(gameObject)())
    })
}

function update() {
    gameObjects.forEach(gameObject => {
        const { scripts } = gameObject
        scripts && Object.keys(scripts).map(key => scripts[key]).forEach(({ update }) => update && update.bind(gameObject)())
    })
}

function getNewGameObject({ id, name }) {
    return new GameObject(name, new BABYLON.Mesh(name, scene), id)
}

window.addEventListener('resize', function () { // Watch for browser/canvas resize events
    engine.resize()
})

const GROUP_TYPE = 'GROUP'
const GAMEOBJECT_TYPE = 'GAMEOBJECT'
const FILE_TYPE = 'FILE'
const restoreFieldsValues = (scene, fields, values) => Object.keys(fields).forEach(name => {
    const field = fields[name]
    if (!field) return
    field.options = field.options || {}
    const { type, get, set, options, children } = field
    if (type === GROUP_TYPE)
        return restoreFieldsValues(scene, children, values[name])
    else if (type === GAMEOBJECT_TYPE)
        options.value = GameObject.findGameObjectById(scene, values[name])
    else if (type === FILE_TYPE) {
        options.value = values && `static/${values[name]}`
    } else {
        options.value = values && values[name]
        if (options.value === undefined) options.value = get()
    }
    set(options.value)
})

const random16Bytes = () => btoa(Math.random().toString(16).substr(7))
const random64Bytes = () => random16Bytes() + random16Bytes() + random16Bytes() + random16Bytes()
const UUID = random64Bytes

function getScriptObject(script) {
    const { name, Behavior } = script
    const events = Behavior(BABYLON, scene)
    return { name, ...events }
}

class Script {
    constructor(script, gameObject) {
        const scriptObject = getScriptObject(script)
        Object.keys(scriptObject).forEach(key => this[key] = scriptObject[key])
        this.fields && Object.keys(this.fields).forEach(name => this[name] = this.fields[name])
        this.actions && Object.keys(this.actions).forEach(name => this[name] = this.actions[name])
    }
    action(name, ...args) {
        if (!this.actions) return
        const action = this.actions[name]
        action && action(...args)
    }
}

const events = ['fields', 'actions', 'init', 'update']
const returnValues = `return {${events.join(',')}}`
class GameObject {
    constructor(name, mesh, id = UUID()) {
        this.id = id
        this.name = name
        this.mesh = mesh
        this.mesh.id = id
        this.mesh.gameObject = this
        this.scripts = {}
        const scriptMap = scriptsMap[this.id]
        if (scriptMap) {
            Object.keys(scriptMap).map(name => {
                const values = scriptMap[name]
                const scriptObject = new Script({
                    name,
                    Behavior: new Function('BABYLON', 'scene', ...events, `${scripts[name]}\n${returnValues}`).bind(this)
                }, this)
                const { fields } = scriptObject
                fields && restoreFieldsValues(scene, fields, values)
                this.addScript(scriptObject)
            })
        }
    }

    static findGameObjectById(id) {
        return scene.getMeshByID(id) && scene.getMeshByID(id).gameObject
    }

    getMesh() {
        return this.mesh
    }

    setMesh(mesh) {
        const { parent } = this.mesh
        if (parent) mesh.parent = parent
        this.mesh.dispose()
        this.mesh = mesh
    }

    getScript(name) {
        return this.scripts[name]
    }

    addScript(scriptObject) {
        this.scripts[scriptObject.name] = scriptObject
        this[scriptObject.name] = scriptObject
    }

    getParent() {
        return this.mesh.parent && this.mesh.parent.gameObject
    }

    getChildren() {
        return this.mesh.getChildren().map(child => child.gameObject).filter(o => o)
    }

    setParent(parent) {
        this.mesh.parent = parent && parent.mesh
    }
}
