const defaultScrips = {}

const scripts = {
    materials: ['standardMaterial', 'pbrMaterial']
}

const outerScripts = ['physics']

Object.keys(scripts).forEach(key => {
    scripts[key].forEach(name => defaultScrips[name] = require('raw-loader!./' + key + '/' + name))
})
outerScripts.forEach(name => defaultScrips[name] = require('raw-loader!./' + name))

export default defaultScrips
