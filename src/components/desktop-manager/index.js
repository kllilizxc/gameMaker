// @flow
// @jsx h

import styles from './style.css'
import JigsawView from '@/ui/jigsaw-view'
import WindowLabel from '../window-label'
import Window from '../window'
import Set from '../set'

export default {
    name: 'desktop-manager',
    props: {
        windows: {
            type: Array,
            default: []
        },
        defaultWindow: {
            type: Object,
            required: true
        }
    },
    data: () => ({}),
    computed: {
        sets() {
            return [
                [this.defaultWindow],
                this.windowLabels
            ]
        },
        windowLabels() {
            return this.windows.filter(({ isFolded }) => isFolded)
        }
    },
    methods: {
        renderWindow(h, window, data) {
            if (window.isFolded) {
                // should render window label
                return h(WindowLabel, {
                    props: { label: window },
                    key: window.title,
                    ...data
                })
            }
        },
        renderSets(h, windows, data, children) {
            if (!windows || !windows.length) return

            if (windows[0].isFolded) {
                // should render fixed container
                return h('div', {
                    ...data,
                    class: styles.windowLabels,
                    attrs: { 'data-fixed': true }
                }, children)
            } else {
                // should render normal container
                return h(Set, {
                    class: styles.sets,
                    props: { windows },
                    ...data
                })
            }
        }
    },
    render(h: any): any {
        const {
            sets,
            renderSets,
            renderWindow
        } = this

        return <JigsawView class={styles.desktopManager}
                           columns={sets}
                           renderColumn={renderSets}
                           renderItem={renderWindow}/>
    }
}
