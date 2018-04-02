let shadowMapSize = 1024
let shadowGenerator
const setShadowMapSize = () => {
    shadowGenerator = new BABYLON.ShadowGenerator(shadowMapSize, this.getMesh())
    scene.meshes.forEach(mesh => shadowGenerator.addShadowCaster(mesh, true))
}
setShadowMapSize()

fields = {
    shadowMapSize: {
        type: 'NUMBER',
        get: () => shadowMapSize,
        set: val => {
            if (val % 16 !== 0) return
            shadowMapSize = val
            setShadowMapSize()
        }
    },
    poissonSampling: {
        type: 'BOOLEAN',
        get: () => shadowGenerator.usePoissonSampling,
        set: val => shadowGenerator.usePoissonSampling = val
    },
    exponential: {
        type: 'BOOLEAN',
        get: () => shadowGenerator.useExponentialShadowMap,
        set: val => shadowGenerator.useExponentialShadowMap = val
    },
    blurExponential: {
        type: 'BOOLEAN',
        get: () => shadowGenerator.useBlurExponentialShadowMap,
        set: val => shadowGenerator.useBlurExponentialShadowMap = val
    },
    blurKernel: {
        type: 'NUMBER',
        get: () => shadowGenerator.blurKernel,
        set: val => shadowGenerator.blurKernel = val
    },
    closeExponential: {
        type: 'BOOLEAN',
        get: () => shadowGenerator.useCloseExponentialShadowMap,
        set: val => shadowGenerator.useCloseExponentialShadowMap
    },
    blurCloseExponential: {
        type: 'BOOLEAN',
        get: () => shadowGenerator.useCloseExponentialShadowMap,
        set: val => shadowGenerator.useCloseExponentialShadowMap = val
    }
}
