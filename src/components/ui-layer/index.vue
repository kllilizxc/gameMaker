<template>
    <div class="ui-layer">
        <mu-appbar title="gameMaker"></mu-appbar>
        <hello/>
    </div>
</template>
<script>
    import Hello from '@/components/hello'

    export default {
        name: 'ui-layer',
        components: { Hello }
    }
</script>
