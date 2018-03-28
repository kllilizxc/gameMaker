const hemisphericLight = new BABYLON.HemisphericLight(this.name, BABYLON.Vector3.Up(), scene)
hemisphericLight.parent = this.getMesh()

fields = {
    diffuse: {
        type: 'GROUP',
        children: {
            r: {
                type: 'NUMBER',
                get: () => hemisphericLight.diffuse.r,
                set: val => hemisphericLight.diffuse.r = val
            },
            g: {
                type: 'NUMBER',
                get: () => hemisphericLight.diffuse.g,
                set: val => hemisphericLight.diffuse.g = val
            },
            b: {
                type: 'NUMBER',
                get: () => hemisphericLight.diffuse.b,
                set: val => hemisphericLight.diffuse.b = val
            }
        }
    },
    direction: {
        type: 'GROUP',
        children: {
            x: {
                type: 'NUMBER',
                get: () => hemisphericLight.direction.x,
                set: val => hemisphericLight.direction.x = val
            },
            y: {
                type: 'NUMBER',
                get: () => hemisphericLight.direction.y,
                set: val => hemisphericLight.direction.y = val
            },
            z: {
                type: 'NUMBER',
                get: () => hemisphericLight.direction.z,
                set: val => hemisphericLight.direction.z = val
            }
        }
    },
    intensity: {
        type: 'NUMBER',
        get: () => hemisphericLight.intensity,
        set: val => hemisphericLight.intensity = val
    }
}
