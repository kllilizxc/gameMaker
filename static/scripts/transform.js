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
                get: () =>  BABYLON.Tools.ToDegrees(this.getMesh().rotation.x),
                set: val => this.getMesh().rotation.x =  BABYLON.Tools.ToRadians(val)
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
    setScaling(size) {
        fields.scaling.children.x.set(size)
        fields.scaling.children.y.set(size)
        fields.scaling.children.z.set(size)
    }
}
