<template>
    <div :class="$style.dock" v-on:mouseover="handleMouseOver">
        <card :class="$style.container">
            <div :class="$style.left">
                <dock-item :class="$style.leftTool" v-for="tool in leftTools" :icon="tool.icon" :key="tool.icon"/>
            </div>
            <div :class="$style.right">
                <dock-item :class="$style.rightTool" icon="eject" @click="hide"/>
                <dock-item :class="$style.rightTool" v-for="tool in rightTools" :icon="tool.icon" :key="tool.icon"/>
            </div>
        </card>
    </div>
</template>
<script src="./index.js"></script>
<style module src="./style.css"></style>
