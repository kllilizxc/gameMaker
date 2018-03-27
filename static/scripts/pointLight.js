const pointLight = new BABYLON.PointLight(name, new BABYLON.Vector3(0, 0, 0), scene)
pointLight.parent = this.getMesh()

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
    }
}
