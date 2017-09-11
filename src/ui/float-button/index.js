export default {
    name: 'float-button',
    props: {
        icon: String,
        mini: Boolean,
        secondary: Boolean
    },
    methods: {
        handleClick(e) {
            this.$emit('click', e)
        }
    },
    render() {
        const {
            icon,
            mini,
            secondary,
            handleClick
        } = this

        return <mu-float-button mini={mini} secondary={secondary} icon={icon} onClick={handleClick}/>
    }
}
