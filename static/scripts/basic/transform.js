fields = {}

if (this.getMesh().position)
    fields.position = {
        type: 'GROUP',
        children: {
            x: {
                type: 'NUMBER',
                get: () => this.getMesh().position.x,
                set: val => this.getMesh().position.x = val
            },
            y: {
                type: 'NUMBER',
                get: () => this.getMesh().position.y,
                set: val => this.getMesh().position.y = val
            },
            z: {
                type: 'NUMBER',
                get: () => this.getMesh().position.z,
                set: val => this.getMesh().position.z = val
            }
        }
    }

if (this.getMesh().rotation)
    fields.rotation = {
        type: 'GROUP',
        children: {
            x: {
                type: 'NUMBER',
                get: () => BABYLON.Tools.ToDegrees(this.getMesh().rotation.x),
                set: val => this.getMesh().rotation.x = BABYLON.Tools.ToRadians(val)
            },
            y: {
                type: 'NUMBER',
                get: () => BABYLON.Tools.ToDegrees(this.getMesh().rotation.y),
                set: val => this.getMesh().rotation.y = BABYLON.Tools.ToRadians(val)
            },
            z: {
                type: 'NUMBER',
                get: () => BABYLON.Tools.ToDegrees(this.getMesh().rotation.z),
                set: val => this.getMesh().rotation.z = BABYLON.Tools.ToRadians(val)
            }
        }
    }

if (this.getMesh().scaling)
    fields.scaling = {
        type: 'GROUP',
        children: {
            x: {
                type: 'NUMBER',
                get: () => this.getMesh().scaling.x,
                set: val => this.getMesh().scaling.x = val
            },
            y: {
                type: 'NUMBER',
                get: () => this.getMesh().scaling.y,
                set: val => this.getMesh().scaling.y = val
            },
            z: {
                type: 'NUMBER',
                get: () => this.getMesh().scaling.z,
                set: val => this.getMesh().scaling.z = val
            }
        }
    }

actions = {
    setScaling(x, y, z) {
        fields.scaling.children.x.set(x)
        fields.scaling.children.y.set(y)
        fields.scaling.children.z.set(z)
    },
    setTranslation(x, y, z) {
        const { position } = this.getMesh()
        position.x = x
        position.y = y
        position.z = z
    },
    setRotation(x, y, z) {
        const { rotation } = this.getMesh()
        rotation.x = x
        rotation.y = y
        rotation.z = z
    }
}
