import * as THREE from 'three';
import { Vector3 } from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class BloonManager {
    constructor() {
        this.scene = undefined
        // ---- Ammo List ----
        this.bloonArray = new Array();
        // ---- Temporary variables ----
        this.bloonMeshes = new Array();

        this.loader = new GLTFLoader();
        this.loader.setPath('assets/models/')

        this.load();

    }

    load() {
        this.loader.load('redBloon.glb', this.bloonReader(this));
        this.loader.load('blueBloon.glb', this.bloonReader(this));
        this.loader.load('greenBloon.glb', this.bloonReader(this));
        this.loader.load('yellowBloon.glb', this.bloonReader(this));
    }

    bloonReader(that) {
        return (gltf) => {
            that.bloonMeshes.push(gltf.scene);
        }
    }

    setScene(scene) {
        this.scene = scene;
    }

    addBloon(index, position = new Vector3(Math.random() * 2, Math.random() * 2, Math.random() * 2)) {

        let bloon_mesh = this.bloonMeshes[index].clone();
        bloon_mesh.position.add(position);

        this.scene.add(bloon_mesh);
        console.log(this.scene)

        let newBloon = null;

        if (index == 0) {
            newBloon = new RedBloon(this);
            newBloon.mesh = bloon_mesh;
            this.bloonArray.push(newBloon);
        }
        if (index == 1) {
            newBloon = new BlueBloon(this);
            newBloon.mesh = bloon_mesh;
            this.bloonArray.push(newBloon);
        }
        if (index == 2) {
            newBloon = new GreenBloon(this);
            newBloon.mesh = bloon_mesh;
            this.bloonArray.push(newBloon);
        }
        if (index == 3) {
            newBloon = new YellowBloon(this);
            newBloon.mesh = bloon_mesh;
            this.bloonArray.push(newBloon);
        }

        return newBloon;
    }

    deleteBloons(bloondelete_array) {
        for (var i = 0; i < bloondelete_array.length; i++) {
            const index = this.bloonArray.indexOf(bloondelete_array[i]);
            if (index > -1) {
                this.bloonArray.splice(index, 1);
            }
            this.scene.remove(bloondelete_array[i].mesh);
        }
    }

    updateBloonsPositions(delta) {
        const bloondelete_array = new Array();
        for (let i = 0; i < this.bloonArray.length; i++) {
            if (this.bloonArray[i].todelete) {
                bloondelete_array.push(this.bloonArray[i])
            }
            this.bloonArray[i].update_position(delta)
        }
        this.deleteBloons(bloondelete_array)
    }
}

class Bloon {
    constructor(bloonManager) {
        this.bloonManager = bloonManager;
        this.mesh = undefined;
        this.speed = undefined;
        this.hp = undefined;
        this.target = new Vector3(0, 0, 0);
        this.todelete = false;
        this.index = null;
        this.hitbox = null;
    }

    update_position(delta) {
        let v = new Vector3(
            this.target.x - this.mesh.position.x,
            this.target.y - this.mesh.position.y,
            this.target.z - this.mesh.position.z,
        )
        v.normalize().multiplyScalar(this.speed * delta);
        this.mesh.position.add(v);
    }

    hit(damage) {
        if (damage >= this.hp) {
            this.todelete = true;
            let newBloon = this.bloonManager.addBloon(this.index - 1, this.mesh.position)
            return newBloon.hit(damage - this.hp);
        } else {
            return this;
        }
    }

}

class RedBloon extends Bloon {
    constructor(bloonManager) {
        super(bloonManager);
        this.speed = 0.05;
        this.hp = 1;
        this.index = 0;
        this.hitbox = 0.4;
    }

    hit(damage) {
        if (damage >= this.hp) {
            this.todelete = true;
        }
        return this
    }

}

class BlueBloon extends Bloon {
    constructor(bloonManager) {
        super(bloonManager);
        this.speed = 0.1;
        this.hp = 1;
        this.index = 1;
        this.hitbox = 1.1 * 0.4;
    }

}

class GreenBloon extends Bloon {
    constructor(bloonManager) {
        super(bloonManager);
        this.speed = 0.15;
        this.hp = 1;
        this.index = 2;
        this.hitbox = 1.2 * 0.4;
    }

}

class YellowBloon extends Bloon {
    constructor(bloonManager) {
        super(bloonManager);
        this.speed = 0.2;
        this.hp = 1;
        this.index = 3;
        this.hitbox = 1.3 * 0.4;
        console.log(this)
    }

}



