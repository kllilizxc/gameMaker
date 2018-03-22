let { position, rotation, scaling } = this

fields = [
    {
        type: 'GROUP',
        options: {
            label: 'position'
        },
        children: [
            {
                type: 'NUMBER',
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
                type: 'NUMBER',
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
                type: 'NUMBER',
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
    }
]

function init() {
}

function update () {
}
