let arrays = []
fields = {
    array: {
        type: 'ARRAY',
        child: {
            type: 'NUMBER',
            get: index => arrays[index],
            set: (val, index) => arrays[index] = val
        }
    }
}
function init() {
    console.log(arrays)
}

function click(e) {
    console.log(e)
}
