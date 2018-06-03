import { mapGetters, mapActions } from 'vuex'
import * as BABYLON from 'babylonjs'
import styles from './style.css'
import EditControl
    from 'exports-loader?org.ssatguru.babylonjs.component.EditControl!imports-loader?BABYLON=babylonjs!babylonjs-editcontrol/dist/EditControl'
import { inputEvents, debounce } from '../../common/util'
import UndoableAction from '../../classes/undoableAction'

export default {
    name: 'draw-canvas',
    data: () => ({
        pickedMesh: null,
        editControl: null,
        innerMeshes: null,
        lastEditValue: null,
        t: -1
    }),
    computed: {
        ...mapGetters(['game', 'isPlaying', 'gameObject']),
        canvas() {
            return this.$refs.canvas
        }
    },
    watch: {
        'game.scene'(scene) {
            if (!scene) return
            window.scene = scene
            const { game: { engine }, render, canvas } = this

            scene.clearColor = new BABYLON.Color4(0.41, 0.44, 0.42, 0.6)

            if (!scene.activeCamera) {
                const camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
                camera.setTarget(BABYLON.Vector3.Zero())
                camera.attachControl(canvas, true)
                scene.activeCamera = camera
            }

            // environment
            scene.ambientColor = new BABYLON.Color3(0.51, 0.51, 0.51)

            scene.collisionsEnabled = true
            scene.enablePhysics(null, new BABYLON.CannonJSPlugin())
            this.editControl && this.editControl.detach()
            scene.onPointerDown = () => {
                if (this.isPlaying) return this.callEvent('pointerdown')
                if (this.editControl && this.editControl.isPointerOver()) return
                const pickResult = scene.pick(scene.pointerX, scene.pointerY)
                let pickedGameObject = pickResult.hit && pickResult.pickedMesh && this.game.scene.getMeshByID(pickResult.pickedMesh.id)
                if (pickedGameObject) pickedGameObject = pickedGameObject.gameObject
                if (pickedGameObject) {
                    this.pickedMesh = pickResult.pickedMesh
                    this.attachEditControl(this.pickedMesh)
                    this.setGameObject(this.pickedMesh.gameObject)
                } else {
                    this.pickedMesh = null
                    this.editControl && this.editControl.hide()
                    this.setGameObject(null)
                }
            }

            engine.runRenderLoop(render)
        },
        isPlaying(val) {
            const { init, game: { scene } } = this
            this.detachEditControl()
            if (val) {
                if (this.gameObject) this.gameObject.getMesh().showBoundingBox = false
                this.canvas.focus()
                init()
                scene.registerBeforeRender(this.update)
                scene.registerAfterRender(this.lateUpdate)
            } else {
                this.restoreScene()
                scene.unregisterBeforeRender(this.update)
                scene.unregisterAfterRender(this.lateUpdate)
            }
        },
        gameObject(val, oldVal) {
            if (oldVal && val !== oldVal) {
                oldVal.mesh.showBoundingBox = false
                oldVal.callEvent('onBlur')
            }
            if (!val || val === oldVal) this.detachEditControl()
            else {
                this.attachEditControl(val.getMesh())
                val.mesh.showBoundingBox = true
                val.callEvent('onFocus')
            }
        }
    },
    methods: {
        ...mapActions(['setGameObject', 'createGameObject', 'restoreScene']),
        attachEditControl(mesh) {
            if (this.isPlaying || !(mesh.position && mesh.rotation && mesh.scaling)) {
                this.editControl && this.editControl.hide()
                return
            }
            if (!this.editControl) {
                this.editControl = new EditControl(mesh, this.game.scene.activeCamera, this.canvas, 1, true)
                this.editControl.enableTranslation()
                this.editControl.addActionStartListener(actionType => {
                    const { position, rotation, scaling } = this.gameObject.getMesh()
                    switch (actionType) {
                        case 0:
                            return this.lastEditValue = { ...position }
                        case 1:
                            return this.lastEditValue = { ...rotation }
                        case 2:
                            return this.lastEditValue = { ...scaling }
                    }
                })
                this.editControl.addActionEndListener(actionType => {
                    const { position, rotation, scaling } = this.gameObject.getMesh()
                    switch (actionType) {
                        case 0:
                            return UndoableAction.addAction(new UndoableAction(this.lastEditValue, { ...position }, val => this.setScriptValues('position', val)))
                        case 1:
                            return UndoableAction.addAction(new UndoableAction(this.lastEditValue, { ...rotation }, val => this.setScriptValues('rotation', val)))
                        case 2:
                            return UndoableAction.addAction(new UndoableAction(this.lastEditValue, { ...scaling }, val => this.setScriptValues('scaling', val)))
                    }
                })
            } else {
                this.editControl.show()
                this.editControl.switchTo(mesh)
            }
        },
        setScriptValues(type, value) {
            ['x', 'y', 'z'].forEach(field => {
                this.game.setGroupScriptValue(this.gameObject, {
                    scriptName: 'transform',
                    groupName: type,
                    fieldName: field,
                    value: value[field],
                    type: 'NUMBER'
                })
                this.gameObject.transform.fields[type].children[field].set(value[field])
            })
        },
        detachEditControl() {
            this.editControl && this.editControl.detach()
            this.editControl = null
        },
        dispose() {
            this.detachEditControl()
            this.game.scene.dispose()
        },
        enableTranslation() {
            const { editControl } = this
            if (!editControl) return
            editControl.enableTranslation()
            editControl.disableRotation()
            editControl.disableScaling()
        },
        enableRotation() {
            const { editControl } = this
            if (!editControl) return
            editControl.disableTranslation()
            editControl.enableRotation()
            editControl.disableScaling()
        },
        enableScaling() {
            const { editControl } = this
            if (!editControl) return
            editControl.disableTranslation()
            editControl.disableRotation()
            editControl.enableScaling()
        },
        createEmptyMesh(name = 'mesh') {
            return this.createGameObject({ name, scripts: ['basic/transform'] })
        },
        createSphere(name = 'sphere') {
            return this.createGameObject({ name, scripts: ['basic/transform', 'geometries/sphereGeometry'] })
        },
        createBox(name = 'box') {
            return this.createGameObject({ name, scripts: ['basic/transform', 'geometries/boxGeometry'] })
        },
        createPlane(name = 'plane') {
            return this.createGameObject({ name, scripts: ['basic/transform', 'geometries/planeGeometry'] })
        },
        createGround(name = 'ground') {
            return this.createGameObject({ name, scripts: ['basic/transform', 'geometries/groundGeometry'] })
        },
        createPointLight(name = 'pointLight') {
            this.createGameObject({ name, scripts: ['lights/pointLight', 'basic/transform'] })
        },
        createDirectionalLight(name = 'directionalLight') {
            this.createGameObject({ name, scripts: ['lights/directionalLight', 'basic/transform', 'lights/shadowGenerator'] })
        },
        createSpotLight(name = 'spotLight') {
            return this.createGameObject({ name, scripts: ['lights/spotLight', 'basic/transform'] })
        },
        createSkyBox(name = 'skyBox') {
            return this.createGameObject({
                name,
                scripts: ['basic/transform', 'geometries/boxGeometry', 'materials/backgroundMaterial', 'skybox']
            })
        },
        createHemisphericLight(name = 'hemisphericLight') {
            return this.createGameObject({ name, scripts: ['lights/hemisphericLight', 'basic/transform'] })
        },
        createUniversalCamera(name = 'universalCamera') {
            return this.createGameObject({ name, scripts: ['cameras/universalCamera', 'basic/transform'] })
        },
        createArcRotateCamera(name = 'arcRotateCamera') {
            return this.createGameObject({ name, scripts: ['cameras/arcRotateCamera', 'basic/transform'] })
        },
        createFollowCamera(name = 'followCamera') {
            return this.createGameObject({ name, scripts: ['cameras/followCamera', 'basic/transform'] })
        },
        createBoxArea(name = 'boxArea') {
            return this.createGameObject({ name, scripts: ['basic/transform', 'boxArea'] })
        },
        animate() {
        },
        init() {
            this.callEvent('init')
        },
        update() {
            this.callEvent('update')
        },
        lateUpdate() {
            this.callEvent('lateUpdate')
        },
        callEvent(eventName, ...args) {
            this.game.gameObjects.forEach(gameObject => gameObject.callEvent(eventName, ...args))
        },
        render() {
            const {
                game: { scene }, editControl, canvas, isPlaying
            } = this

            if (isPlaying || (editControl && editControl.isEditing()))
                scene.activeCamera && scene.activeCamera.detachControl(canvas)
            else
                scene.activeCamera && scene.activeCamera.attachControl(canvas)
            scene.getBoundingBoxRenderer().render()
            scene.render()
        },
        registerInputEvent(eventName) {
            this.canvas.addEventListener(eventName, e => this.isPlaying && this.callEvent(eventName, e))
        }
    },
    mounted() {
        const { canvas } = this

        this.game.setCanvas(canvas)
        new ResizeObserver(debounce(() => this.game.engine.resize(), 1000)).observe(canvas)
        // this.$store.dispatch('openScene', 'static/scenes/spaceShooter.scene')
        this.$store.dispatch('newScene')
        window.addEventListener('resize', debounce(() => this.game.engine.resize(), 100))

        canvas.addEventListener('webglcontextlost', function (event) {
            this.$store.dispatch('saveScene')
        }, false)

        inputEvents.forEach(this.registerInputEvent)
    },
    beforeDestory() {
    },
    render() {
        return <canvas class={styles.canvas} ref="canvas" />
    }
}
