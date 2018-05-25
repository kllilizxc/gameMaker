import IconButton from '@/ui/material-icon-button'
import TreeView from '@/components/tree-view'
import Popover from '@/ui/pop-over'
import Menu from '@/ui/menu'
import MenuItem from '@/ui/menu-item'
import { mapGetters } from 'vuex'
import { GROUP_TYPE } from '../script-field'
import styles from './style.css'

const INIT_BIG_NUMBER_LENGTH = 100
const INIT_SMALL_NUMBER_STEPS_NUM = 5
const INIT_SMALL_NUMBER_LENGTH = INIT_BIG_NUMBER_LENGTH / INIT_SMALL_NUMBER_STEPS_NUM
const MIN_BIG_NUMBER_STEP = 1

export default {
    name: 'animation-editor',
    components: { IconButton, TreeView, Menu, MenuItem, Popover },
    data: () => ({
        duration: 40,
        smallStepsNum: INIT_SMALL_NUMBER_STEPS_NUM,
        bigNumberLength: INIT_BIG_NUMBER_LENGTH,
        bigNumberStep: MIN_BIG_NUMBER_STEP,
        keys: {},
        isRecording: false,
        isPlaying: false,
        addMenuTrigger: null,
        addMenuIsOpen: false,
        chosenFrame: -1,
        indicatorTimestamp: 0,
        showInsideLines: false,
        keyArray: []
    }),
    computed: {
        ...mapGetters(['gameObject']),
        fieldsData() {
            if (!this.gameObject) return []
            const { scripts } = this.gameObject
            return Object.keys(scripts).map(name => { // scripts
                const { fields } = scripts[name]
                const fieldsArray = fields && Object.keys(fields).map(fieldName => { // fields
                    const field = fields[fieldName]
                    if (field.type === GROUP_TYPE)
                        return {
                            name: fieldName,
                            children: Object.keys(field.children).map(childName => { // group
                                const child = field.children[childName]
                                return { name: childName, get: child.get, set: child.set }
                            })
                        }
                    else
                        return { name: fieldName, get: field.get, set: field.set }
                })
                return { name, children: fieldsArray }
            }).filter(f => f.children)
        },
        smallNumberLength() {
            return this.bigNumberLength / this.smallStepsNum
        },
        totalNumberLength() {
            return this.duration * this.smallStepsNum
        },
        scrollConstant() {
            return Math.log(this.smallNumberLength / INIT_SMALL_NUMBER_LENGTH) / Math.log(INIT_SMALL_NUMBER_STEPS_NUM)
        },
        canBeSmaller() {
            return this.bigNumberStep > MIN_BIG_NUMBER_STEP
        },
        indicatorPos() {
            return this.getPosByTimestamp(this.indicatorTimestamp)
        }
    },
    created() {
    },
    mounted() {
        this.addMenuTrigger = this.$refs.addButton.$el
        this.makeDraggable()
        this.$refs.timeline.addEventListener('wheel', this.scrollOnTimeline)
    },
    methods: {
        scrollOnTimeline(e) {
            e.preventDefault()
            e.stopPropagation()

            this.bigNumberLength = Math.max(this.bigNumberLength + Math.floor(e.deltaY / 10), INIT_SMALL_NUMBER_LENGTH)

            if (this.bigNumberLength <= INIT_BIG_NUMBER_LENGTH / 4)
                this.showInsideLines = false
            else if (this.bigNumberStep > 1 && this.bigNumberLength > INIT_BIG_NUMBER_LENGTH / 4)
                this.showInsideLines = true

            if (this.bigNumberLength === INIT_SMALL_NUMBER_LENGTH) {
                this.bigNumberLength = INIT_BIG_NUMBER_LENGTH
                this.bigNumberStep *= this.smallStepsNum
            } else if (this.canBeSmaller && this.smallNumberLength >= INIT_BIG_NUMBER_LENGTH) {
                this.bigNumberLength = INIT_BIG_NUMBER_LENGTH
                this.bigNumberStep /= this.smallStepsNum
            }
        },
        secondToTime(sec) {
            sec = Math.floor(sec)
            const minutes = Math.floor(sec / 60)
            let seconds = sec % 60
            if (seconds < 10) seconds = `0${seconds}`
            return `${minutes}:${seconds}`
        },
        toggleRecording() {
            this.isRecording = !this.isRecording
        },
        togglePlaying() {
            this.isPlaying = !this.isPlaying
        },
        openAddMenu() {
            this.addMenuIsOpen = !this.addMenuIsOpen
        },
        handleAddMenuClose() {
            this.addMenuIsOpen = false
        },
        setKeyArray() {
            this.keyArray = Object.keys(this.keys)
        },
        addKey(...names) {
            const keyName = names.join('.')
            this.addFrame(keyName, 0, this.getKeyValue(keyName))
            this.handleAddMenuClose()
        },
        getKeyValue(keyName) {
            const names = keyName.split('.')
            let keyValue = this.gameObject[names[0]].fields[names[1]]
            if (names[2]) keyValue = keyValue.children[names[2]]
            keyValue = keyValue.get()
            return keyValue
        },
        addFrame(name, timestamp, value) {
            if (!this.keys[name]) {
                this.keys[name] = {}
                this.setKeyArray()
            }
            this.keys[name][timestamp] = value
            this.$forceUpdate()
        },
        getPosByTimestamp(timestamp) {
            return timestamp / 1000 * this.bigNumberLength / this.bigNumberStep
        },
        getTimestampFromPos(pos) {
            return Math.floor(pos * this.bigNumberStep / this.bigNumberLength * 1000)
        },
        getKeyNameOfFrame(y) {
            return this.keyArray[y]
        },
        frameIsChosen(timestamp) {
            return this.chosenFrame === timestamp
        },
        setChosenFrame(timestamp = -1) {
            this.chosenFrame = timestamp
        },
        removeFrame(timestamp, y) {
            const keyName = this.getKeyNameOfFrame(y)
            delete this.keys[keyName][timestamp]
            this.setChosenFrame()
            this.$forceUpdate()
        },
        moveFrame(timestamp, y, newTimestamp) {
            const keyName = this.getKeyNameOfFrame(y)
            const key = this.keys[keyName]
            const value = key[timestamp]
            delete key[timestamp]
            key[newTimestamp] = value
            this.$forceUpdate()
        },
        setIndicator(timestamp) {
            this.indicatorTimestamp = timestamp
        },
        addFrameInMousePos(e) {
            const pos = this.getMousePosition(e)
            const timestamp = this.getTimestampFromPos(Math.round(pos.x / this.smallNumberLength) * this.smallNumberLength)
            const keyName = this.getKeyNameOfFrame(Math.floor(pos.y / 48))
            const keyValue = this.getKeyValue(keyName)
            this.addFrame(keyName, timestamp, keyValue)
        },
        getMousePosition(e) {
            const { svg } = this.$refs
            const CTM = svg.getScreenCTM()
            return {
                x: (e.clientX - CTM.e) / CTM.a,
                y: (e.clientY - CTM.f) / CTM.d
            }
        },
        makeDraggable() {
            const { svg } = this.$refs
            let selectedElement
            svg.addEventListener('mousedown', startDrag)
            svg.addEventListener('mousemove', drag)
            svg.addEventListener('mouseup', endDrag)
            svg.addEventListener('mouseleave', endDrag)

            const { moveFrame, getMousePosition, getTimestampFromPos, smallNumberLength, setIndicator } = this

            function startDrag(e) {
                selectedElement = e.target
                if (!selectedElement.classList.contains(styles.draggable))
                    selectedElement = null
            }

            function drag(e) {
                if (selectedElement) {
                    e.preventDefault()
                    const newX = Math.round(getMousePosition(e).x / smallNumberLength) * smallNumberLength
                    const newTimestamp = getTimestampFromPos(newX)
                    const { timestamp, y } = selectedElement.dataset
                    if (timestamp !== newTimestamp) {
                        if (selectedElement.classList.contains(styles.indicator))
                            setIndicator(newTimestamp)
                        else
                            moveFrame(timestamp, +y, newTimestamp)
                    }
                }
            }

            function endDrag() {
                selectedElement = null
            }
        }
    }
}

