// @flow
export default {
    name: 'icon',
    functional: true,
    render(h, { props: { icon, size } }) {
        return icon.id ? <svg fill="currentColor" width={size} height={size}>
                <use xlinkHref={`#${icon.id}`}/>
            </svg>
            : <mu-icon value={icon} color="currentColor" size={size}/>
    }
}
