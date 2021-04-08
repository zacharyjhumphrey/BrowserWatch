import * as THREE from 'three';
import * as CANNON from 'cannon';
import World from './typings/World';
import GameObject from './typings/GameObject';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let myGame = new World();

/*
    GOAL: 
        IMPLEMENT MODELS THAT COME FROM BLENDER INTO MY GAME SYSTEM

    TODO: 
        FIND A WAY TO DEFINE GEOMETRY OF THE MESHES 
            THESE WILL ACT AS THE HIT BOXES OF THE GEOMETRIES
*/

const loader = new GLTFLoader();
loader.load('http://localhost:3000/models/test-map/model.glb', function (gltf: any) {
    let scene = new GameObject({
        Game: myGame,
        position: new THREE.Vector3(0, 0, 0),
        mass: 0,
        scene: gltf.scene,
    });

    // console.log(gltf.scene == scene.object);
    // myGame.scene.add(gltf.scene);
}, undefined, (err) => console.error(err));

let Box1 = new GameObject({
    Game: myGame,
    position: new THREE.Vector3(7, 10, 2),
    mass: 1,
    geometry: new THREE.BoxGeometry(1, 1, 1),
    material: new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false }),
});

myGame.loop();
