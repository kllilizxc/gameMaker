import styles from './style.css'
import FileDropper from '@/ui/file-dropper'

export default {
    name: 'file-picker',
    data: () => ({
        dragOver: false
    }),
    render() {
        const { dragOver } = this

        return <FileDropper class={[styles.fileDropper, { [styles.dragOver]: dragOver }]}
                             onFileDrop={file => {
                                 this.$emit('input', file)
                                 this.dragOver = false
                             }}
                             onFileDragOver={() => this.dragOver = true }
                             onFileDragLeave={() => this.dragOver = false}/>
    }
}
