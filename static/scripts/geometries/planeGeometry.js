let width = 15, height = 15
const setGeometry = () => {
    const vertexData = BABYLON.VertexData.CreatePlane({ width, height })
    vertexData.applyToMesh(this.getMesh(), true)
}
setGeometry()
