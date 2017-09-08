// @flow
import styles from './style.css'
import Card from 'Ui/card'
import Icon from 'Ui/icon'

import { afterTransition } from '@/common/util'

export default {
    name: 'window-label',
    props: {
        icon: {
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    render() {
        const {
            icon
        } = this

        return <div class={styles.windowLabel}>
            <Card class={styles.card}>
                <Icon icon={icon}/>
                <div class={styles.name}>{name}</div>
            </Card>
        </div>
    }
}
