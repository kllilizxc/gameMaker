<template>
    <div class="ui-layer">
        <mu-appbar title="gameMaker"></mu-appbar>
        <dock :leftTools="bottomTools.left" :rightTools="bottomTools.right"/>
        <hello/>
        <window-label/>
    </div>
</template>
<script>
    import Hello from '@/components/hello'
    import Dock from '@/components/dock'
    import windowLabel from 'Components/window-label'

    export default {
        name: 'ui-layer',
        components: { Hello, Dock, windowLabel },
        data: () => ({}),
        computed: {
            bottomTools () {
                return {
                    left: [
                        { icon: 'face' },
                        { icon: 'favorite' },
                        { icon: 'delete' },
                        { icon: 'polymer' }
                    ],
                    right: [
                        { icon: 'power' },
                        { icon: 'fingerprint' }
                    ]
                }
            }
        }
    }
</script>
