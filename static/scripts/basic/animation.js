let clip
fields = {
    clip: {
        type: 'FILE',
        get: () => clip,
        set: val => {
            clip.name = val.name
            let keys = {}
            try { keys = JSON.parse(clip.data) } catch (e) { return }
            clip.keys = keys
        }
    }
}
