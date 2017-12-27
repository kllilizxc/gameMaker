import { readScriptFromFile } from '../common/util'

export class GameObject {
    constructor(object, parent = null) {
        this.parent = parent
        const { uuid, type, children } = object
        this.uuid = uuid
        this.type = type
        this.raw = object
        this.children = children.map(child => {
            switch (child.type) {
                case 'Scene':
                    return new GameObject(child, this)
                default:
                    return new TransformableGameObject(child, this)
            }
        })
    }
}

export class TransformableGameObject extends GameObject {
    constructor(object, parent = null) {
        super(object, parent)
        const { name, position, rotation, scale, visible } = object
        this.name = name
        this.transform = { position, rotation, scale }
        this.visible = visible
        this.scripts = []
        this.generateTransformScript()
    }
    generateTransformScript() {
        readScriptFromFile('static/scripts/transform.js').then(script => this.scripts.push(script))
    }
}
