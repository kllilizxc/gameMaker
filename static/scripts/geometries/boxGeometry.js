let width = 1, height = 1, depth = 1
const setGeometry = () => {
    const vertexData = BABYLON.VertexData.CreateBox({ width, height, depth })
    console.log(this, this.getMesh(), this.getMesh().setVerticesData)
    vertexData.applyToMesh(this.getMesh(), true)
}
setGeometry()

fields = {
    size: {
        type: 'GROUP',
        children: {
            width: {
                type: 'NUMBER',
                get: () => width,
                set: val => {
                    width = val
                    setGeometry()
                }
            },
            height: {
                type: 'NUMBER',
                get: () => height,
                set: val => {
                    height = val
                    setGeometry()
                }
            },
            depth: {
                type: 'NUMBER',
                get: () => depth,
                set: val => {
                    depth = val
                    setGeometry()
                }
            }
        }
    }
}
