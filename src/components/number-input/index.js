import TextField from '@/ui/text-field'
import styles from './style.css'

export default {
    name: 'number-input',
    props: {
        name: String,
        icon: String,
        label: String,
        labelFloat: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        hintText: String,
        errorText: String,
        fullWidth: {
            type: Boolean,
            default: true
        },
        underlineShow: {
            type: Boolean,
            default: true
        },
        multiLine: Boolean,
        rows: Number,
        rowsMax: Number,
        maxLength: Number,
        value: {
            type: Number,
            default: 0
        },
        max: Number,
        min: Number
    },
    data() {
        return {
            inputValue: this.value
        }
    },
    methods: {
        handleInput(value) {
            console.log(value)
            this.inputValue = +value
            this.$emit('input', this.inputValue)
        },
        handleClick() {
            this.$refs.input.focus()
        }
    },
    render() {
        const {
            icon,
            label,
            labelFloat,
            disabled,
            hintText,
            errorText,
            underlineShow,
            multiLine,
            rows,
            rowsMax,
            maxLength,
            max,
            min,
            handleClick,
            handleInput
        } = this

        return <div class={styles.numberInput}>
            <TextField class={styles.textField}
                       ref={'input'}
                       type={'number'}
                       icon={icon}
                       fullWidth
                       label={label || name}
                       labelFloat={labelFloat}
                       disabled={disabled}
                       hintText={hintText}
                       errorText={errorText}
                       underlineShow={underlineShow}
                       multiLine={multiLine}
                       rows={rows}
                       rowsMax={rowsMax}
                       maxLength={maxLength}
                       value={this.inputValue}
                       max={max}
                       min={min}
                       onClick={handleClick}
                       onInput={handleInput}/>
        </div>
    }
}
