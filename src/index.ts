import * as THREE from 'three';
import * as CANNON from 'cannon';
import World from './typings/World';
import GameObject from './typings/GameObject';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

console.log('change');

let Game = new World();

const loader = new GLTFLoader();
loader.load('http://localhost:3000/models/box-man/v1.glb', function (gltf: any) {
    let material = new THREE.MeshBasicMaterial({ color: 0x8c8c8c, wireframe: false });

    gltf.scene.children.forEach((child: THREE.Mesh) => child.material = material);

    Game.scene.add(gltf.scene);
}, undefined, function (error) {

    console.error(error);

});

// let Player = new GameObject(
//     Game,
//     new THREE.Vector3(.5, 5, 0),
//     gltf.scene.children[0].geometry,
//     new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: false }),
//     1
// );


// let Plane = new GameObject(
//     Game,
//     new THREE.Vector3(0, 0, 0),
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false }),
//     0
// );


Game.loop();
