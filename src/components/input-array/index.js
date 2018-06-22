import styles from './style.css'
import TextField from '@/ui/text-field'

export default {
    name: 'input-array',
    props: {
        renderItem: {
            type: Function,
            required: true
        },
        initSize: {
            type: Number,
            default: 0
        }
    },
    data: ({ initSize }) => ({
        size: initSize || 0
    }),
    render(h) {
        return <div>
            <div class={styles.label}>size</div>
            <TextField color={'secondary'} fullWidth type='number' min={0} step={1} value={this.size} onInput={val => {
                this.size = +val
                this.$emit('inputSize', this.size)
            }}/>
            {this.size > 0 && [...Array(this.size)].map((_, index) => this.renderItem(index))}
        </div>
    }
}
