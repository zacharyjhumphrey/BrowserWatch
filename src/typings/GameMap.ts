import * as THREE from "three";
import { GameObject, GameObjectArgs } from "./GameObject";
import World from "./World";
import * as CANNON from 'cannon';

// abstract class MapUtil {
//     static readonly DEFAULT_POSITION = new THREE.Vector3(10, 5, 0);
//     static readonly DEFAULT_MASS = 1;
// }
/*
    What I'm trying to figure out:  
        Should I define values such as position with the other values in gamemap 
        OR should I pass them into super
    What I've figured out so far: 
        If values will be different on different instances,
            pass them into super
        else,
            define them in PARENT, not child (i believe)
    BUT THEN HOW DO I DEFINE THEM FOR DIFFERENT CHILDREN 
*/
//TODO Restructure gameObject children
export default class GameMap extends GameObject {
    static material: CANNON.Material = new CANNON.Material("map");
    position = new THREE.Vector3(0, 0, 0);

    constructor(game: World, scene: THREE.Group) {
        super({
            Game: game,
            position: new THREE.Vector3(0, 0, 0),
            mass: 0,
            scene: scene
        });
    }

}