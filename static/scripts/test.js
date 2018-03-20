let speed = 0.001

fields = [
    {
        type: 'NUMBER_TYPE',
        get: () => speed,
        set: val => speed = val,
        options: { label: 'speed', name: 'speed' }
    }
]

update = () => {
    console.log('update', speed)
    this.rotation.x += speed
}
