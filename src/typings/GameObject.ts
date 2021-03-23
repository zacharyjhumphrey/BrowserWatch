import * as THREE from 'three';
import * as CANNON from 'cannon';
import World from './World';
import { NumberKeyframeTrack } from 'three';

export default class GameObject {
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    mesh: THREE.Mesh;
    
    body: CANNON.Body;
    shape: CANNON.Box;
    mass: number;

    constructor(Game: World, geometry: THREE.BufferGeometry, material: THREE.Material) {
        this.geometry = geometry;
        this.material = material;
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
        this.mass = 1;
        this.body = new CANNON.Body({
            mass: 1
        });
        this.body.addShape(this.shape);
        this.body.angularVelocity.set(0, 10, 0);
        this.body.angularDamping = 0.5;
        Game.world.addBody(this.body); // world.addBody(body);

    }

    update() {
        // Copy coordinates from Cannon.js to Three.js
        this.mesh.position.copy(
            new THREE.Vector3(
                this.body.position.x, 
                this.body.position.y, 
                this.body.position.z
            )
        );

        this.mesh.quaternion.copy(
            new THREE.Quaternion(
                this.body.quaternion.x, 
                this.body.quaternion.y, 
                this.body.quaternion.z, 
                this.body.quaternion.w
            )
        );
    }
}