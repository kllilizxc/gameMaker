let { width, height, depth } = gameObject.geometry.parameters

this.fields = [
    {
        type: 'NUMBER_TYPE',
        get: () => width,
        set: val => {
            width = val
            setGeometry()
        },
        options: { label: 'width' }
    },
    {
        type: 'NUMBER_TYPE',
        get: () => height,
        set: val => {
            height = val
            setGeometry()
        },
        options: { label: 'height' }
    },
    {
        type: 'NUMBER_TYPE',
        get: () => depth,
        set: val => {
            depth = val
            setGeometry()
        },
        options: { label: 'depth' }
    }
]

const setGeometry = () => {
    gameObject.geometry = new THREE.BoxBufferGeometry(width, height, depth)
}
