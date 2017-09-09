<template>
    <div :class="$style.uiLayer">
        <desktop-manager/>
        <hello/>
        <dock :leftTools="bottomTools.left" :rightTools="bottomTools.right"/>
        <window-label-list :labels="windowLabels"/>
    </div>
</template>
<script>
    import Hello from '@/components/hello'
    import Dock from '@/components/dock'
    import WindowLabelList from '@/components/window-label-list'
    import DesktopManager from '@/components/desktop-manager'

    export default {
        name: 'ui-layer',
        components: { Hello, Dock, WindowLabelList, DesktopManager },
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
<style module>
    .uiLayer {
        width: 100%;
        height: 100%;
    }
</style>
