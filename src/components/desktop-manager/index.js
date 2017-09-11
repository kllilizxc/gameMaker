// @flow
import styles from './style.css'
import Desktop from '@/components/desktop'
import Window from '@/components/window'
import WindowLabelList from '@/components/window-label-list'

type WindowType = {
    title: string,
    content: any,
    size: number
}

type DesktopType = {
    windows: Window[]
}

export const MAX_SIZE = 4

export default {
    name: 'desktop-manager',
    data: () => ({
        desktops: [],
        currentWindow: null,
        currentDesktopIndex: 0
    }),
    methods: {
        gotoDesktop(index: number): void {
            if (this.$el)
                this.$el.style.transform = `translateX(${-100 * index}vw)`
        },
        gotoLastDesktop() : void {
            if(this.currentDesktopIndex > 0)
                this.gotoDesktop(--this.currentDesktopIndex)
        },
        gotoNextDesktop() : void {
            if(this.currentDesktopIndex < this.desktops.length - 1)
                this.gotoDesktop(++this.currentDesktopIndex)
        },
        addDesktop(desktop: DesktopType): void {
            this.desktops.push(desktop)
            this.$el.style.width = `${this.desktops.length * 100}vw`
            this.gotoDesktop(++this.currentDesktopIndex)
        },
        handleNewWindow({ name, content, color }): void {
            this.currentWindow = { title: name, content, color }
            this.createDesktopIfShould()
        },
        handleMovingWindow(deltaX: number): void {
            if (this.currentWindow)
                this.$refs.currentWindow.$el.style.width = `${Math.abs(deltaX)}px`
        },
        createDesktopIfShould(): DesktopType {
            let currentDesktop = this.desktops[this.currentDesktopIndex]
            if (!currentDesktop) {
                this.desktops[this.currentDesktopIndex] = currentDesktop = { windows: [] }
            }
            return currentDesktop
        },
        handleMovingWindowEnd(size): void {
            if (!size || !this.currentWindow) {
                this.currentWindow = null
                return
            }

            let { windows } = this.createDesktopIfShould()

            this.currentWindow.size = size
            console.log(windows.length, size)
            if (windows.length + size > MAX_SIZE) {
                //create a new window
                this.addDesktop({ windows: [this.currentWindow] })
            } else {
                //shrink the first window to fit the new window
                if (windows.length) {
                    let totalSize = windows.reduce((sum, window) => sum += window.size, 0)
                    windows[0].size -= totalSize + size - MAX_SIZE
                } else {
                    this.currentWindow.size = MAX_SIZE
                }
                windows.push(this.currentWindow)
            }
            this.currentWindow = null
        }
    },
    created() {

    },
    computed: {
        windowLabels() {
            return [
                { icon: 'dashboard', name: 'dashboard', color: '#EF9A9A' },
                { icon: 'face', name: 'face', color: '#9FA8DA' },
                { icon: 'favorite', name: 'favorite', color: '#80DEEA' },
                { icon: 'delete', name: 'delete', color: '#80CBC4' },
                { icon: 'polymer', name: 'polymer', color: '#E6EE9C' }
            ]
        },
    },
    render() {
        let {
            desktops,
            windowLabels,
            currentDesktopIndex,
            currentWindow,
            handleNewWindow,
            handleMovingWindow,
            handleMovingWindowEnd,
            gotoLastDesktop,
            gotoNextDesktop
        } = this

        return <div class={styles.desktopManager}>
            {desktops && desktops.map((desktop, index) => <Desktop>
                {desktop.windows && desktop.windows.map(window =>
                    <Window title={window.title}
                            key={window.title}
                            color={window.color}
                            slot="flex"
                            style={{ flex: window.size }}>{window.content}</Window>)}
                {index === currentDesktopIndex && currentWindow &&
                <Window title={currentWindow.title}
                        color={currentWindow.color}
                        class={styles.currentWindow}
                        ref="currentWindow">{''}</Window>}
            </Desktop>)}
            <WindowLabelList labels={windowLabels}
                             onNewWindow={handleNewWindow}
                             onMovingWindow={handleMovingWindow}
                             onMovingWindowEnd={handleMovingWindowEnd}/>
        </div>
    }
}
