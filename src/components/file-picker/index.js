import styles from './style.css'
import FileDropper from '@/ui/file-dropper'

export default {
    name: 'file-picker',
    props: {
        type: {
            type: String,
            default: 'file'
        }
    },
    data: () => ({
        dragOver: false,
        title: ''
    }),
    methods: {
        handleFileDrop(file) {
            if (this.type !== 'file') return
            this.$emit('input', file)
            this.title = file.name
            this.dragOver = false
        },
        handleGameObjectDrop(gameObject) {
            if (this.type !== 'gameObject') return
            this.$emit('input', gameObject)
            this.title = gameObject.name
            this.dragOver = false
        }
    },
    render() {
        const { dragOver, title, handleFileDrop, handleGameObjectDrop } = this

        return <FileDropper class={[styles.fileDropper, { [styles.dragOver]: dragOver }]}
                            onFileDrop={handleFileDrop}
                            onGameObjectDrop={handleGameObjectDrop}
                            onFileDragOver={() => this.dragOver = true }
                            onFileDragLeave={() => this.dragOver = false}>{title}</FileDropper>
    }
}
