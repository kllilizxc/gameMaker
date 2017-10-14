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
        renderSlider(h) {
            this.option.type = 'number'
            this.option.label = this.option.name
            return [createScriptElement(h, 'Slider', this.option),
                    createScriptElement(h, 'TextField', this.option)]
        },
        renderTextField(h) {
            return createScriptElement(h, 'TextField', this.option)
        },
        renderSwitch(h) {
            this.option.label = this.option.name
            return createScriptElement(h, 'Switch', this.option)
        },
        renderPicker(h) {
            this.option.label = this.option.name
            return createScriptElement(h, 'SelectField', this.option,
                this.option.options.map(option => <MenuItem title={option.title} value={option.title}/>))
        },
        renderFilePicker(h) {
            //TODO
            return <div/>
        },
        parseOption(h): any {
            switch (this.option) {
                case STRING_TYPE:
                    return this.renderSlider(h)
                case NUMBER_TYPE:
                    return this.renderTextField(h)
                case BOOLEAN_TYPE:
                    return this.renderSwitch(h)
                case ENUM_TYPE:
                    return this.renderPicker(h)
                case FILE_TYPE:
                    return this.renderFilePicker(h)
                default:
                    logger.log('Error! Not a valid option type!')
                    return <div/>
            }
        }
    },
    render(h): any {
        return <div class={styles.script}>{ this.parseOption(h) }</div>
    }
}
