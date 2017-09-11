<template>
    <div :class="$style.uiLayer">
        <dock :leftTools="bottomTools.left" :rightTools="bottomTools.right"/>
    </div>
</template>
<script>
    import Dock from '@/components/dock'
    import WindowLabelList from '@/components/window-label-list'
    import DesktopManager from '@/components/desktop-manager'

    export default {
        name: 'ui-layer',
        components: { Dock, WindowLabelList, DesktopManager },
        data: () => ({}),
        computed: {
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
