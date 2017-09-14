<template>
    <div id="app">
        <desktop-manager ref="desktopManager"/>
    </div>
</template>

<script>
    import DesktopManager from '@/components/desktop-manager'

    export default {
        name: 'app',
        components: { DesktopManager }
    }
</script>

<style src="./style.css"></style>
