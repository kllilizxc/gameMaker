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
    methods: {
        handleInput(value) {
            this.$emit('input', +value)
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
            handleInput,
            value
        } = this

        return <div class={styles.numberInput}>
            <TextField class={styles.textField}
                       color={'secondary'}
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
                       value={value}
                       max={max}
                       min={min}
                       onClick={handleClick}
                       onInput={handleInput}/>
        </div>
    }
}
