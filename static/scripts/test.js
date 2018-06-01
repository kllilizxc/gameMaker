let arrays = []
fields = {
}
console.log(this)
function init() {
    this.animation.play('newAnimation1', true)
}

function pointerdown(e) {
    this.animation.play('newAnimation')
}
