import { mapGetters } from 'vuex'

export default {
    name: 'file-dropper',
    computed: mapGetters(['scene']),
    methods: {
        dropHandler(e) {
            e.stopPropagation()
            e.preventDefault()
            const { dataTransfer } = e

            const file = dataTransfer.getData('file')
            if (file) this.$emit('fileDrop', JSON.parse(file))

            const gameObjectId = dataTransfer.getData('gameObject')
            if (gameObjectId) this.$emit('gameObjectDrop', this.scene.getMeshByID(gameObjectId).gameObject)

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
