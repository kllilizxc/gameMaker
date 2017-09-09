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
        },
        handleNewWindow({ name, content }) {
            this.$emit('newWindow', { name, content })
            console.log('newWindow', 'window-label-list')
        },
        handleMovingWindow(deltaX) {
            this.$emit('movingWindow', deltaX)
        },
        handleMovingWindowEnd(size) {
            this.$emit('movingWindowEnd', size)
        }
    },
    render() {
        const {
            labels,
            handleNewWindow,
            handleMovingWindow,
            handleMovingWindowEnd
        } = this

        return <div class={styles.windowLabelList}>
            {labels && labels.map(label => <WindowLabel icon={label.icon}
                                                        name={label.name}
                                                        onNewWindow={handleNewWindow}
                                                        onMovingWindow={handleMovingWindow}
                                                        onMovingWindowEnd={handleMovingWindowEnd} />)}
        </div>
    }
}
