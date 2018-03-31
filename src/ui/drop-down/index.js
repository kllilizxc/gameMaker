import styles from './styles.css'
import IconButton from '@/ui/material-icon-button'

export default {
    name: 'drop-down',
    props: {
        initFold: {
            type: Boolean,
            default: true
        },
        canFold: {
            type: Boolean,
            default: true
        }
    },
    data: () => ({
        fold: true
    }),
    watch: {
        initFold: {
            handler(val) {
                this.fold = val
            },
            immediate: true
        }
    },
    methods: {
        toggle() {
            this.fold = !this.fold
            this.$emit('input', this.fold)
        }
    },
    render() {
        return <div class={styles.dropDown}>
            <div class={styles.title}>
                {this.$slots.title}
                {this.canFold &&
                <IconButton class={[styles.arrowIcon, { [styles.unFold]: this.fold }]}
                            icon={'arrow_drop_down'} onClick={this.toggle} size={24}/>}
            </div>
            {!this.fold && this.$slots.content}
        </div>
    }
}
