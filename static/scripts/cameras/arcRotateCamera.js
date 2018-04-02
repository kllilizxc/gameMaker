const arcRotateCamera = new BABYLON.ArcRotateCamera(this.getMesh().name, -(Math.PI / 2), Math.PI / 2, 8, new BABYLON.Vector3(0, 0, 0), scene)
this.setMesh(arcRotateCamera)
arcRotateCamera.attachControl(scene.canvas)
const editCamera = scene.activeCamera

function init() {
    scene.activeCamera = arcRotateCamera
}

fields = {
    radius: {
        type: 'NUMBER',
        get: () => arcRotateCamera.radius,
        set: val => arcRotateCamera.radius = val
    }
}

function onFocus() {
    scene.activeCamera = arcRotateCamera
}

function onBlur() {
    scene.activeCamera = editCamera
}
