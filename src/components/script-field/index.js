// @flow
import styles from './style.css'
import { logger } from '../../common/util'
import Switch from '@/ui/switch'
import Slider from '@/ui/slider'
import SelectField from '@/ui/select-field'
import MenuItem from '@/ui/menu-item'
import TextField from '@/ui/text-field'

const STRING_TYPE = 'STRING_TYPE'
const NUMBER_TYPE = 'NUMBER_TYPE'
const BOOLEAN_TYPE = 'BOOLEAN_TYPE'
const ENUM_TYPE = 'ENUM_TYPE'
const FILE_TYPE = 'FILE_TYPE'

function createScriptElement(h, name, options, children) {
    return h(name, {
        props: Object.keys(options).reduce((obj, option) => obj[option] = this[option], {})
        on: {
            input(value) { this.$emit('input', value) }
        }
    }, children)
}

export default {
    name: 'script',
    props: {
        option: {
            type: Object,
            required: true
        }
    },
    methods: {
        renderSlider() {
            this.option.type = 'number'
            this.option.label = this.option.name
            return [createScriptElement('Slider', this.option),
                    createScriptElement('TextField', this.option)]
        },
        renderTextField() {
            return createScriptElement('TextField', this.option)
        },
        renderSwitch() {
            this.option.label = this.option.name
            return createScriptElement('Switch', this.option)
        },
        renderPicker() {
            this.option.label = this.option.name
            return createScriptElement('SelectField', this.option,
                this.option.options.map(option => <MenuItem title={option.title} value={option.title}/>))
        },
        renderFilePicker() {
            //TODO
            return <div/>
        },
        parseOption(): any {
            switch (this.option) {
                case STRING_TYPE:
                    return this.renderSlider()
                case NUMBER_TYPE:
                    return this.renderTextField()
                case BOOLEAN_TYPE:
                    return this.renderSwitch()
                case ENUM_TYPE:
                    return this.renderPicker()
                case FILE_TYPE:
                    return this.renderFilePicker()
                default:
                    logger.log('Error! Not a valid option type!')
                    return <div/>
            }
        }
    },
    render(): any {
        return <div class={styles.script}>{ this.parseOption() }</div>
    }
}
