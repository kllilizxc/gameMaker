let texture

fields = [
    {
        name: 'texture',
        type: 'FILE',
        get: () => texture,
        set: val => {
            if (!val) return
            texture = new BABYLON.Texture(val.path, scene)
            this.material = new BABYLON.StandardMaterial('material', scene)
            this.material.diffuseTexture = texture
        },
        options: {
            label: 'texture'
        }
    }
]

start = () => {
}

function update() {
}
