import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export class xrobj_spwnr {
    constructor(camera_ref, scene_ref) {
        this.camera = camera_ref;
        this.scene = scene_ref;

        this.placable_model;
        this.current_model_config;
        this.general_pivot = undefined;
        this.fbxLoader = new FBXLoader();

        this.modelArray = new Map();
    }

    prepare_placement(general_pivot, model_config) {
        console.log("model_config: ", model_config);
        let model_path = model_config.model_path;
        this.current_model_config = model_config;

        if (general_pivot === undefined) {
            console.log("Error: xrobj_spwnr.prepare_placement: General pivot not placed yet");
            return;
        }

        this.general_pivot = general_pivot;
        this.abort_current_placement();

        this.fbxLoader.load(model_path, (object) => {
            this.placable_model = object;

            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            this.scene.add(this.placable_model);

            let camerapos = this.camera.position.clone();

            this.camera.add(this.placable_model);
            this.scene.add(this.camera);

            this.placable_model.position.set(0, -0.2, -1);
            this.placable_model.scale.set(1, 1, 1);
        });
    }

    place_current_model(model_ref) {
        if (this.placable_model === undefined){
            console.log("Error: Placable model not prepared yet");
            return;
        }

        this.modelArray.set(this.placable_model, this.current_model_config);

        this.general_pivot.attach(this.placable_model);
        this.placable_model = undefined;

        console.log("number of models in modelArray: ", this.modelArray.size);
        console.log("modelArray: ", this.modelArray);
        
        //this.printGeneralPivotChildren();
    }

    printGeneralPivotChildren() {
        if (this.general_pivot !== undefined) {
            console.log("Children of general_pivot:");
            this.general_pivot.children.forEach((child, index) => {
                console.log(`Child ${index}:`, child);
            });
        } else {
            console.log("Error: general_pivot is undefined");
        }
    }

    get_save_data() {
        let xr_objects = [];
        this.modelArray.forEach((model_config, model) => {
            let xr_object = {
                id: model_config.id,
                name: model_config.name,
                pos: [model.position.x, model.position.y, model.position.z],
                rot: [model.quaternion.x, model.quaternion.y, model.quaternion.z, model.quaternion.w],
                scale: [model.scale.x, model.scale.y, model.scale.z]
            };
            xr_objects.push(xr_object);
        });
        
        return xr_objects;
    }

    get_xrobject_model_path_from_savedata(xrobjects_load_data, xr_object_id) {
        let ret_path;
        xrobjects_load_data.forEach((xrobject) => {
            
            if (Number(xrobject.id) == Number(xr_object_id))
                ret_path = xrobject.model_path;
        });

        if(ret_path === undefined)
            console.log("Error: xrobj_spwnr.get_xrobject_model_path_from_savedata: Could not find model path for xr_object_id: ", xr_object_id);

        return ret_path;
    }

    async load_data(test_load_data, xrobjects_load_data) {
        const xr_objects = test_load_data.xr_objects;
    
        for (const xr_object of xr_objects) {
            let xr_object_id = xr_object.id;
            
            let model_path = this.get_xrobject_model_path_from_savedata(xrobjects_load_data, xr_object_id);

            if (model_path === undefined) {
                console.log("Error: xrobj_spwnr.load_data: Could not find model path for xr_object_id: ", xr_object_id);
                continue;
            }

            let pos = new THREE.Vector3(xr_object.pos[0], xr_object.pos[1], xr_object.pos[2]);
            let rot = new THREE.Quaternion(xr_object.rot[0], xr_object.rot[1], xr_object.rot[2], xr_object.rot[3]);
            let scale = new THREE.Vector3(xr_object.scale[0], xr_object.scale[1], xr_object.scale[2]);
    
            let model_config = {
                id: xr_object.id,
                name: xr_object.name,
                model_path: model_path
            };
    
            await new Promise((resolve, reject) => {
                this.fbxLoader.load(model_path, (object) => {
                    let model = object;
    
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
    
                    this.scene.add(model);
                    this.general_pivot.add(model);
                    model.position.copy(pos);
                    model.quaternion.copy(rot);
                    model.scale.copy(scale);
                    
                    this.modelArray.set(model, model_config);
    
                    resolve(); // Resolve the promise after loading the model
                });
            });
    
            console.log("Spawned: " + xr_object.name + " at pos: " + pos + " with rot: " + rot + " and scale: " + scale);
        }
    }

    

    /*function place_placable_model_at_world_position_keeping_its_orientation(){
        if(placableModel === undefined){
            console.log("Placable model not prepared yet");
            return;
        }

        const worldPosition = new THREE.Vector3();
        const worldRotation = new THREE.Quaternion();
        placableModel.getWorldPosition(worldPosition);
        placableModel.getWorldQuaternion(worldRotation);

        camera.remove(placableModel);
        scene.add(placableModel);

        placableModel.position.copy(worldPosition);
        placableModel.quaternion.copy(worldRotation);
        
        console.log("Placable model placed at pos: ", worldPosition);
        console.log("Placable model placed at rot: ", worldRotation);

        general_pivot.attach(placableModel); 
    }*/
    abort_current_placement() {
        if (this.placable_model !== undefined) {
            console.log("abort_current_placement: Removing placable model from scene");
            this.scene.remove(this.placable_model);
            this.placable_model = undefined;
        }
    }

    isPlacementInProgress() {
        return this.placable_model != undefined;
    }
}
