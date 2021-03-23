import * as THREE from 'three';
import * as CANNON from 'cannon';
import World from './typings/World';
import GameObject from './typings/GameObject';

let Game = new World();
let Box = new GameObject(
    Game, 
    new THREE.BoxGeometry(1, 1, 1), 
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
Game.addObject(Box);
Game.loop();
