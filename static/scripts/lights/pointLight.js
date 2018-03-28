const pointLight = new BABYLON.PointLight(this.name, new BABYLON.Vector3(0, 0, 0), scene)
pointLight.parent = this.getMesh()
let shadowMapSize = 1024
let shadowGenerator
const setShadowMapSize = () => {
    shadowGenerator = new BABYLON.ShadowGenerator(shadowMapSize, directionalLight)
    scene.meshes.forEach(mesh => shadowGenerator.addShadowCaster(mesh, true))
}
setShadowMapSize()

fields = {
    diffuse: {
        type: 'GROUP',
        children: {
            r: {
                type: 'NUMBER',
                get: () => pointLight.diffuse.r,
                set: val => pointLight.diffuse.r = val
            },
            g: {
                type: 'NUMBER',
                get: () => pointLight.diffuse.g,
                set: val => pointLight.diffuse.g = val
            },
            b: {
                type: 'NUMBER',
                get: () => pointLight.diffuse.b,
                set: val => pointLight.diffuse.b = val
            }
        }
    },
    intensity: {
        type: 'NUMBER',
        get: () => pointLight.intensity,
        set: val => pointLight.intensity = val
    },
    shadowMapSize: {
        type: 'NUMBER',
        get: () => shadowMapSize,
        set: val => {
            shadowMapSize = val
            setShadowMapSize()
        }
    }
}
