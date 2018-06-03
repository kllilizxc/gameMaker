import IconButton from '@/ui/material-icon-button'
import TreeView from '@/components/tree-view'
import Popover from '@/ui/pop-over'
import Menu from '@/ui/menu'
import MenuItem from '@/ui/menu-item'
import { mapGetters } from 'vuex'
import { GROUP_TYPE } from '../script-field'
import styles from './style.css'
import UndoableAction from '../../classes/undoableAction'
import { trimFilenameExtension } from '../../common/util'

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
        isRecording: false,
        isPlaying: false,
        addMenuTrigger: null,
        addMenuIsOpen: false,
        chosenFrame: { timestamp: -1, y: -1 },
        keys: {},
        indicatorTimestamp: 0,
        showInsideLines: false,
        keyArray: [],
        t: null
    }),
    watch: {
        currentFile: {
            handler: 'readKeysFromFile',
            immediate: true
        },
        currentFileUpdated() { this.readKeysFromFile() }
    },
    computed: {
        ...mapGetters(['gameObject', 'currentFile', 'currentFileUpdated', 'assets', 'game']),
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
                return { name: trimFilenameExtension(name), children: fieldsArray }
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
    mounted() {
        this.addMenuTrigger = this.$refs.addButton.$el
        this.makeDraggable()
        this.$refs.timeline.addEventListener('wheel', this.scrollOnTimeline)
        this.game.onSetScript = ({ scriptName, groupName, fieldName, value }) => {
            if (!this.isRecording) return
            scriptName = trimFilenameExtension(scriptName)
            const name = this.addKey(scriptName, groupName, fieldName)
            this.keys[name][this.indicatorTimestamp] = value
            this.writeKeysToFile()
        }
    },
    methods: {
        readKeysFromFile() {
            const { game, currentFile } = this
            if (!currentFile) return
            const isAnim = this.assets.animations.find(name => name === currentFile)
            let keys = this.keys
            try {
                if (isAnim) keys = JSON.parse(game.filesMap[currentFile])
            } catch (e) {
                return
            }
            this.keys = keys
            this.setKeyArray()
        },
        writeKeysToFile() {
            const { currentFile } = this
            if (!currentFile) return
            this.$store.dispatch('setFileValue', { name: currentFile, content: JSON.stringify(this.keys, null, '\t') })
            this.$forceUpdate()
        },
        createAnimation() {
            const animName = 'newAnimation'
            UndoableAction.addAction(new UndoableAction(
                animName,
                {
                    name: animName,
                    category: 'animations',
                    data: '{\n}'
                },
                val => {
                    if (val.name) this.$store.dispatch('createAsset', val)
                    else this.$store.dispatch('removeAsset', animName)
                }))
        },
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
            if (!this.gameObject) return
            if (this.isPlaying) {
                const initDate = Date.now()
                const setData = () => {
                    const date = Date.now()
                    this.setIndicator(date - initDate)
                    this.t = requestAnimationFrame(setData)
                }
                setData()
            } else {
                cancelAnimationFrame(this.t)
                this.setIndicator(0)
                this.t = null
            }
        },
        play(timestamp) {
            this.keyArray.forEach(keyName => {
                const key = this.keys[keyName]
                const frameArray = Object.keys(key)
                    .map(timestamp => ({ timestamp, value: key[timestamp] }))
                    .sort((a, b) => a.timestamp - b.timestamp)
                const index = frameArray.findIndex(frame => frame.timestamp >= timestamp)
                let keyValue
                if (index === -1) {
                    // no more keyFrames in the right
                    keyValue = frameArray[frameArray.length - 1].value
                } else if (index === 0) {
                    // no more keyFrames in the left
                    keyValue = frameArray[0].value
                } else {
                    // between 2 keyFrames
                    const leftKey = frameArray[index - 1]
                    const rightKey = frameArray[index]
                    // intersect between 2 values
                    keyValue = (timestamp - leftKey.timestamp) / (rightKey.timestamp - leftKey.timestamp) * (rightKey.value - leftKey.value) + leftKey.value
                }
                this.setFieldValue(keyName, keyValue)
            })
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
            const fieldName = names.filter(n => n).join('.')
            if (!this.keys[fieldName])
                this.addFrame(fieldName, 0, this.getFieldValue(fieldName))
            this.handleAddMenuClose()
            return fieldName
        },
        getField(fieldName) {
            const names = fieldName.split('.')
            let field = this.gameObject[names[0]].fields[names[1]]
            if (names[2]) field = field.children[names[2]]
            return field
        },
        getFieldValue(fieldName) {
            const field = this.getField(fieldName)
            return field && field.get()
        },
        addFrame(name, timestamp, value) {
            if (!this.keys[name]) {
                this.keys[name] = {}
                this.setKeyArray()
            }
            this.keys[name][timestamp] = value
            this.writeKeysToFile()
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
        frameIsChosen(timestamp, y) {
            return this.chosenFrame.timestamp === timestamp && this.chosenFrame.y === y
        },
        setChosenFrame(timestamp = -1, y: -1) {
            this.chosenFrame = { timestamp, y }
        },
        removeFrame(timestamp, y) {
            const keyName = this.getKeyNameOfFrame(y)
            delete this.keys[keyName][timestamp]
            this.setChosenFrame()
            this.writeKeysToFile()
        },
        moveFrame(timestamp, y, newTimestamp) {
            const keyName = this.getKeyNameOfFrame(y)
            const key = this.keys[keyName]
            const value = key[timestamp]
            delete key[timestamp]
            key[newTimestamp] = value
            this.writeKeysToFile()
        },
        setIndicator(timestamp) {
            this.indicatorTimestamp = timestamp
            this.play(timestamp)
        },
        setFieldValue(fieldName, value) {
            const field = this.getField(fieldName)
            field && field.set(value)
        },
        addFrameInMousePos(e) {
            const pos = this.getMousePosition(e)
            const index = Math.floor(pos.y / 48)
            if (index >= this.keyArray.length) return
            const timestamp = this.getTimestampFromPos(Math.round(pos.x / this.smallNumberLength) * this.smallNumberLength)
            const keyName = this.getKeyNameOfFrame(index)
            const keyValue = this.getFieldValue(keyName)
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
            let selectedElement, lastX
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
                    if (lastX === newX) return
                    const newTimestamp = getTimestampFromPos(newX)
                    let { timestamp, y } = selectedElement.dataset
                    timestamp = +timestamp
                    const lastTimestamp = lastX !== null ? getTimestampFromPos(lastX) : timestamp
                    if (lastTimestamp !== newTimestamp) {
                        if (selectedElement.classList.contains(styles.indicator))
                            setIndicator(newTimestamp)
                        else
                            moveFrame(lastTimestamp, +y, newTimestamp)
                    }
                    lastX = newX
                }
            }

            function endDrag() {
                selectedElement = null
                lastX = null
            }
        }
    }
}

