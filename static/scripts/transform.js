let { position, rotation, scale } = gameObject.transform

this.fields = [
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
    }
]

this.update = function () {

}
