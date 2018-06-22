const defaultScrips = []

const scripts = {
    materials: ['standardMaterial', 'pbrMaterial', 'backgroundMaterial'],
    cameras: ['arcRotateCamera', 'followCamera', 'universalCamera'],
    geometries: ['boxGeometry', 'geometry', 'groundGeometry', 'planeGeometry', 'sphereGeometry'],
    lights: ['directionalLight', 'hemisphericLight', 'pointLight', 'shadowGenerator', 'spotLight'],
    basic: ['physics', 'transform', 'animation']
}

Object.keys(scripts).forEach(key => {
    const type = { key, children: [] }
    scripts[key].forEach(function(name) {
        type.children.push({ key: name, data: require('raw-loader!./' + key + '/' + name) })
    })
    defaultScrips.push(type)
})

export default defaultScrips
