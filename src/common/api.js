import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'
const logger = console

export const loadMesh = ({ name, data }, scene) => new Promise(resolve => {
    const extension = name.match(/\.([0-9a-z]+)$/i)[1].toLowerCase()
    const meshes = []
    switch (extension) {
        case 'obj':
            new BABYLON.OBJFileLoader().importMesh(null, scene, data, null, meshes)
            break
        case 'stl':
            new BABYLON.STLFileLoader().importMesh(null, scene, data, null, meshes)
            break
        case 'gltf':
            return new BABYLON.GLTFFileLoader().importMeshAsync(null, scene, data, null, resolve)
        case 'babylon':
            return BABYLON.SceneLoader.ImportMesh(null, null, `data:${data}`, scene, resolve)
        default:
            logger.error('Invalid mesh file extension: ' + extension)
    }
    resolve(meshes)
})
