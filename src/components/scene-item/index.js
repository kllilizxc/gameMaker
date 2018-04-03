import TextField from '@/ui/text-field'
import styles from './style.css'
import Icon from '@/ui/icon'
import IconButton from '@/ui/material-icon-button'

export default {
    name: 'scene-item',
    props: {
        value: Object,
        isChosen: Boolean
    },
    data: () => ({
        editMode: false,
        innerValue: '',
        isDragOver: false
    }),
    watch: {
        value: { handler(val) { this.innerValue = val }, immediate: true }
    },
    computed: {
        icon() {
            switch (this.value.getMesh().getClassName()) {
                case 'GroundMesh': return 'widgets'
                case 'HemisphericLight': return 'lightbulb_outline'
                case 'FreeCamera': return 'photo_camera'
                default: return 'widgets'
            }
        }
    },
    methods: {
        handleInput(val) {
            this.innerValue.name = val
        },
        toggleEditMode() {
            this.editMode = !this.editMode
        },
        handleClick() {
            this.$emit('click', this.innerValue)
        },
        handleDelete() {
            this.$emit('delete', this.innerValue)
        },
        handleDragOver(e) {
            e.preventDefault()
            e.stopPropagation()
            this.isDragOver = true
            this.$emit('dragOver', this.innerValue)
            return true
        },
        handleDragLeave(e) {
            this.isDragOver = false
        },
        handleDrop(e) {
            e.preventDefault()
            e.stopPropagation()
            this.isDragOver = false
            this.$emit('drop', { e, obj: this.innerValue })
        },
        handleDragStart(e) {
            if (this.editMode) {
                e.preventDefault()
                e.stopPropagation()
                return
            }
            e.dataTransfer.setData('gameObject', this.innerValue.id)
        },
        handleKeydown(e) {
            if (e.code === 'Enter')
                this.toggleEditMode()
        }
    },
    render() {
        const {
            editMode, innerValue, icon, isChosen, isDragOver,
            toggleEditMode, handleInput, handleClick, handleDelete, handleKeydown,
            handleDragOver, handleDragLeave, handleDrop, handleDragStart
        } = this
        return <div class={styles.item}
                    onDblclick={toggleEditMode}
                    onClick={handleClick}
                    draggable
                    onDragover={handleDragOver}
                    onDragleave={handleDragLeave}
                    onDrop={handleDrop}
                    onDragstart={handleDragStart}
                    onKeydown={handleKeydown}
                    class={[styles.item, {
                        [styles.chosen]: isChosen,
                        [styles.dragOver]: isDragOver
                    }]}>
            <Icon className={styles.icon} icon={icon} size={24}/>
            {editMode ? <TextField value={innerValue.name} type='text' onInput={handleInput}/> : <span>{innerValue.name}</span>}
            {isChosen && <IconButton iconClass={styles.deleteIcon} icon={'cancel'} size={24} onClick={handleDelete}/>}
        </div>
    }
}
