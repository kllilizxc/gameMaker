let file

fields = {
    file: {
        type: 'FILE',
        get: () => file,
        set: val => {
            file = val
            gm.loadMesh(file, scene).then(meshes => console.log(meshes))
        }
    }
}

function init() {
}
