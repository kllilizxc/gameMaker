import TextField from '@/ui/text-field'
import styles from './style.css'

export default {
    name: 'scene-item',
    props: {
        value: String
    },
    data: () => ({
        editMode: false,
        _value: ''
    }),
    watch: {
        value: { handler(val) { this._value = val }, immediate: true }
    },
    methods: {
        handleInput(val) {
            this._value = val
            this.$emit('input', this._value)
        },
        toggleEditMode() {
            this.editMode = !this.editMode
        }
    },
    render() {
        const { editMode, _value, toggleEditMode, handleInput } = this
        return <div class={styles.item} onDblclick={toggleEditMode}>
            {editMode ? <TextField value={_value} type='text' onInput={handleInput}/> : <span>{_value}</span>}
        </div>
    }
}
