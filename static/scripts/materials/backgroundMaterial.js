const backgroundMaterial = new BABYLON.BackgroundMaterial('backgroundMaterial', scene)
this.getMesh().material = backgroundMaterial
this.getMesh().receiveShadows = true
backgroundMaterial.primaryLevel = 1
backgroundMaterial.secondaryLevel = 0
backgroundMaterial.tertiaryLevel = 0
backgroundMaterial.backFaceCulling = false
let orientationSide = 'FRONTSIDE'

let diffuseTexture, reflectionTexture, mirrorTexture

fields = {
    orientationSide: {
        type: 'ENUM',
        get: () => orientationSide,
        set: val => {
            orientationSide = val
            backgroundMaterial.orientationSide = BABYLON.Mesh[orientationSide]
        },
        options: { options: ['FRONTSIDE', 'BACKSIDE'] }
    },
    diffuseTexture: {
        type: 'FILE',
        get: () => diffuseTexture,
        set: val => {
            diffuseTexture = val
            let hasAlpha
            if (backgroundMaterial.diffuseTexture)
                hasAlpha = backgroundMaterial.diffuseTexture.hasAlpha
            backgroundMaterial.diffuseTexture = new BABYLON.Texture(diffuseTexture, scene)
            if (hasAlpha !== undefined) backgroundMaterial.diffuseTexture.hasAlpha = hasAlpha
        }
    },
    shadowsLevel: {
        type: 'NUMBER',
        get: () => backgroundMaterial.shadowLevel,
        set: val => backgroundMaterial.shadowLevel = val,
        options: { max: 1, min: 0, step: 0.1 }
    },
    hasAlpha: {
        type: 'BOOLEAN',
        get: () => backgroundMaterial.diffuseTexture && backgroundMaterial.diffuseTexture.hasAlpha,
        set: val => backgroundMaterial.diffuseTexture && (backgroundMaterial.diffuseTexture.hasAlpha = val)
    },
    reflectionTexture: {
        type: 'FILE',
        get: () => reflectionTexture,
        set: val => {
            reflectionTexture = val
            backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture(reflectionTexture, scene)
            backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
        }
    },
    mirror: {
        type: 'BOOLEAN',
        get: () => !!mirrorTexture,
        set: val => {
            if (val) {
                mirrorTexture = new BABYLON.MirrorTexture('mirror', 512, scene)
                mirrorTexture.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0)
                scene.meshes.forEach(mesh => mirrorTexture.renderList.push(mesh))
                backgroundMaterial.reflectionTexture = mirrorTexture
                backgroundMaterial.reflectionFresnel = true
                backgroundMaterial.reflectionStandardFresnelWeight = 0.8
            }
        }
    },
    primaryColor: {
        type: 'GROUP',
        children: {
            r: {
                type: 'NUMBER',
                get: () => backgroundMaterial.primaryColor.r,
                set: val => backgroundMaterial.primaryColor.r = val
            },
            g: {
                type: 'NUMBER',
                get: () => backgroundMaterial.primaryColor.g,
                set: val => backgroundMaterial.primaryColor.g = val
            },
            b: {
                type: 'NUMBER',
                get: () => backgroundMaterial.primaryColor.b,
                set: val => backgroundMaterial.primaryColor.b = val
            }
        }
    }
}

actions = {
    setOrientationSide(val) {
        backgroundMaterial.sideOrientation = val
    }
}
