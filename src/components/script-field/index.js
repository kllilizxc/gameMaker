// @flow
import styles from './style.css'
import { logger } from '../../common/util'
import Switch from '@/ui/switch'
import SelectField from '@/ui/select-field'
import MenuItem from '@/ui/menu-item'
import TextField from '@/ui/text-field'
import NumberInput from '@/components/number-input'

const STRING_TYPE = 'STRING_TYPE'
const NUMBER_TYPE = 'NUMBER_TYPE'
const BOOLEAN_TYPE = 'BOOLEAN_TYPE'
const ENUM_TYPE = 'ENUM_TYPE'
const FILE_TYPE = 'FILE_TYPE'

export type Field = {
    type: string,
    get: () => any,
    set: any => void,
    options: any
}

export default {
    name: 'script-field',
    props: {
        field: {
            type: Object,
            required: true
        }
    },
    methods: {
        createScriptElement(h, component, props, children = []): any {
            const data = {
                props,
                on: {
                    input: value => {
                        this.field.set(value)
                        let newVal = this.field.get()
                        this.$emit('input', newVal)
                    }
                }
            }
            return h(component, data, children)
        },
        renderNumberInput(h: any): any {
            let { options } = this.field
            return this.createScriptElement(h, NumberInput, options)
        },
        renderTextField(h: any): any {
            let { options } = this.field
            options.hintText = options.hintText || 'Please input a string'
            return this.createScriptElement(h, TextField, options)
        },
        renderSwitch(h: any): any {
            let { options } = this.field
            return this.createScriptElement(h, Switch, options)
        },
        renderPicker(h: any): any {
            let { options } = this.field
            return this.createScriptElement(h, SelectField, options,
                options.options.map(option => <MenuItem title={option} value={option}/>))
        },
        renderFilePicker(h: any): any {
            // TODO
            return <div/>
        },
        parseOption(h: any): any {
            this.getFieldValue()
            switch (this.field.type) {
                case NUMBER_TYPE:
                    return this.renderNumberInput(h)
                case STRING_TYPE:
                    return this.renderTextField(h)
                case BOOLEAN_TYPE:
                    return this.renderSwitch(h)
                case ENUM_TYPE:
                    return this.renderPicker(h)
                case FILE_TYPE:
                    return this.renderFilePicker(h)
                default:
                    logger.error('Error! Not a valid option type!')
                    return
            }
        },
        getFieldValue() {
            this.field.options.value = this.field.get()
        }
    },
    render(h: any): any {
        return <div class={styles.scriptField}>{this.parseOption(h)}</div>
    }
}
