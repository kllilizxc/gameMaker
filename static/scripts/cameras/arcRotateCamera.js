const arcRotateCamera = new BABYLON.ArcRotateCamera('arcRotateCamera', -(Math.PI / 2), Math.PI / 2, 8, new BABYLON.Vector3(0, 0, 0), scene)
arcRotateCamera.parent = this.getMesh()

function init() {
    console.log(scene.canvas)
    arcRotateCamera.attachControl(scene.canvas)
    scene.activeCamera = arcRotateCamera
}

fields = {
    radius: {
        type: 'NUMBER',
        get: () => arcRotateCamera.radius,
        set: val => arcRotateCamera.radius = val
    }
}
