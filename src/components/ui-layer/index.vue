<template>
    <div class="ui-layer">
        <mu-appbar title="gameMaker"></mu-appbar>
        <dock/>
        <hello/>
    </div>
</template>
<script>
    import Hello from '@/components/hello'
    import Dock from '@/components/dock'

    export default {
        name: 'ui-layer',
        components: { Hello, Dock }
    }
</script>
