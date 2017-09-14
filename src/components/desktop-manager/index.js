// @flow
import styles from './style.css'
import Desktop from '@/components/desktop'
import Window from '@/components/window'
import FloatButton from '@/ui/float-button'
import Hideable from '@/ui/hideable'
import WindowLabel from 'Components/window-label'
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
        currentWindowIndex: 0,
        currentWindow: null,
        windowLabels: [
            { icon: 'dashboard', title: 'dashboard', color: '#EF9A9A' },
            { icon: 'face', title: 'face', color: '#9FA8DA' },
            { icon: 'favorite', title: 'favorite', color: '#80DEEA' },
            { icon: 'delete', title: 'delete', color: '#80CBC4' },
            { icon: 'polymer', title: 'polymer', color: '#E6EE9C' }
        ]
    }),
    watch: {
        currentDesktopIndex(index) {
            if (this.$el && this.$el.style)
                this.$el.style.transform = `translateX(${-100 * index}vw)`
        }
    },
    methods: {
        gotoLastDesktop(): void {
            if (this.currentDesktopIndex > 0)
                --this.currentDesktopIndex
        },
        gotoNextDesktop(): void {
            if (this.currentDesktopIndex < this.desktops.length - 1)
                ++this.currentDesktopIndex
        },
        addDesktop(desktop: DesktopType): void {
            this.desktops.push(desktop)
            this.$el.style.width = `${this.desktops.length * 100}vw`
            this.gotoNextDesktop()
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
            const style = currentWindowRef.$el.style
            afterTransition(currentWindowRef.$el, () => {
                style.transition = 'none'
                callback && callback()
            })
            style.transition = 'width 0.3s ease'
            style.width = `${translateWidth}px`
        },
        setCurrentWindowSize(windows: WindowType[], size: number) {
            switch (windows.length) {
            case 2:
                windows[0].size = MAX_SIZE - size
                break
            case 3:
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
            case 4:
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
            this.currentWindowIndex = 0
            this.addDesktop({ windows: [currentWindow] })
        },
        handleNewWindow({ title, content, color, icon }): void {
            const currentDesktop = this.createDesktopIfShould()
            this.currentWindowIndex = currentDesktop.windows.length
            this.currentWindow = { title, content, color, icon, size: 0 }
            currentDesktop.windows.push(this.currentWindow)
        },
        handleDraggingNewWindow(name) {
            this.currentWindowIndex = this.currentDesktop.windows.findIndex(window => window.title === name)
            if (this.currentWindowIndex < 0) return
            this.currentWindow = this.currentDesktop.windows[this.currentWindowIndex]
            const { size } = this.currentWindow
            this.currentWindow.size = 0
            console.log(size, window.innerWidth, window.innerWidth * size / MAX_SIZE)
            // this.currentWindowRef.$el.style.width = `${window.innerWidth * size / MAX_SIZE}px`
        },
        handleMovingWindow(deltaX: number): void {
            console.log(deltaX)
            if (this.currentWindowIndex < 0) return
            this.currentWindowRef.$el.style.width = `${Math.abs(deltaX)}px`
        },
        handleDraggingWindowEnd(size: number): void {
            console.log(size)
            if (!size) {
                this.translateCurrentWindow(0, () => {
                    const { icon, title, color } = this.currentWindow
                    this.windowLabels.push({ icon, title, color })
                    this.currentDesktop.windows.pop()
                })
            }
        },
        handleMovingWindowEnd(size: number): void {
            if (!this.currentWindow) return
            if (!size) {
                this.translateCurrentWindow(0, () => this.currentDesktop.windows.pop())
                return
            }

            const { windows } = this.desktops[this.currentDesktopIndex]

            if (size > MAX_SIZE) size = MAX_SIZE
            else if (size < -MAX_SIZE) size = -MAX_SIZE
            this.currentWindow.size += size
            if (this.currentWindow.size < 0) this.currentWindow.size = 0
            this.windowLabels.splice(this.windowLabels.findIndex(label => label.title === this.currentWindow.title), 1)
            if (windows.length === 0 || windows.length + this.currentWindow.size > MAX_SIZE) {
                // create a new window
                this.createNewDesktopToFitWindow()
                this.translateCurrentWindow(this.currentWindow.size / MAX_SIZE * window.innerWidth)
            } else {
                this.setCurrentWindowSize(windows, this.currentWindow.size)
                this.translateCurrentWindow(this.currentWindow.size / MAX_SIZE * window.innerWidth)
            }
        }
    },
    computed: {
        isFirstDesktop() {
            return this.currentDesktopIndex === 0
        },
        isLastDesktop() {
            return this.currentDesktopIndex === this.desktops.length - 1
        },
        currentDesktop() {
            return this.desktops[this.currentDesktopIndex]
        },
        currentWindowRef() {
            let totalWindowIndex = 0
            for (let i = 0; i < this.desktops.length; ++i)
                if (i < this.currentDesktopIndex)
                    totalWindowIndex += this.desktops[i].windows.length
                else
                    break

            return this.$refs.windows[totalWindowIndex + this.currentWindowIndex]
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
            handleDraggingNewWindow,
            handleDraggingWindowEnd,
            gotoLastDesktop,
            gotoNextDesktop,
            isFirstDesktop,
            isLastDesktop
        } = this

        return <div class={styles.desktopManager}>
            {desktops && desktops.map((desktop, index) => <Desktop>
                {desktop.windows && desktop.windows.map(window =>
                    <Window ref="windows"
                            refInFor={true}
                            title={window.title}
                            key={window.title}
                            color={window.color}
                            onMovingWindow={handleMovingWindow}
                            onMovingWindowEnd={handleMovingWindowEnd}
                            onStartDraggingWindow={handleDraggingNewWindow}
                            onDraggingWindowEnd={handleDraggingWindowEnd}
                            style={window.size && { flex: window.size }}>{window.content}</Window>)}
            </Desktop>)}
            <div class={styles.fixedUI} style={{ transform: `translateX(${currentDesktopIndex * 100}vw)` }}>
                <div class={styles.windowLabelList}>
                    {windowLabels.map(label => <WindowLabel icon={label.icon}
                                                            title={label.title}
                                                            color={label.color}
                                                            key={label.title}
                                                            onNewWindow={handleNewWindow}
                                                            onMovingWindow={handleMovingWindow}
                                                            onMovingWindowEnd={handleMovingWindowEnd}/>)}
                </div>
                {!isFirstDesktop && <Hideable class={styles.toLeftButton} hideFunction={leftButtonHide}>
                    <FloatButton mini
                                 icon="keyboard_arrow_left"
                                 onClick={gotoLastDesktop}/></Hideable>}
                {!isLastDesktop && <Hideable class={styles.toRightButton} hideFunction={rightButtonHide}>
                    <FloatButton mini
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
