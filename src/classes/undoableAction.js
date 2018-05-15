export default class UndoableAction {
    static stackSize = 30
    static actionStack = new Array(UndoableAction.stackSize)
    static endIndex = 0
    static currentIndex = 0

    static redoable() {
        return !(UndoableAction.currentIndex === UndoableAction.endIndex)
    }

    static undoable() {
        return !(UndoableAction.currentIndex === this.advance(UndoableAction.endIndex))
    }

    static addAction(action) {
        UndoableAction.actionStack[UndoableAction.currentIndex] = action
        if (UndoableAction.currentIndex === UndoableAction.endIndex)
            UndoableAction.endIndex = this.advance(UndoableAction.endIndex)
        UndoableAction.currentIndex = this.advance(UndoableAction.currentIndex)
        action.redo()
    }

    static undoAction() {
        if (!this.undoable()) return
        const index = this.back(UndoableAction.currentIndex)
        const action = UndoableAction.actionStack[index]
        if (!action) return
        UndoableAction.currentIndex = index
        action.undo()
    }

    static redoAction() {
        if (!this.redoable()) return
        const action = UndoableAction.actionStack[UndoableAction.currentIndex]
        if (!action) return
        UndoableAction.currentIndex = this.advance(UndoableAction.currentIndex)
        action.redo()
    }

    static advance(index) {
        return (index + 1) % UndoableAction.stackSize
    }

    constructor(oldVal, newVal, setFunc) {
        this.oldVal = oldVal
        this.newVal = newVal
        this.setFunc = setFunc
    }

    static back(index) {
        return (index - 1 + UndoableAction.stackSize) % UndoableAction.stackSize
    }

    undo() {
        this.setFunc(this.oldVal)
    }

    redo() {
        this.setFunc(this.newVal)
    }
}
