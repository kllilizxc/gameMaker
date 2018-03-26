let size = 1
const vertexData = BABYLON.VertexData.CreateBox(1)
vertexData.applyToMesh(this.getMesh(), true)

const { geometry } = this.getMesh()

fields = [
    {
        name: 'size',
        type: 'NUMBER',
        get: () => geometry.size,
        set: val => geometry.size = val,
        options: { label: 'size' }
    }
]
