const directionalLight = new BABYLON.DirectionalLight(this.name, new BABYLON.Vector3(2, -3, -1), scene)
this.setMesh(directionalLight)
this.getLight = () => directionalLight

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
    }
}
