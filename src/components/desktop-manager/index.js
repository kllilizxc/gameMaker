// @flow
import styles from './style.css'
import Desktop from '@/components/desktop'
import Window from '@/components/window'
import WindowLabelList from '@/components/window-label-list'
import FloatButton from '@/ui/float-button'
import Hideable from '@/ui/hideable'
import { afterTransition } from '../../common/util'

type WindowType = {
    title: string,
    content: any,
    size: number
}

type DesktopType = {
    windows: Window[]
}

export const MAX_SIZE: number = 4

export default {
    name: 'desktop-manager',
    data: () => ({
        desktops: [{ windows: [{ title: 'placeholder', color: '#fff', size: 4 }] }],
        currentWindow: null,
        currentDesktopIndex: 0
    }),
    methods: {
        gotoDesktop(index: number): void {
            if (this.$el && this.$el.style)
                this.$el.style.transform = `translateX(${-100 * index}vw)`
        },
        gotoLastDesktop(): void {
            if (this.currentDesktopIndex > 0)
                this.gotoDesktop(--this.currentDesktopIndex)
        },
        gotoNextDesktop(): void {
            if (this.currentDesktopIndex < this.desktops.length - 1)
                this.gotoDesktop(++this.currentDesktopIndex)
        },
        addDesktop(desktop: DesktopType): void {
            this.desktops.push(desktop)
            this.$el.style.width = `${this.desktops.length * 100}vw`
            this.gotoDesktop(++this.currentDesktopIndex)
        },
        handleNewWindow({ name, content, color }): void {
            this.currentWindow = { title: name, content, color }
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
        translateCurrentWindow(translateWidth: number, callback: () => void) {
            afterTransition(this.$refs.currentWindow.$el, () => {
                callback && callback()
                this.$refs.currentWindow.$el.style.transition = 'none'
                this.currentWindow = null
            })
            this.$refs.currentWindow.$el.style.transition = 'width 0.3s ease'
            this.$refs.currentWindow.$el.style.width = `${translateWidth}px`
        },
        setCurrentWindowSize(windows: WindowType[], size: number) {
            switch (windows.length) {
                case 1:
                    windows[0].size = MAX_SIZE - size
                    break
                case 2:
                    if (size === 1) {
                        if (windows[0].size === 3)
                            windows[0].size = 2
                        else if (windows[1].size === 3)
                            windows[1].size = 2
                    } else if (size === 2) {
                        windows[0].size = 1
                        windows[1].size = 1
                        this.currentWindow.size = 1
                    }
                    break
                case 3:
                    windows.forEach(window => window.size = 1)
                    break
                default:
                    break
            }
        },
        createNewDesktopToFitWindow() {
            this.currentWindow.size = MAX_SIZE
            this.addDesktop({ windows: [this.currentWindow] })
        },
        handleMovingWindowEnd(size: number): void {
            if (!size) {
                this.translateCurrentWindow(0)
                return
            }

            const { windows } = this.desktops[this.currentDesktopIndex]

            this.currentWindow.size = size
            if (windows.length === 0 || windows.length + size > MAX_SIZE) {
                // create a new window
                this.createNewDesktopToFitWindow()
                this.translateCurrentWindow(this.currentWindow.size / MAX_SIZE * window.innerWidth)
            } else {
                this.setCurrentWindowSize(windows, size)
                this.translateCurrentWindow(this.currentWindow.size / MAX_SIZE * window.innerWidth, () => windows.push(this.currentWindow))
            }
        }
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
        isFirstDesktop() {
            return this.currentDesktopIndex === 0
        },
        isLastDesktop() {
            return this.currentDesktopIndex === this.desktops.length - 1
        }
    },
    render() {
        const {
            desktops,
            windowLabels,
            currentDesktopIndex,
            currentWindow,
            handleNewWindow,
            handleMovingWindow,
            handleMovingWindowEnd,
            gotoLastDesktop,
            gotoNextDesktop,
            isFirstDesktop,
            isLastDesktop
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
            <div class={styles.fixedUI} style={{ transform: `translateX(${currentDesktopIndex * 100}%)` }}>
                <WindowLabelList labels={windowLabels}
                                 onNewWindow={handleNewWindow}
                                 onMovingWindow={handleMovingWindow}
                                 onMovingWindowEnd={handleMovingWindowEnd}/>
                {!isFirstDesktop && <Hideable class={styles.toLeftButton} hideFunction={leftButtonHide}>
                    <FloatButton mini secondary
                                 icon="keyboard_arrow_left"
                                 onClick={gotoLastDesktop}/></Hideable>}
                {!isLastDesktop && <Hideable class={styles.toRightButton} hideFunction={rightButtonHide}>
                    <FloatButton mini secondary
                                 icon="keyboard_arrow_right"
                                 onClick={gotoNextDesktop}/></Hideable>}
            </div>
        </div>
    }
}

function leftButtonHide(style) {
    style.transform = 'translateX(-50px)'
}

function rightButtonHide(style) {
    style.transform = 'translateX(50px)'
}
