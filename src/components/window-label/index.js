// @flow
import styles from './style.css'

import Card from '@/ui/card'
import Icon from '@/ui/icon'

export default {
    name: 'window-label',
    props: {
        label: {
            type: Object,
            required: true
        }
    },
    data: () => ({}),
    methods: {
    },
    render(h: any): any {
        const {
            label: { icon, title, color }
        } = this

        return <div class={styles.windowLabel}>
            <Card class={styles.card} style={{ background: color }}>
                <Icon className={styles.icon} icon={icon} size={32}/>
                <div class={styles.title}>{title}</div>
            </Card>
        </div>
    }
}
