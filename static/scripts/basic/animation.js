let clips = []
fields = {
    clips: {
        type: 'ARRAY',
        child: {
            type: 'FILE',
            get: index => clips[index],
            set: (val, index) => {
                if (val === undefined) return
                clips[index] = clips[index] || {}
                const clip = clips[index]
                clip.name = val.name
                try {
                    clip.keys = JSON.parse(val.data)
                } catch (e) { console.log(e) }
            }
        }
    }
}

function init() {
}

let initDatesMap = {} // { clipName: { timestamp, loop } }
function update() {
    const date = Date.now()
    Object.keys(initDatesMap).forEach(clipName => {
        const clip = clips.find(clip => clip.name === clipName)
        if (!clip) return
        const { timestamp, loop } = initDatesMap[clipName]
        const isEnd = play(clip, date - timestamp)
        console.log(isEnd, loop, initDatesMap)
        if (!loop && isEnd)
            delete initDatesMap[clipName]
        if (loop && isEnd)
            initDatesMap[clipName].timestamp += date - timestamp
    })
}

actions = {
    getAnimationClips: () => clips,
    play(clipName, loop = false) {
        initDatesMap[clipName] = {
            timestamp: Date.now(),
            loop
        }
    },
    stop(clipName) {
        delete initDatesMap[clipName]
    }
}

function play(clip, timestamp) {
    let exitCode = 0
    Object.keys(clip.keys).forEach(keyName => {
        const key = clip.keys[keyName]
        if (!key) return
        const frameArray = Object.keys(key)
            .map(timestamp => ({ timestamp, value: key[timestamp] }))
            .sort((a, b) => a.timestamp - b.timestamp)
        const index = frameArray.findIndex(frame => frame.timestamp >= timestamp)
        let keyValue
        if (index === -1) {
            // no more keyFrames in the right
            keyValue = frameArray[frameArray.length - 1].value
            exitCode = 1
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
        setFieldValue(keyName, keyValue)
    })
    return exitCode
}

const setFieldValue = (fieldName, keyValue) => {
    const names = fieldName.split('.')
    let field = this[names[0]].fields[names[1]]
    if (names[2]) field = field.children[names[2]]
    field && field.set(keyValue)
}
