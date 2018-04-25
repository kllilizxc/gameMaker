import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'
const logger = console

export const loadMesh = ({ name, data }, scene) => new Promise(resolve => {
    const extension = name.match(/\.([0-9a-z]+)$/i)[1].toLowerCase()
    let meshes = []
    switch (extension) {
        case 'obj':
            new BABYLON.OBJFileLoader().importMesh(null, scene, data, null, meshes)
            break
        case 'stl':
            new BABYLON.STLFileLoader().importMesh(null, scene, data, null, meshes)
            break
        case 'gltf':
            new BABYLON.GLTFFileLoader().importMeshAsync(null, scene, data, null, loadedMeshes => {
                meshes = loadedMeshes
                resolve(meshes)
            })
            break
        default:
            logger.error('Invalid mesh file extension: ' + extension)
    }
    resolve(meshes)
})
