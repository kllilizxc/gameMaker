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
                <IconButton icon="insert_drive_file" size="24" :class="$style.toolIcon" @click="createAnimation"/>
                <Popover :trigger="addMenuTrigger" :open="addMenuIsOpen" :close="handleAddMenuClose">
                    <Menu v-if="fieldsData.length > 0">
                        <MenuItem v-for="script in fieldsData" :title="script.name" :key="script.name"
                                  rightIcon="keyboard_arrow_right">
                            <MenuItem v-for="field in script.children" :title="field.name" :key="field.name"
                                      @click="() => !field.children && addKey(script.name, field.name)"
                                      :rightIcon="field.children && 'keyboard_arrow_right'">
                                <MenuItem v-for="child in field.children" :title="child.name" :key="child.name"
                                          @click="() => addKey(script.name, field.name, child.name)"/>
                            </MenuItem>
                        </MenuItem>
                    </Menu>
                    <div v-else :class="$style.hint">Empty</div>
                </Popover>
            </div>
            <div :class="$style.fields">
                <div :class="$style.fieldItem" v-for="keyName in keyArray" :key="keyName">{{keyName}}</div>
            </div>
        </div>
        <div :class="$style.rightPanel">
            <div :class="$style.timeline" ref="timeline">
                <svg>
                    <g v-for="i in duration" :transform="`translate(${i * bigNumberLength}, 0)`" :key="i">
                        <line :class="$style.bigLine"
                              x1="0" x2="0" y1="0" :y2="18 + scrollConstant * 6"
                              :style="{opacity: 0.75 + scrollConstant * 0.25}"/>
                        <text :class="$style.numberText"
                              transform="translate(-14, 40)">
                            {{secondToTime(i * bigNumberStep)}}
                        </text>
                        <g v-for="j in smallStepsNum" :key="j"
                           :transform="`translate(${j * smallNumberLength - bigNumberLength}, 0)`">
                            <line :class="$style.bigLine"
                                  v-if="j % smallStepsNum"
                                  x1="0" x2="0" y1="0" :y2="12 + scrollConstant * 6"
                                  :style="{opacity: 0.5 + scrollConstant * 0.25}"/>
                            <text :class="$style.numberText"
                                  v-if="canBeSmaller && scrollConstant > 0.5 && j % smallStepsNum"
                                  transform="translate(-14, 40)">
                                {{secondToTime((i - 1 + j / smallStepsNum) * bigNumberStep)}}
                            </text>
                        </g>
                    </g>
                </svg>
            </div>
            <div :class="$style.keyContainer">
                <svg ref="svg" @dblclick="addFrameInMousePos">
                    <g>
                        <g v-for="i in totalNumberLength" :key="i"
                           :transform="`translate(${i * smallNumberLength}, 0)`">
                            <line :class="$style.hintLine"
                                  x1="0" x2="0" y1="0" :y2="1000"/>
                        </g>
                    </g>
                    <g>
                        <line v-for="j in keyArray.length"
                              :key="j"
                              :class="$style.hintLine"
                              x1="0" :x2="totalNumberLength * smallNumberLength" y1="0" y2="0"
                              :transform="`translate(0, ${j * 48})`"/>
                    </g>
                    <g>
                        <g v-for="(propertyName, y) in keyArray" :key="propertyName">
                            <rect :class="[$style.frameRect, $style.draggable, { [$style.chosenFrame]: frameIsChosen(timestamp) }]"
                                  v-for="timestamp in Object.keys(keys[propertyName])" :key="timestamp"
                                  height="10" width="10" :data-timestamp="timestamp" :data-y="y"
                                  @click="() => setChosenFrame(timestamp)" @dblclick="() => removeFrame(timestamp, y)"
                                  :transform="`translate(${getPosByTimestamp(timestamp)}, ${(y + .5) * 48 - 5}) rotate(45)`"/>
                        </g>
                    </g>
                    <g>
                        <line ref="indicator" :x1="indicatorPos" :x2="indicatorPos"
                              y1="0" y2="1000" :class="[$style.indicator, $style.draggable]"/>
                    </g>
                </svg>
            </div>
        </div>
    </div>
</template>
<script src="./script.js"></script>
<style module src="./style.css"></style>
