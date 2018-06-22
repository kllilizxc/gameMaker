// @flow
import styles from './style.css'
import Card from 'Ui/card'
import Icon from 'Ui/icon'

import Hideable from '@/ui/hideable'

export default {
    name: 'window-label',
    props: {
        label: {
            type: Object,
            required: true
        }
    },
    methods: {
        hide(style: { transform: string, marginBottom: string }): void {
            style.transform = 'translateX(80%)'
            style.marginBottom = '-20px'
        },
        show(style: { transform: string, margin: string }): void {
            style.transform = 'translateX(0)'
            style.margin = '0'
        }
    },
    render() {
        const {
            label: { icon, title, color },
            hide,
            show
        } = this

        return <Hideable
            class={styles.windowLabel}
            hideFunction={hide}
            showFunction={show}>
            <Card class={[styles.card, styles.label]} data-title={title} style={{ background: color }}>
                <Icon className={styles.icon} icon={icon} size={32}/>
                <div class={styles.title}>{title}</div>
            </Card>
        </Hideable>
    }
}
