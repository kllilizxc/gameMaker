// @flow
export default {
    name: 'icon',
    functional: true,
    render(h, { props: { icon, size, className } }) {
        return icon.id ? <svg class={className} fill="currentColor" width={size} height={size}>
                <use xlinkHref={`#${icon.id}`}/>
            </svg>
            : <mu-icon class={className} value={icon} color="currentColor" size={size}/>
    }
}
