<template>
    <div class="scene">
    </div>
</template>
<script>
    export default {
        name: 'scene'
    }
</script>
<style scoped>
    .scene {
        position: fixed;
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        background: -moz-radial-gradient(center, ellipse cover, #ffffff 0%, #edf1f2 80%, #e3edec 100%);
        background: -webkit-radial-gradient(center, ellipse cover, #ffffff 0%,#edf1f2 80%,#e3edec 100%);
        background: radial-gradient(ellipse at center, #ffffff 0%,#edf1f2 80%,#e3edec 100%);
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#e3edec',GradientType=1 );
    }
</style>
