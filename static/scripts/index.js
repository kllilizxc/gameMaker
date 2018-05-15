const defaultScrips = {}

const scripts = {
    materials: ['standardMaterial', 'pbrMaterial', 'backgroundMaterial'],
    cameras: ['arcRotateCamera', 'followCamera', 'universalCamera'],
    geometries: ['boxGeometry', 'geometry', 'groundGeometry', 'planeGeometry', 'sphereGeometry'],
    lights: ['directionalLight', 'hemisphericLight', 'pointLight', 'shadowGenerator', 'spotLight'],
    basic: ['physics', 'transform']
}

const outerScripts = []

Object.keys(scripts).forEach(key => {
    scripts[key].forEach(function(name) {
        defaultScrips[name] = require('raw-loader!./' + key + '/' + name)
    })
})
outerScripts.forEach(function(name) {
    defaultScrips[name] = require('raw-loader!./' + name)
})

export default defaultScrips
