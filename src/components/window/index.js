// @flow
import styles from './style.css'
import Card from '@/ui/card'

export default {
    name: 'window',
    props: {
        window: {
            type: Object,
            required: true
        }
    },
    methods: {},
    render() {
        const {
            window: { color, content }
        } = this

        return <div class={styles.window}>
            <Card class={styles.container}
                  style={{ backgroundColor: color }}>
                {content}
            </Card>
        </div>
    }
}
