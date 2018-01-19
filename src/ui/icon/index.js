// @flow
export default {
    name: 'icon',
    functional: true,
    render(h, { props: { icon, size, className, data } }) {
        return icon.id ? <svg class={className} {...data} fill="currentColor" width={size} height={size}>
                <use xlinkHref={`#${icon.id}`}/>
            </svg>
            : <mu-icon class={className} {...data} value={icon} color="currentColor" size={size}/>
    }
}
