// @flow

export default class Window {
    title: string
    icon: string
    color: string
    content: any
    size: number
    ref: any
    isFolded: boolean

    constructor(icon: string, title: string, color: string, content: any, isFolded: boolean = true, size: number = 0): void {
        this.title = title
        this.icon = icon
        this.color = color
        this.content = content
        this.isFolded = isFolded
        this.size = size
    }

    startMoving(ref: any): void {
        if (ref) this.ref = ref
        this.ref.startMoving()
    }

    move(deltaX: number): void {
        this.ref.move(deltaX)
    }

    release(deltaX: number, blockSize: number): Promise<any> {
        this.size = (deltaX / blockSize).toFixed()
        if (!this.size)
            return this.ref.fold().then(() => this.isFolded = true)
        else
            return this.ref.expand(this.size) // percentage
    }
}
