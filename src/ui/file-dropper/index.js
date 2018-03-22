import { mapGetters } from 'vuex'

export default {
    name: 'file-dropper',
    computed: mapGetters(['gameObjects']),
    methods: {
        dropHandler(e) {
            e.stopPropagation()
            e.preventDefault()
            const { dataTransfer } = e

            const filename = dataTransfer.getData('filename')
            if (filename) this.$emit('fileDrop', { path: filename })

            const gameObjectId = dataTransfer.getData('gameObject')
            if (gameObjectId) this.$emit('gameObjectDrop', this.gameObjects.find(({ id }) => id === gameObjectId))

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
