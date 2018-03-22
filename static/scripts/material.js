let texture

fields = [
    {
        type: 'FILE',
        get: () => texture,
        set: val => {
            console.log(val)
            texture = new BABYLON.Texture(val, scene)
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
