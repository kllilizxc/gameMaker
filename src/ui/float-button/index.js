export default {
    name: 'float-button',
    props: {
        icon: String,
        large: Boolean,
        small: Boolean,
        color: String
    },
    methods: {
        handleClick(e) {
            this.$emit('click', e)
        }
    },
    render() {
        const {
            icon,
            large,
            small,
            color,
            handleClick
        } = this

        return <mu-button fab large={large} small={small} color={color} onClick={handleClick}>
            <mu-icon value={icon}/>
        </mu-button>
    }
}
