fields = []

if (this.position)
    fields.push({
        type: 'GROUP',
        options: { label: 'position' },
        children: [
            {
                type: 'NUMBER',
                get: () => this.position.x,
                set: val => this.position.x = val,
                options: { name: 'x', label: 'x' }
            },
            {
                type: 'NUMBER',
                get: () => this.position.y,
                set: val => this.position.y = val,
                options: { name: 'y', label: 'y' }
            },
            {
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
                type: 'NUMBER',
                get: () => this.rotation.x,
                set: val => this.rotation.x = val,
                options: { name: 'x', label: 'x' }
            },
            {
                type: 'NUMBER',
                get: () => this.rotation.y,
                set: val => this.rotation.y = val,
                options: { name: 'y', label: 'y' }
            },
            {
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
                type: 'NUMBER',
                get: () => this.scaling.x,
                set: val => this.scaling.x = val,
                options: { name: 'x', label: 'x' }
            },
            {
                type: 'NUMBER',
                get: () => this.scaling.y,
                set: val => this.scaling.y = val,
                options: { name: 'y', label: 'y' }
            },
            {
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
