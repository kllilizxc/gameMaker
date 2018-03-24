fields = []

if (this.position)
    fields.push({
        type: 'GROUP',
        options: { label: 'position' },
        children: [
            {
                name: 'px',
                type: 'NUMBER',
                get: () => this.position.x,
                set: val => this.position.x = val,
                options: { name: 'x', label: 'x' }
            },
            {
                name: 'py',
                type: 'NUMBER',
                get: () => this.position.y,
                set: val => this.position.y = val,
                options: { name: 'y', label: 'y' }
            },
            {
                name: 'pz',
                type: 'NUMBER',
                get: () => this.position.z,
                set: val => this.position.z = val,
                options: { name: 'z', label: 'z' }
            }
        ]
    })

if (this.rotation)
    fields.push({
        type: 'GROUP',
        options: { label: 'rotation' },
        children: [
            {
                name: 'rx',
                type: 'NUMBER',
                get: () => this.rotation.x,
                set: val => this.rotation.x = val,
                options: { name: 'x', label: 'x' }
            },
            {
                name: 'ry',
                type: 'NUMBER',
                get: () => this.rotation.y,
                set: val => this.rotation.y = val,
                options: { name: 'y', label: 'y' }
            },
            {
                name: 'rz',
                type: 'NUMBER',
                get: () => this.rotation.z,
                set: val => this.rotation.z = val,
                options: { name: 'z', label: 'z' }
            }
        ]
    })

if (this.scaling)
    fields.push({
        type: 'GROUP',
        options: { label: 'scaling' },
        children: [
            {
                name: 'sx',
                type: 'NUMBER',
                get: () => this.scaling.x,
                set: val => this.scaling.x = val,
                options: { name: 'x', label: 'x' }
            },
            {
                name: 'sy',
                type: 'NUMBER',
                get: () => this.scaling.y,
                set: val => this.scaling.y = val,
                options: { name: 'y', label: 'y' }
            },
            {
                name: 'sz',
                type: 'NUMBER',
                get: () => this.scaling.z,
                set: val => this.scaling.z = val,
                options: { name: 'z', label: 'z' }
            }
        ]
    })

function init() {
}

function update () {
}
