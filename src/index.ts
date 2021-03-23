import * as THREE from 'three';
import * as CANNON from 'cannon';
import World from './typings/World';
import GameObject from './typings/GameObject';

let Game = new World();
let Box = new GameObject(
    Game, 
    new THREE.Vector3(.5, 5, 0),
    new THREE.BoxGeometry(1, 1, 1), 
    new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: false }),
    1
);

// let OtherBox = new GameObject(
//     Game,
//     new THREE.Vector3(0, 12, 0),
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: false }),
//     1
// );

let Plane = new GameObject(
    Game,
    new THREE.Vector3(0, 0, 0),
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false }),
    0
);

Game.loop();
