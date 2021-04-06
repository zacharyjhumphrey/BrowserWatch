import * as THREE from 'three';
import * as CANNON from 'cannon';
import World from './typings/World';
import GameObject from './typings/GameObject';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { threeToCannon } from 'three-to-cannon';

let Game = new World();

/*
    GOAL: 
        IMPLEMENT MODELS THAT COME FROM BLENDER INTO MY SYSTEM    
    TODO: 
        FIND A WAY TO STRIP THE GEOMETRY FROM 
            I DON'T WANT TO MAKE THIS EXCLUSIVELY BOX GEOMETRY AS THAT WOULD LIMIT THE GEOMETRY THAT I CAN CREATE IN THE SYSTEM 
        FIND A WAY TO PUT ABSTRACT SHAPES INTO CANNON
*/

const loader = new GLTFLoader();
loader.load('http://localhost:3000/models/test-map/v1.glb', function (gltf: any) {
    // const shape = threeToCannon(gltf.scene);
    const { shape, offset, quaternion, metadata } = threeToCannon(gltf.scene);

    // console.log(shape);
    // Game.scene.add(gltf.scene);
}, undefined, (err) => console.error(err));

// let canvas = document.getElementById('scene-container');
// canvas.onmousemove((e: Event) => console.log(e));

// let Player = new GameObject(
//     Game,
//     new THREE.Vector3(.5, 5, 0),
//     gltf.scene.children[0].geometry,
//     new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: false }),
//     1
// );


let Box = new GameObject(
    Game,
    new THREE.Vector3(20, 20, 20),
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false }),
    1
);


Game.loop();
