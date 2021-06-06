import * as THREE from 'three';
import * as CANNON from 'cannon';
import { GameObjectArgs, GameObject } from './GameObject';
import Player from './Player';
// import Stats from 'three/examples/jsm/libs/stats.module.js';
// import * as LinkedList from 'linked-list';

//TODO: Decide on public or private for all fields
export default class World {
    timestep: number;
    world: CANNON.World;
    container: HTMLElement;
    scene: THREE.Scene;
    renderer: THREE.Renderer;
    clock: THREE.Clock;
    clientPlayer: Player;
    // stats: any;
    objects: Array<GameObject>;

    //TODO: Put these in a better place
    groundMaterial: CANNON.Material;
    playerMaterial: CANNON.Material;


    constructor() {
        this.container = document.getElementById('scene-container')!;
        console.log(this.container);

        this.clock = new THREE.Clock();

        this.timestep = 1/60;

        this.groundMaterial = new CANNON.Material("ground");
        this.playerMaterial = new CANNON.Material("player");

        // THREEJS
        this.scene = this.initScene();
        this.renderer = this.initRenderer();

        // CANNONJS
        this.world = this.initCannon();

        // this.stats = new Stats();

        this.objects = [];

        // Creating a player --------------------------------------------------
        this.clientPlayer = new Player(this);
    }

    // // THREEJS
    initScene() {
        let scene = new THREE.Scene();

        const generalLight = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(generalLight);

        const light = new THREE.PointLight(0x87ceeb, 1, 100, 2);
        light.position.set(20, 20, 20);
        scene.add(light);

        return scene;
    }

    initRenderer() {
        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(renderer.domElement);
        return renderer;
    }

    // // CANNONJS
    initCannon() {
        let newWorld = new CANNON.World();
        newWorld.broadphase = new CANNON.NaiveBroadphase();
        newWorld.solver.iterations = 10;

        //TODO: Turn this into a world constant to make it easy to change
        newWorld.gravity.set(0, -5.5, 0);


        let ground_player_cm = new CANNON.ContactMaterial(
            this.groundMaterial, 
            this.playerMaterial, 
        {
            friction: .0008,
            restitution: 0
        });

        newWorld.addContactMaterial(ground_player_cm);

        return newWorld;
    }

    // FUNCTIONAL
    loop() {
        // Request Animation for next frame
        requestAnimationFrame(this.loop.bind(this));
        
        // Update Physics Sim
        this.step();

        // Move the objects in the game
        this.updateObjects();

        // Render the changes
        this.render();
    }

    // Execute step in the physics sim
    step() {
        this.world.step(this.timestep);
    }

    // Update the positions of all of the objects
    updateObjects() {
        this.objects.forEach(child => child.update());
    }

    // Render the sim in the browser
    render() {
        this.renderer.render(this.scene, this.clientPlayer.camera);
    }

    testingSetup() {
        this.scene.add(new THREE.AxesHelper(10));
    }

    // Add object to the list of objects
    addObject(Object: GameObject) {
        // Add to Physics sim
        this.world.addBody(Object.body);
        
        // Add to Threejs scene
        this.scene.add(Object.object);

        // Store a reference to this object so that it can be updated later
        this.objects.push(Object);
    }
}