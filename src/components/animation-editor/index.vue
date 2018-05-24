<template>
    <div :class="$style.animationEditor">
        <div :class="$style.leftPanel">
            <div :class="$style.toolBar">
                <IconButton icon='fiber_manual_record' size="24"
                            :class="[$style.toolIcon, { [$style.recording]: isRecording }]"
                            @click="toggleRecording"/>
                <IconButton :icon="isPlaying ? 'pause' : 'play_arrow'" size="24" :class="$style.toolIcon"
                            @click="togglePlaying"/>
                <IconButton icon="add" size="24" :class="$style.toolIcon"
                            @click="openAddMenu" ref="addButton"/>
                <Popover :trigger="addMenuTrigger" :open="addMenuIsOpen" :close="handleAddMenuClose">
                    <Menu v-if="fieldsData.length > 0">
                        <MenuItem v-for="script in fieldsData" :title="script.name" :key="script.name" rightIcon="keyboard_arrow_right">
                            <MenuItem v-for="field in script.children" :title="field.name" :key="field.name"
                                      @click="() => !field.children && addKey(script.name, field.name)" :rightIcon="field.children && 'keyboard_arrow_right'">
                                <MenuItem v-for="child in field.children" :title="child.name" :key="child.name"
                                          @click="() => addKey(script.name, field.name, child.name)"/>
                            </MenuItem>
                        </MenuItem>
                    </Menu>
                    <div v-else :class="$style.hint">Empty</div>
                </Popover>
            </div>
            <div :class="$style.fields">
                <div :class="$style.fieldItem" v-for="keyName in keyArray">{{keyName}}</div>
            </div>
        </div>
        <div :class="$style.rightPanel">
            <div :class="$style.timeline">
                <svg>
                    <g v-for="i in duration" :transform="`translate(${i * bigNumberLength}, 0)`" :key="i">
                        <line :class="$style.bigLine" x1="0" y1="0" x2="0" y2="20"/>
                        <text transform="translate(0, 40)">{{i}}</text>
                        <g :transform="`translate(${-bigNumberLength}, 0)`">
                            <line :class="$style.bigLine" v-for="j in 1/interval-1" :key="j"
                                  x1="0" y1="0" x2="0" y2="10"
                                  :transform="`translate(${j * smallNumberLength}, 0)`"/>
                        </g>
                    </g>
                    <g>
                        <line ref="indicator" :x1="chosenX * smallNumberLength" :x2="chosenX * smallNumberLength"
                              y1="0" y2="48" :class="[$style.setFrame, $style.indicator]"/>
                    </g>
                </svg>
            </div>
            <div :class="$style.keyContainer">
                <svg ref="svg">
                    <g>
                        <line v-for="i in totalNumberLength"
                              :key="i"
                              :class="$style.hintLine"
                              x1="0" x2="0" y1="0" :y2="1000"
                              :transform="`translate(${i * smallNumberLength}, 0)`"/>
                    </g>
                    <g>
                        <line v-for="j in keyArray.length"
                              :key="j"
                              :class="$style.hintLine"
                              x1="0" :x2="totalNumberLength * smallNumberLength" y1="0" y2="0"
                              :transform="`translate(0, ${j * 48})`"/>
                    </g>
                    <g>
                        <g v-for="x in totalNumberLength">
                            <rect :class="[$style.frameRect, { [$style.setFrame]: frameIsSet(x, y), [$style.chosenFrame]: frameIsChosen(x, y) }]"
                                  height="10" width="10" v-for="y in keyArray.length" :data-x="x" :data-y="y"
                                  @click="() => setOrChoseFrame(x, y)" @dblclick="() => removeFrame(x, y)"
                                  :transform="`translate(${x * smallNumberLength}, ${(y - .5) * 48 - 5}) rotate(45)`"/>
                        </g>
                    </g>
                    <g>
                        <line ref="indicator" :x1="chosenX * smallNumberLength" :x2="chosenX * smallNumberLength"
                              y1="0" y2="1000" :class="[$style.setFrame, $style.indicator]"/>
                    </g>
                </svg>
            </div>
        </div>
    </div>
</template>
<script src="./script.js"></script>
<style module src="./style.css"></style>
