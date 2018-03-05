import styles from './style.css'
import FileDropper from '@/ui/file-dropper'

export default {
    name: 'file-picker',
    props: {
        title: String
    },
    data: () => ({
        dragOver: false
    }),
    render() {
        const { dragOver, title } = this

        return <FileDropper class={[styles.fileDropper, { [styles.dragOver]: dragOver }]}
                             onFileDrop={file => {
                                 this.$emit('input', file)
                                 this.dragOver = false
                             }}
                             onFileDragOver={() => this.dragOver = true }
                            onFileDragLeave={() => this.dragOver = false}>{title}</FileDropper>
    }
}
