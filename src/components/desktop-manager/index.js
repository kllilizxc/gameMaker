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
        currentDesktopIndex: 0,
        currentWindowIndex: 0
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
            const index = this.currentDesktop.windows.findIndex(window => window.name === name)
            if (index === -1) { // new window
                const currentDesktop = this.createDesktopIfShould()
                this.currentWindowIndex = currentDesktop.windows.length
                currentDesktop.windows.push({ title: name, content, color, size: 0 })
            } else { // existing window
                this.currentWindowIndex = index
            }
        },
        handleMovingWindow(deltaX: number): void {
            this.currentWindow.size = 0
            if (this.currentWindowRef)
                this.currentWindowRef.$el.style.width = `${Math.abs(deltaX)}px`
        },
        createDesktopIfShould(): DesktopType {
            let { currentDesktop } = this
            if (!currentDesktop) {
                currentDesktop = this.desktops[this.currentDesktopIndex] = { windows: [] }
            }
            return currentDesktop
        },
        translateCurrentWindow(translateWidth: number, callback: () => void) {
            const { currentWindowRef } = this
            afterTransition(currentWindowRef.$el, () => {
                currentWindowRef.$el.style.transition = 'none'
                this.currentWindowIndex = -1
                callback && callback()
            })
            currentWindowRef.$el.style.transition = 'width 0.3s ease'
            currentWindowRef.$el.style.width = `${translateWidth}px`
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
            const { currentWindow } = this
            currentWindow.size = MAX_SIZE
            this.currentDesktop.windows.pop()
            this.addDesktop({ windows: [currentWindow] })
        },
        handleMovingWindowEnd(size: number): void {
            if (!this.currentWindow) return
            if (!size) {
                this.translateCurrentWindow(0, () => this.currentDesktop.windows.pop())
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
                this.translateCurrentWindow(this.currentWindow.size / MAX_SIZE * window.innerWidth)
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
        },
        currentDesktop() {
            return this.desktops[this.currentDesktopIndex]
        },
        currentWindow() {
            return this.currentDesktop.windows[this.currentWindowIndex]
        },
        currentWindowRef() {
            return this.$refs[`windows${this.currentWindowIndex}`]
        }
    },
    render() {
        const {
            desktops,
            windowLabels,
            currentDesktopIndex,
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
                {desktop.windows && desktop.windows.map((window, index) =>
                    <Window ref={`windows${index}`}
                            title={window.title}
                            key={window.title}
                            color={window.color}
                            onNewWindow={handleNewWindow}
                            onMovingWindow={handleMovingWindow}
                            onMovingWindowEnd={handleMovingWindowEnd}
                            style={window.size && { flex: window.size }}>{window.content}</Window>)}
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
