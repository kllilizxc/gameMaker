let speed = 0.001

this.fields = [
    {
        type: 'NUMBER_TYPE',
        get: () => speed,
        set: val => speed = val,
        options: { label: 'speed', name: 'speed' }
    }
]

this.update = () => {
    console.log('update', speed)
    gameObject.rotation.x += speed
}
