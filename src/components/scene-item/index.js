import TextField from '@/ui/text-field'
import styles from './style.css'
import Icon from '@/ui/icon'

export default {
    name: 'scene-item',
    props: {
        value: Object
    },
    data: () => ({
        editMode: false,
        _value: ''
    }),
    watch: {
        value: { handler(val) { this._value = val.name }, immediate: true }
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
            this._value = val
            this.$emit('input', this._value)
        },
        toggleEditMode() {
            this.editMode = !this.editMode
        },
        handleClick() {
            this.$emit('click')
        }
    },
    render() {
        const { editMode, _value, icon, toggleEditMode, handleInput, handleClick } = this
        return <div class={styles.item} onDblclick={toggleEditMode} onClick={handleClick}>
            <Icon className={styles.icon} icon={icon} size={24}/>
            {editMode ? <TextField value={_value} type='text' onInput={handleInput}/> : <span>{_value}</span>}
        </div>
    }
}
