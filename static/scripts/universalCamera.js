// Parameters : name, position, scene
const camera = new BABYLON.UniversalCamera(this.getMesh().name, new BABYLON.Vector3(0, -5, -20), scene)

// Targets the camera to a particular position. In this case the scene origin
camera.setTarget(BABYLON.Vector3.Zero())

function init() {
    camera.attachControl(scene.canvas)
}
