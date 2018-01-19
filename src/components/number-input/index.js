import Slider from '@/ui/slider'
import TextField from '@/ui/text-field'
import styles from './style.css'

export default {
    name: 'number-input',
    props: {
        name: String,
        icon: String,
        label: String,
        labelFloat: Boolean,
        disabled: Boolean,
        hintText: String,
        errorText: String,
        underlineShow: Boolean,
        multiLine: Boolean,
        rows: Number,
        rowsMax: Number,
        maxLength: Number,
        value: {
            type: Number,
            default: 0
        },
        max: Number,
        min: Number,
        step: Number
    },
    data() {
        return {
            inputValue: this.value
        }
    },
    methods: {
        handleInput(value) {
            this.inputValue = +value
            this.$emit('input', this.inputValue)
        }
    },
    render() {
        let {
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
            step,
            handleInput
        } = this

        return <div class={styles.numberInput}>
            <TextField class={styles.textField}
                       type={'number'}
                       icon={icon}
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
                       value={'' + this.inputValue}
                       max={max}
                       min={min}
                       onInput={handleInput}/>
            <Slider class={styles.slider}
                    name={name || label}
                    step={step}
                    disabled={disabled}
                    value={this.inputValue}
                    max={max}
                    min={min}
                    onInput={handleInput}/>
        </div>
    }
}
