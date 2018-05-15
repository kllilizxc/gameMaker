// Parameters : name, position, scene
const universalCamera = new BABYLON.UniversalCamera(this.getMesh().name, new BABYLON.Vector3(0, -5, -20), scene)
this.setMesh(universalCamera)
const editCamera = scene.activeCamera
let allowControl = true

// Targets the universalCamera to a particular position. In this case the scene origin
universalCamera.setTarget(BABYLON.Vector3.Zero())
universalCamera.attachControl(scene.canvas)

function init() {
    scene.activeCamera = universalCamera
}

function onFocus() {
    scene.activeCamera = universalCamera
}

function onBlur() {
    scene.activeCamera = editCamera
}
