// @flow
import styles from './style.css'
import Desktop from '@/components/desktop'
import Window from '@/components/window'
import WindowLabelList from '@/components/window-label-list'

type WindowType = {
    title: string,
    content: any
}

type DesktopType = {
    windows: Window[]
}

export default {
    name: 'desktop-manager',
    data: () => ({
        desktops: []
    }),
    methods: {
        gotoDesktop(index: number): void {
            this.$el.style.transform = `translateX(${-100 * index}%)`
        },
        addWindow(window: WindowType, size: number) {
            //size:
            //0: none
            //1: 1/3
            //2: 1/2
            //3: 1
            if (!size) return

        },
        handleNewWindow({ name, content }): void {
        },
        handleMovingWindow({ name, deltaX }): void {

        },
        handleMovingWindowEnd({name, size}): void {

        }
    },
    created() {

    },
    computed: {
        windowLabels() {
            return [
                { icon: 'dashboard', name: 'dashboard' },
                { icon: 'face', name: 'face' },
                { icon: 'favorite', name: 'favorite' },
                { icon: 'delete', name: 'delete' },
                { icon: 'polymer', name: 'polymer' }
            ]
        },
    },
    render() {
        let {
            desktops,
            windowLabels,
            handleNewWindow,
            handleMovingWindow,
            handleMovingWindowEnd
        } = this

        return <div class={styles.desktopManager}
                    onNewWindow={handleNewWindow}
                    onMovingWindow={handleMovingWindow}
                    onMovingWindowEnd={handleMovingWindowEnd}>
            {desktops && desktops.map(desktop => <Desktop>
                {desktop.windows && desktop.windows.map(window =>
                    <Window title={window.title} color={window.color}>{window.content}</Window>)}
            </Desktop>)}
            <WindowLabelList labels={windowLabels}/>
        </div>
    }
}
