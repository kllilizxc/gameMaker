// @flow
import styles from './style.css'
import Card from 'Ui/card'
import Icon from 'Ui/icon'

import Hideable from '@/ui/hideable'

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
    data: () => ({
        isHide: true
    }),
    methods: {
        hide(style) {
            style.transform = 'translateX(80%)'
            style.marginBottom = '-20px'
            this.isHide = true
        },
        show(style) {
            style.transform = 'translateX(0)'
            style.margin = '0'
            this.isHide = false
        }
    },
    render() {
        const {
            icon,
            name,
            hide,
            show
        } = this

        return <div class={styles.windowLabel}>
            <Hideable class={styles.container}
                      hideFunction={hide}
                      showFunction={show}>
                <Card class={styles.card}>
                    <Icon className={styles.icon} icon={icon} size={32}/>
                    <div class={styles.name}>{name}</div>
                </Card>
            </Hideable>
        </div>
    }
}
