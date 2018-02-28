let { position, rotation, scale } = gameObject

let file

this.fields = [
    {
        type: 'GROUP_TYPE',
        options: {
            label: 'position'
        },
        children: [
            {
                type: 'NUMBER_TYPE',
                get() {
                    return position.x
                },
                set(val) {
                    position.x = val
                },
                options: {
                    name: 'x',
                    label: 'x'
                }
            },
            {
                type: 'NUMBER_TYPE',
                get() {
                    return position.y
                },
                set(val) {
                    position.y = val
                },
                options: {
                    name: 'y',
                    label: 'y'
                }
            },
            {
                type: 'NUMBER_TYPE',
                get() {
                    return position.z
                },
                set(val) {
                    position.z = val
                },
                options: {
                    name: 'z',
                    label: 'z'
                }
            }
        ]
    },
    {
        type: 'NUMBER_TYPE',
        get() {
            return rotation.z
        },
        set(val) {
            rotation.z = val
        },
        options: {
            name: 'z',
            label: 'z'
        }
    },
    {
        type: 'FILE_TYPE',
        get: () => file,
        set: val => file = val,
        options: { label: 'file' }
    }
]

this.update = function () {
}
