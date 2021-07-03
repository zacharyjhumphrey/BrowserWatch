import * as THREE from 'three';
import * as CANNON from 'cannon';
import World from './typings/World';
import Player from './typings/Player';
import { GameObject } from './typings/GameObject';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import GameMap from './typings/GameMap';

let myGame = new World();

// Loading the map -----------------------------------------------------
const loader = new GLTFLoader();
loader.load('http://localhost:3000/models/test-map/model.glb', function (gltf: any) {
    let scene = new GameMap(myGame, gltf.scene);
}, undefined, (err) => console.error(err));

myGame.loop();
