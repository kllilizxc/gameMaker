let model

fields = {
    model: {
        type: 'FILE',
        get: () => model,
        set: val => gm.loadMesh(model = val, scene)
            .then(([mesh]) => {
                const oldMesh = this.getMesh()
                this.setMesh(mesh)
            })
    }
}
