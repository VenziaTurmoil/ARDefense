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

        this.future_type = 'dart';

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

    addBloon(index) {
        // AMMO MESH
        let bloon_mesh = this.bloonMeshes[index].clone();

        this.scene.add(bloon_mesh);

        if (index == 0) {
            var newBloon = new RedBloon();
            newBloon.mesh = bloon_mesh;
            this.bloonArray.push(newBloon);
        }
        if (index == 1) {
            var newBloon = new BlueBloon();
            newBloon.mesh = bloon_mesh;
            this.bloonArray.push(newBloon);
        }
        if (index == 2) {
            var newBloon = new GreenBloon();
            newBloon.mesh = bloon_mesh;
            this.bloonArray.push(newBloon);
        }
        if (index == 3) {
            var newBloon = new YellowBloon();
            newBloon.mesh = bloon_mesh;
            this.bloonArray.push(newBloon);
        }
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
            if (this.bloonArray[i].hp == 0) {
                bloondelete_array.push(this.bloonArray[i])
            }
            this.bloonArray[i].update_position(delta)
        }
        this.deleteBloons(bloondelete_array)
    }
}

class Bloon {
    constructor() {
        this.mesh = undefined;
        this.speed = undefined;
        this.hp = undefined;
        this.target = new Vector3(1, 0, -2);
    }

    update_position(delta) {
        let v = this.target.clone();
        v.normalize().multiplyScalar(this.speed * delta);
        this.mesh.position.add(v);
    }

    death() { }

}

class RedBloon extends Bloon {
    constructor() {
        super();
        this.speed = 0.1;
        this.hp = 1;
    }

}

class BlueBloon extends Bloon {
    constructor() {
        super();
        this.speed = 0.2;
        this.hp = 1;
    }

}

class GreenBloon extends Bloon {
    constructor() {
        super();
        this.speed = 0.3;
        this.hp = 1;
    }

}

class YellowBloon extends Bloon {
    constructor() {
        super();
        this.speed = 0.4;
        this.hp = 1;
    }

}



