export default {
    name: 'content-block',
    functional: true,
    render(h, { props: { title } }) {
        return <div>
            { title && <mu-sub-header>{title}</mu-sub-header>}
            <mu-content-block>
                <slot/>
            </mu-content-block>
        </div>
    }
}
