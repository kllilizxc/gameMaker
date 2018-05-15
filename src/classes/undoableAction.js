export default class UndoableAction {
    static stackSize = 30
    static actionStack = new Array(this.stackSize)
    static endIndex = 0
    static currentIndex = 0

    static redoable() {
        return !(this.currentIndex === this.endIndex)
    }

    static undoable() {
        return !(this.currentIndex === this.advance(this.endIndex))
    }

    static addAction(action) {
        this.actionStack[this.currentIndex] = action
        if (this.currentIndex === this.endIndex)
            this.endIndex = this.advance(this.endIndex)
        this.currentIndex = this.advance(this.currentIndex)
        action.redo()
    }

    static undoAction() {
        if (!this.undoable()) return
        const index = this.back(this.currentIndex)
        const action = this.actionStack[index]
        if (!action) return
        this.currentIndex = index
        action.undo()
    }

    static redoAction() {
        if (!this.redoable()) return
        const action = this.actionStack[this.currentIndex]
        if (!action) return
        this.currentIndex = this.advance(this.currentIndex)
        action.redo()
    }

    static advance(index) {
        return (index + 1) % this.stackSize
    }

    constructor(oldVal, newVal, setFunc) {
        this.oldVal = oldVal
        this.newVal = newVal
        this.setFunc = setFunc
    }

    static back(index) {
        return (index - 1 + this.stackSize) % this.stackSize
    }

    undo() {
        this.setFunc(this.oldVal)
    }

    redo() {
        this.setFunc(this.newVal)
    }
}
