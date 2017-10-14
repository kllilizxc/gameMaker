export default {
    functional: true,
    props: {
        label: {
            type: String,
            required: true
        },
        labelLeft: Boolean,
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleInput(value: Boolean): void {
            this.$emit('input', value)
        }
    },
    render() {
        let {
            label,
            labelLeft,
            disabled,
            value,
            handleInput
        } = this
        return <mu-switch label={label}
                          labelLeft={labelLeft}
                          disabled={disabled}
                          value={value}
                          onInput={handleInput}/>
    }
}
