import * as THREE from 'three';
import * as CANNON from 'cannon';
import World from './World';

export default class GameObject {
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    mesh: THREE.Mesh;
    boundingBox: THREE.Box3;
    parameters: THREE.Vector3;
    position: THREE.Vector3;

    body: CANNON.Body;
    shape: CANNON.Box;
    mass: number;

    constructor(
        Game: World, 
        position: THREE.Vector3,
        geometry: THREE.BufferGeometry, 
        material: THREE.Material, 
        mass: number
    ) {
        // Initializing THREE.JS
        this.geometry = geometry;
        this.material = material;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
        this.parameters = this.boundingBox.getSize(new THREE.Vector3());
        this.position = position;

        // Initializing CANNON.JS
        this.shape = new CANNON.Box(
            new CANNON.Vec3(
                this.parameters.x / 2,
                this.parameters.y / 2,
                this.parameters.z / 2
            )
        );
        this.mass = mass;
        this.body = new CANNON.Body({
            position: new CANNON.Vec3(position.x, position.y, position.z),
            mass: this.mass
        });
        this.body.sleepSpeedLimit = 1.0;
        this.body.addShape(this.shape);
        Game.addObject(this);
    }

    update() {
        // Copy coordinates from Cannon.js to Three.js
        if (this.position.z != 0) 
            console.log(this.body.position);
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