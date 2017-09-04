<template>
    <div id="app">
        <scene/>
        <ui-layer/>
    </div>
</template>

<script>
    import Scene from '@/components/scene'
    import UiLayer from '@/components/ui-layer'

    export default {
        name: 'app',
        components: { Scene, UiLayer }
    }
</script>

<style src="./style.css"></style>
