import * as THREE from 'three';
import * as CANNON from 'cannon';
import GameObject from './GameObject';
// import * as LinkedList from 'linked-list';

export default class World {
    timestep: number;
    world: CANNON.World;
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.Renderer;
    objects: Array<GameObject>;

    constructor() {
        this.timestep = 1/60;

        // THREEJS
        this.scene = this.initScene();
        this.camera = this.initCamera();
        this.renderer = this.initRenderer();

        // CANNONJS
        this.world = this.initCannon();

        this.objects = [];
    }

    // // THREEJS
    initCamera() {
        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.x = -30;
        camera.position.y = 35;
        camera.position.z = 30;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(camera);
        return camera;
    }

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
        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    // // CANNONJS
    initCannon() {
        let newWorld = new CANNON.World();
        newWorld.broadphase = new CANNON.NaiveBroadphase();
        newWorld.solver.iterations = 10;
        newWorld.gravity.set(0, -5.5, 0);
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
        this.renderer.render(this.scene, this.camera);
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