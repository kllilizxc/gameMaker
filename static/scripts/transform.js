let { position, rotation, scaling } = this
console.log(this)

fields = [
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
    }
]

function init() {
}

function update () {
}
