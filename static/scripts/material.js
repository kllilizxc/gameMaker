let texture

this.fields = [
    {
        type: 'FILE_TYPE',
        get: () => texture,
        set: val => {
            texture = new THREE.TextureLoader().load(val)
            gameObject.material = new THREE.MeshBasicMaterial({ map: texture })
        },
        options: {
            label: 'texture'
        }
    }
]

this.start = () => {
}
