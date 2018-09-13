const followCamera = new BABYLON.FollowCamera(this.getMesh().name, new BABYLON.Vector3(0, 10, -10), scene)
this.setMesh(followCamera)
let target
followCamera.attachControl(scene.canvas)
const editCamera = scene.activeCamera

fields = {
    target: {
        type: 'GAMEOBJECT',
        get: () => target,
        set: val => target = val
    },
    radius: {
        type: 'NUMBER',
        get: () => followCamera.radius,
        set: val => followCamera.radius = val
    },
    heightOffset: {
        type: 'NUMBER',
        get: () => followCamera.heightOffset,
        set: val => followCamera.heightOffset = val
    },
    rotationOffset: {
        type: 'NUMBER',
        get: () => followCamera.rotationOffset,
        set: val => followCamera.rotationOffset = val
    },
    cameraAcceleration: {
        type: 'NUMBER',
        get: () => followCamera.cameraAcceleration,
        set: val => followCamera.cameraAcceleration = val
    },
    maxCameraSpeed: {
        type: 'NUMBER',
        get: () => followCamera.maxCameraSpeed,
        set: val => followCamera.maxCameraSpeed = val
    }
}

function init() {
    if (target) followCamera.lockedTarget = target.getMesh()
    scene.activeCamera = followCamera
}

function onFocus() {
    scene.activeCamera = followCamera
}

function onBlur() {
    scene.activeCamera = editCamera
}
