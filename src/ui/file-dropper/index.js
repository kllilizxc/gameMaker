export default {
    name: 'file-dropper',
    methods: {
        dropHandler(e) {
            e.stopPropagation()
            e.preventDefault()
            const { dataTransfer } = e

            if (dataTransfer.items) {
                for (let i = 0; i < dataTransfer.items.length; ++i) {
                    const item = dataTransfer.items[i]
                    if (item.kind === 'file') {
                        const file = item.getAsFile()
                        this.$emit('fileDrop', file)
                    }
                }
            }
        },
        dragOverHandler(e) {
            e.stopPropagation()
            e.preventDefault()
            this.$emit('fileDragOver')
        },
        dragLeaveHandler(e) {
            e.stopPropagation()
            e.preventDefault()
            this.$emit('fileDragLeave')
        }
    },
    render() {
        const {
            dropHandler,
            dragOverHandler,
            dragLeaveHandler
        } = this

        return <div onDrop={dropHandler}
                    onDragover={dragOverHandler}
                    onDragleave={dragLeaveHandler}>
            {this.$slots.default}
        </div>
    }
}
