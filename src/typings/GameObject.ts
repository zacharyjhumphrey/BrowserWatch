import * as THREE from 'three';
import * as CANNON from 'cannon';
import World from './World';
import { Scene } from 'three';

interface GameObjectArgs {
    Game: World,
    position: THREE.Vector3,
    mass: number,
    geometry?: THREE.BufferGeometry,
    material?: THREE.Material,
    object?: THREE.Object3D,
    scene?: THREE.Group,
}

export default class GameObject {
    geometry?: THREE.BufferGeometry;
    material?: THREE.Material;
    object: THREE.Object3D | THREE.Scene;
    // boundingBox: THREE.Box3;
    // parameters: THREE.Vector3;
    // position: THREE.Vector3;

    body: CANNON.Body;
    // shape: CANNON.Box;
    mass: number;
    test: boolean = false;

    constructor( args: GameObjectArgs ) {
        // Initializing THREE.JS
        if (args.scene) {
            this.mass = args.mass;
            this.object = new THREE.Object3D();
            this.body = new CANNON.Body({
                position: new CANNON.Vec3(args.position.x, args.position.y, args.position.z),
                mass: this.mass
            });
            this.body.sleepSpeedLimit = 1.0;

            for (let i = 0; i < args.scene.children.length; i++) {
                let obj = args.scene.children[i];
                let boundingBox = new THREE.Box3().setFromObject(obj);
                let parameters = boundingBox.getSize(new THREE.Vector3());
                let shape = new CANNON.Box(
                    new CANNON.Vec3(
                        parameters.x / 2,
                        parameters.y / 2,
                        parameters.z / 2
                    )
                );

                this.body.addShape(shape, threeToCannonVector(obj.position));
            }

            this.object.add(args.scene);

        } else { 

            if (args.object) {
                this.object = args.object;
            } else {
                // this.test = true;
                this.geometry = args.geometry;
                this.material = args.material;
                this.object = new THREE.Mesh(args.geometry, args.material);
                // console.dir(this.object);
            }
            
            let boundingBox = new THREE.Box3().setFromObject(this.object);
            let parameters = boundingBox.getSize(new THREE.Vector3());
            let position = args.position;

            // Initializing CANNON.JS
            let shape = new CANNON.Box(
                new CANNON.Vec3(
                    parameters.x / 2,
                    parameters.y / 2,
                    parameters.z / 2
                )
            );
            this.mass = args.mass;
            this.body = new CANNON.Body({
                position: new CANNON.Vec3(args.position.x, args.position.y, args.position.z),
                mass: this.mass
            });
            this.body.sleepSpeedLimit = 1.0;
            this.body.addShape(shape);

        }
        args.Game.addObject(this);
    }

    update() {
        // Copy coordinates from Cannon.js to Three.js
        this.object.position.copy(
            new THREE.Vector3(
                this.body.position.x, 
                this.body.position.y, 
                this.body.position.z
            )
        );

        this.object.quaternion.copy(
            new THREE.Quaternion(
                this.body.quaternion.x, 
                this.body.quaternion.y, 
                this.body.quaternion.z, 
                this.body.quaternion.w
            )
        );

        if (this.test) console.log(this.object.position);
    }
}

function threeToCannonVector(vec: THREE.Vector3) {
    return new CANNON.Vec3(vec.x, vec.y, vec.z);
}