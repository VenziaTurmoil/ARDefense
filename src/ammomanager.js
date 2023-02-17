import * as THREE from 'three';
import { Vector3 } from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class AmmoManager {
    constructor() {
        console.log(1);
        this.scene = undefined
        // ---- Ammo List ----
        this.ammoArray = new Array();
        // ---- Temporary variables ----
        this.newAmmoMeshToCreate = undefined;

        this.loader = new GLTFLoader();
        this.loader.setPath('assets/models/')

        this.future_type = 'dart';

        this.load('dartOnly__1_.glb');

    }

    load(path) {
        this.loader.load(path, this.dartReader(this));
    }

    dartReader(that) {
        return (gltf) => {
            that.newAmmoMeshToCreate = null;
            that.newAmmoMeshToCreate = gltf.scene;
        }
    }

    setScene(scene) {
        this.scene = scene;
    }

    addAmmo(camera, elapsedTime) {
        // AMMO MESH
        let ammo_mesh = this.newAmmoMeshToCreate.clone();

        ammo_mesh.position.add(
            new Vector3(camera.position.x, camera.position.y, camera.position.z))

        let target = new THREE.Vector3(0, 0, - 1);
        target.applyQuaternion(camera.quaternion);

        ammo_mesh.lookAt(target)
        this.scene.add(ammo_mesh);

        if (this.future_type == 'dart') {
            var newAmmo = new Dart(elapsedTime, target);
            newAmmo.mesh = ammo_mesh;
            this.ammoArray.push(newAmmo);
        }
    }

    deleteAmmos(ammodelete_array) {
        for (var i = 0; i < ammodelete_array.length; i++) {
            const index = this.ammoArray.indexOf(ammodelete_array[i]);
            if (index > -1) {
                this.ammoArray.splice(index, 1);
            }
            this.scene.remove(ammodelete_array[i].mesh);
        }
    }

    updateAmmosPositions(elapsed, delta) {
        const ammodelete_array = new Array();
        for (let i = 0; i < this.ammoArray.length; i++) {
            if (this.ammoArray[i].birth + this.ammoArray[i].uptime < elapsed) {
                ammodelete_array.push(this.ammoArray[i])
            }
            this.ammoArray[i].update_position(delta)
        }
        this.deleteAmmos(ammodelete_array, this.scene)
    }
}

class Ammo {
    constructor(elapsedTime, target) {
        this.mesh = undefined;
        this.uptime = undefined;
        this.birth = elapsedTime;
        this.speed = undefined;
        this.target = target;
    }

    update_position(delta) {
        let v = this.target.clone();
        v.normalize().multiplyScalar(this.speed * delta);
        this.mesh.position.add(v);
    }

}

class Dart extends Ammo {
    constructor(elapsedTime, target) {
        super(elapsedTime, target);
        this.uptime = 2;
        this.speed = 0.8;
    }

}
