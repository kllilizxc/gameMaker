export default class GameObject {
    constructor(object, parent = null) {
        this.parent = parent
        const { uuid, name, type, children, position, rotation, scale, visible } = object
        this.uuid = uuid
        this.name = name
        this.type = type
        this.transform = { position, rotation, scale }
        this.visible = visible
        this.children = children.map(child => new GameObject(child, this))
        this.scripts = [this.generateTransformScript(this.transform)]
    }
    generateTransformScript({ position, rotation, scale }) {
        // TODO
    }
}
