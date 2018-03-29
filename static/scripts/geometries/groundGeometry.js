let width = 100, height = 100
const setGeometry = () => {
    const vertexData = BABYLON.VertexData.CreateGround({ width, height })
    vertexData.applyToMesh(this.getMesh(), true)
}
setGeometry()
