<template>
    <div class="ui-layer">
        <dock :leftTools="bottomTools.left" :rightTools="bottomTools.right"/>
        <hello/>
        <window-label-list :labels="windowLabels"/>
    </div>
</template>
<script>
    import Hello from '@/components/hello'
    import Dock from '@/components/dock'
    import windowLabelList from 'Components/window-label-list'

    export default {
        name: 'ui-layer',
        components: { Hello, Dock, windowLabelList },
        data: () => ({}),
        computed: {
            windowLabels() {
                return [
                    { icon: 'dashboard', name: 'dashboard' },
                    { icon: 'face', name: 'face' },
                    { icon: 'favorite', name: 'favorite' },
                    { icon: 'delete', name: 'delete' },
                    { icon: 'polymer', name: 'polymer' }
                ]
            },
            bottomTools() {
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
