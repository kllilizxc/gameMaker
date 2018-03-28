const directionalLight = new BABYLON.DirectionalLight(this.name, new BABYLON.Vector3(2, -3, -1), scene)
directionalLight.parent = this.getMesh()
let shadowMapSize = 512
let shadowGenerator
const setShadowMapSize = () => {
    let blurExponential = null, blurKernel = null
    if (shadowGenerator) {
        blurExponential = shadowGenerator.blurExponential
        blurKernel = shadowGenerator.blurKernel
        shadowGenerator.dispose()
    }
    shadowGenerator = new BABYLON.ShadowGenerator(shadowMapSize, directionalLight)
    if (blurExponential !== null) shadowGenerator.blurExponential = blurExponential
    if (blurKernel !== null) shadowGenerator.blurKernel = blurKernel
    scene.meshes.forEach(mesh => shadowGenerator.addShadowCaster(mesh, true))
}
setShadowMapSize()

fields = {
    diffuse: {
        type: 'GROUP',
        children: {
            r: {
                type: 'NUMBER',
                get: () => directionalLight.diffuse.r,
                set: val => directionalLight.diffuse.r = val
            },
            g: {
                type: 'NUMBER',
                get: () => directionalLight.diffuse.g,
                set: val => directionalLight.diffuse.g = val
            },
            b: {
                type: 'NUMBER',
                get: () => directionalLight.diffuse.b,
                set: val => directionalLight.diffuse.b = val
            }
        }
    },
    direction: {
        type: 'GROUP',
        children: {
            x: {
                type: 'NUMBER',
                get: () => directionalLight.direction.x,
                set: val => directionalLight.direction.x = val
            },
            y: {
                type: 'NUMBER',
                get: () => directionalLight.direction.y,
                set: val => directionalLight.direction.y = val
            },
            z: {
                type: 'NUMBER',
                get: () => directionalLight.direction.z,
                set: val => directionalLight.direction.z = val
            }
        }
    },
    intensity: {
        type: 'NUMBER',
        get: () => directionalLight.intensity,
        set: val => directionalLight.intensity = val
    },
    shadowMapSize: {
        type: 'NUMBER',
        get: () => shadowMapSize,
        set: val => {
            if (val % 16 !== 0) return
            shadowMapSize = val
            setShadowMapSize()
        }
    },
    blurExponential: {
        type: 'BOOLEAN',
        get: () => shadowGenerator.useBlurExponentialShadowMap,
        set: val => shadowGenerator.useBlurExponentialShadowMap = val
    },
    blurKernel: {
        type: 'NUMBER',
        get: () => shadowGenerator.blurKernel,
        set: val => shadowGenerator.blurKernel = val
    }
}
