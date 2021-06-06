import * as THREE from 'three';
import * as CANNON from 'cannon';
import World from './World';
import { Scene, Vector4 } from 'three';

export interface GameObjectArgs {
    Game: World,
    position: THREE.Vector3,
    mass: number,
    geometry?: THREE.BufferGeometry,
    material?: THREE.Material,
    object?: THREE.Object3D,
    scene?: THREE.Group,
}

export class GameObject {
    // Setup ------------------------------------------
    Game: World;
    geometry?: THREE.BufferGeometry;
    material?: THREE.Material;
    object: THREE.Object3D | THREE.Scene;
    // boundingBox: THREE.Box3;
    // parameters: THREE.Vector3;
    position: THREE.Vector3;
    // quaternion: THREE.Vector4;
    body: CANNON.Body;
    // shape: CANNON.Box;
    mass: number;
    test: boolean = false;

    // Game functions ---------------------------------
    rotates: boolean = true;

    constructor(args: GameObjectArgs) {
        this.Game = args.Game;
        this.position = args.position;
        // this.quaternion = new Vector4(0, 0, 0, 0);

        // Initializing THREE.JS
        if (args.scene) {
            this.mass = args.mass;
            this.object = new THREE.Object3D();

            this.body = new CANNON.Body({
                position: new CANNON.Vec3(this.position.x, this.position.y, this.position.z),
                mass: this.mass,
                material: this.Game.groundMaterial
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
                position: new CANNON.Vec3(this.position.x, this.position.y, this.position.z),
                mass: this.mass,
                material: this.Game.playerMaterial
            });
            this.body.sleepSpeedLimit = 1.0;
            this.body.addShape(shape);

        }
        console.dir(this);
        args.Game.addObject(this);
    }

    applyForce(x: number, y: number, z: number) {
        this.body.applyForce(
            new CANNON.Vec3(x, y, z), 
            this.body.position
        );
    }
    
    /*
        Returns dict of x, y, z
    */
    getBoundingBox() {
        let maxBox = this.body.aabb.upperBound;
        let minBox = this.body.aabb.lowerBound;

        return {
            x: maxBox.x - minBox.x, 
            y: maxBox.y - minBox.y, 
            z: maxBox.z - minBox.z
        };
    }

    update() {
        // Copy coordinates from Cannon.js to Three.js
        this.position.setX(this.body.position.x);
        this.position.setY(this.body.position.y);
        this.position.setZ(this.body.position.z);
        
        this.object.position.copy(
            new THREE.Vector3(
                this.position.x,
                this.position.y,
                this.position.z
            )
        );

        // Only rotate the object if the object calls for it
        if (this.rotates) {
            //TODO: Create quaternion as an actual gameObject field
            this.object.quaternion.copy(
                new THREE.Quaternion(
                    this.body.quaternion.x,
                    this.body.quaternion.y,
                    this.body.quaternion.z,
                    this.body.quaternion.w
                )
            );
        }

        if (this.test) console.log(this.object.position);
    }
}

function dictToCannonVector(vec: any) {
    return new CANNON.Vec3(vec.x, vec.y, vec.z);
}

function threeToCannonVector(vec: THREE.Vector3) {
    return new CANNON.Vec3(vec.x, vec.y, vec.z);
}
