<template>
    <div id="app">
        <desktop-manager ref="desktopManager"/>
        <!--<FixedUI @gotoLastDesktop="handleGotoLastDesktop"-->
                  <!--@gotoNextDesktop="handleGotoNextDesktop"/>-->
    </div>
</template>

<script>
    import Scene from '@/components/scene'
    import UiLayer from '@/components/ui-layer'
    import FixedUI from '@/components/fixed-ui'
    import DesktopManager from '@/components/desktop-manager'

    export default {
        name: 'app',
        components: { Scene, UiLayer, DesktopManager, FixedUI },
        methods: {
            handleGotoLastDesktop() {
                this.$refs.desktopManager.gotoLastDesktop()
            },
            handleGotoNextDesktop() {
                this.$refs.desktopManager.gotoNextDesktop()
            }
        }
    }
</script>

<style src="./style.css"></style>
