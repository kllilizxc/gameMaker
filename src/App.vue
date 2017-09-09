<template>
    <div id="app">
        <desktop-manager/>
    </div>
</template>

<script>
    import Scene from '@/components/scene'
    import UiLayer from '@/components/ui-layer'
    import DesktopManager from '@/components/desktop-manager'

    export default {
        name: 'app',
        components: { Scene, UiLayer, DesktopManager }
    }
</script>

<style src="./style.css"></style>
