// @flow
import styles from './style.css'
import WindowLabel from 'Components/window-label'

export default {
    name: 'window-label-list',
    props: {
        labels: {
            type: Array,
            required: true
        }
    },
    methods: {
        hide(): void {
            this.$el.styles.transform = 'translateX(60%)'
        },
        show(): void {
            this.$el.styles.transform = 'translateX(0)'
        }
    },
    render() {
        const {
            labels
        } = this

        return <div class={styles.windowLabelList}>
            {labels && labels.map(label => <WindowLabel icon={label.icon} name={label.name} />)}
        </div>
    }
}
