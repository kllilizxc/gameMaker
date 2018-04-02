const spotLight = new BABYLON.SpotLight(this.name, new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, scene)
this.setMesh(spotLight)

fields = {
    diffuse: {
        type: 'GROUP',
        children: {
            r: {
                type: 'NUMBER',
                get: () => spotLight.diffuse.r,
                set: val => spotLight.diffuse.r = val
            },
            g: {
                type: 'NUMBER',
                get: () => spotLight.diffuse.g,
                set: val => spotLight.diffuse.g = val
            },
            b: {
                type: 'NUMBER',
                get: () => spotLight.diffuse.b,
                set: val => spotLight.diffuse.b = val
            }
        }
    },
    intensity: {
        type: 'NUMBER',
        get: () => spotLight.intensity,
        set: val => spotLight.intensity = val
    },
    direction: {
        type: 'GROUP',
        children: {
            x: {
                type: 'NUMBER',
                get: () => spotLight.direction.x,
                set: val => spotLight.direction.x = val
            },
            y: {
                type: 'NUMBER',
                get: () => spotLight.direction.y,
                set: val => spotLight.direction.y = val
            },
            z: {
                type: 'NUMBER',
                get: () => spotLight.direction.z,
                set: val => spotLight.direction.z = val
            }
        }
    },
    angle: {
        type: 'NUMBER',
        get: () => spotLight.angle,
        set: val => spotLight.angle = val
    },
    exponent: {
        type: 'NUMBER',
        get: () => spotLight.exponent,
        set: val => spotLight.exponent = val
    }
}
