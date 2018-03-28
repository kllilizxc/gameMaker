let texture
this.getMesh().receiveShadows = true

fields = {
    texture: {
        type: 'FILE',
        get: () => texture,
        set: val => {
            if (!val) return
            texture = new BABYLON.Texture(val.path, scene)
            this.getMesh().material = new BABYLON.StandardMaterial('material', scene)
            this.getMesh().material.diffuseTexture = texture
        }
    },
    receiveShadows: {
        type: 'BOOLEAN',
        get: () => this.getMesh().receiveShadows,
        set: val => this.getMesh().receiveShadows = val
    }
}

start = () => {
}

function update() {
}
