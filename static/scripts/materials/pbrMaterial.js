let albedoTexture, bumpTexture
let PBRMaterial = new BABYLON.PBRMaterial('pbrMaterial', scene)

this.getMesh().material = PBRMaterial

fields = {
    albedoTexture: {
        type: 'FILE',
        get: () => albedoTexture,
        set: val => val && (PBRMaterial.albedoTexture = new BABYLON.Texture((albedoTexture = val).data, scene))
    },
    bumpTexture: {
        type: 'FILE',
        get: () => bumpTexture,
        set: val => val && (PBRMaterial.bumpTexture = new BABYLON.Texture((bumpTexture = val).data, scene))
    }
}
