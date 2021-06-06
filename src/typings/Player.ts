import * as THREE from 'three';
import { GameObjectArgs, GameObject } from './GameObject';
import World from './World';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { settings } from 'node:cluster';

/**
 * This class contains all the controls and camera for the client player
 * as well 
 */
export default class Player extends GameObject {
    // ammo: number;
    // max_health: number;
    // current_health: number; 
    camera: THREE.Camera;
    controls: PointerLockControls;
    moveSpeed: number;

    //TODO: Find a way to create a dev.json or something of the sort
    private OVERHEAD_CAMERA: boolean;

    constructor(game: World) {
        let superArgs: GameObjectArgs = {
            Game: game,
            // position: new THREE.Vector3(7.5, 10, 2),
            position: new THREE.Vector3(10, 5, 0),
            mass: 1,
            geometry: new THREE.BoxGeometry(2, 1, 1),
            material: new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false }),
        };

        super(superArgs);

        //TODO Restructure so this can be in the initializer at the top 
        this.moveSpeed = 30;
        this.OVERHEAD_CAMERA = true;
        // this.rotates = false;

        this.camera = this.initCamera();
        this.controls = this.initCameraControls();
        this.initKeyboardControls();

        // @TEST 
        this.testingSetup();
    }

    /**
     * This function creates the camera that Player 1 (the client player)
     * will use to see the game
     * Uses a lot of THREEJS to get initialized
     * @returns THREE.Camera: Camera for this player to use
     */
    initCamera() {
        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.x = 15;
        camera.position.y = 5;
        camera.position.z = -10;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.Game.scene.add(camera);

        return camera;
    }
    
    /**
     * This function creates controls for the player to use
     * Controls for camera are predefined by THREE.PointerLockControls
     * @returns controls for the player to use
     */
    initCameraControls() {
        let controls: PointerLockControls = new PointerLockControls(this.camera, this.Game.renderer.domElement);
        this.Game.scene.add(controls.getObject());

        this.Game.container?.addEventListener('click', function () {
            controls.lock();
        });

        return controls;
    }

    initKeyboardControls() {
        let _this = this;
        document.addEventListener('keydown', keyDownEvents);
        document.addEventListener('keyup', keyUpEvents);

        function keyDownEvents(e: KeyboardEvent) {
            if (e.key.match(/w|W/)) {
                _this.applyForce(_this.moveSpeed, 0, 0);
            }
            else if (e.key.match(/s|S/)) {
                _this.applyForce(-_this.moveSpeed, 0, 0);
            }

            if (e.key.match(/a|A/)) {
                _this.applyForce(0, 0, -_this.moveSpeed);
            }
            else if (e.key.match(/d|D/)) {
                _this.applyForce(0, 0, _this.moveSpeed);
            }
        }

        function keyUpEvents(e: KeyboardEvent) {
            // console.log(`${e.key}`);
        }

    }

    setCameraPosition(pos: THREE.Vector3) {
        this.camera.position.setX(pos.x);
        this.camera.position.setY(pos.y);
        this.camera.position.setZ(pos.z);
    }

    update() {
        super.update();
        
        // Update the camera to be in the position of the player
        if (!this.OVERHEAD_CAMERA) {
            this.setCameraPosition(this.position);
        }
    }


    testingSetup() {
        this.object.add(new THREE.AxesHelper(5));
    }
}