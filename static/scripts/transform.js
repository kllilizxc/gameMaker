fields = []

if (this.getMesh().position)
    fields.push({
        type: 'GROUP',
        options: { label: 'position' },
        children: [
            {
                name: 'px',
                type: 'NUMBER',
                get: () => this.getMesh().position.x,
                set: val => this.getMesh().position.x = val,
                options: { name: 'x', label: 'x' }
            },
            {
                name: 'py',
                type: 'NUMBER',
                get: () => this.getMesh().position.y,
                set: val => this.getMesh().position.y = val,
                options: { name: 'y', label: 'y' }
            },
            {
                name: 'pz',
                type: 'NUMBER',
                get: () => this.getMesh().position.z,
                set: val => this.getMesh().position.z = val,
                options: { name: 'z', label: 'z' }
            }
        ]
    })

if (this.getMesh().rotation)
    fields.push({
        type: 'GROUP',
        options: { label: 'rotation' },
        children: [
            {
                name: 'rx',
                type: 'NUMBER',
                get: () => this.getMesh().rotation.x,
                set: val => this.getMesh().rotation.x = val,
                options: { name: 'x', label: 'x' }
            },
            {
                name: 'ry',
                type: 'NUMBER',
                get: () => this.getMesh().rotation.y,
                set: val => this.getMesh().rotation.y = val,
                options: { name: 'y', label: 'y' }
            },
            {
                name: 'rz',
                type: 'NUMBER',
                get: () => this.getMesh().rotation.z,
                set: val => this.getMesh().rotation.z = val,
                options: { name: 'z', label: 'z' }
            }
        ]
    })

if (this.getMesh().scaling)
    fields.push({
        type: 'GROUP',
        options: { label: 'scaling' },
        children: [
            {
                name: 'sx',
                type: 'NUMBER',
                get: () => this.getMesh().scaling.x,
                set: val => this.getMesh().scaling.x = val,
                options: { name: 'x', label: 'x' }
            },
            {
                name: 'sy',
                type: 'NUMBER',
                get: () => this.getMesh().scaling.y,
                set: val => this.getMesh().scaling.y = val,
                options: { name: 'y', label: 'y' }
            },
            {
                name: 'sz',
                type: 'NUMBER',
                get: () => this.getMesh().scaling.z,
                set: val => this.getMesh().scaling.z = val,
                options: { name: 'z', label: 'z' }
            }
        ]
    })

function init() {
}

function update () {
}
