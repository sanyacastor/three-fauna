
import * as THREE from 'three';

export class pivot_placer {
    constructor(camera_ref, loader, scene, crosshair_path, pivot_path, pivot_mesh_path){

        this.scene = scene;
        this.camera = camera_ref;
        this.loader = loader;

        this.crosshair = null;
        
        this.pivot_visualization = null;
        this.general_pivot = null; // it always looks up
        this.pivot_mesh_path = pivot_mesh_path;

        loader.load(crosshair_path, (object) => {
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );

            this.crosshair = object;

            this.scene.add(object);
            this.camera.add( object );
            this.scene.add( this.camera );

            this.crosshair.position.set(0,0,-0.6);
        });

        loader.load(pivot_path, (object) => {
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );

            this.general_pivot = object;
            this.scene.add(object);
            this.general_pivot.position.set(0,0,0);
            this.general_pivot.rotation.set(0,0,0);
        });

        loader.load(pivot_mesh_path, (object) => {
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );

            this.pivot_visualization = object;
            this.scene.add(object);
            this.pivot_visualization.position.set(0,0,0);
            this.pivot_visualization.rotation.set(0,0,0);
        });
        
        this.place_general_pivot_at_crosshair  = async () => {
            //!!!!! async troubles !!!!!!!
            if(this.crosshair == null){
                console.log("Crosshair not loaded yet");
                return;
            }
            
            this.crosshair.add(this.pivot_visualization); 
            this.pivot_visualization.position.set(0,0,0);
            this.pivot_visualization.rotation.set(0,0,0);
            this.scene.attach(this.pivot_visualization);
            
            this.crosshair.add(this.general_pivot); 
            this.general_pivot.position.set(0,0,0);
            this.general_pivot.rotation.set(0,0,0);
            this.scene.attach(this.general_pivot);

            this.general_pivot.rotation.set(0,0,0);
            
            this.visualization_global_forward = new THREE.Vector3(0,0,-1);
            this.visualization_global_forward.applyQuaternion(this.pivot_visualization.quaternion);

            this.forward_horizontal_projection = new THREE.Vector3(this.visualization_global_forward.x, 0, this.visualization_global_forward.z);
            this.forward_horizontal_projection.normalize();

            let dot_product = this.forward_horizontal_projection.dot(new THREE.Vector3(0,0,1));
            let cross_sign;
            let cross_res = new THREE.Vector3();
            cross_res.crossVectors(this.forward_horizontal_projection, new THREE.Vector3(0,0,1));
            if(cross_res.y > 0){
                cross_sign = 1;
            }else{
                cross_sign = -1;
            }
            let angle = Math.acos(dot_product);
            console.log("dot_product: " + dot_product + "angle: " + angle);
            console.log("cross_sign: " + cross_sign);

            const up = new THREE.Vector3(0, cross_sign, 0);
            this.general_pivot.rotateOnAxis(up, (-1*angle));

            //draw forward vector
            var geometry = new THREE.BufferGeometry(); // Replace THREE.Geometry() with THREE.BufferGeometry()
            var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
            var points = [];
            points.push(this.general_pivot.position);
            points.push(this.general_pivot.position.clone().add( new THREE.Vector3(0,0,-1)));
            points.push(this.general_pivot.position);
            points.push(this.general_pivot.position.clone().add( this.forward_horizontal_projection));
            geometry.setFromPoints(points);
            var line = new THREE.Line(geometry, material);
            this.scene.add(line);


            //this.general_pivot.rotation.set(0, this.angle, 0);
            // const up = new THREE.Vector3(0, 1, 0);
            // const vector_right = new THREE.Vector3();
            // const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.pivot_visualization.quaternion);
            // const forward_cross_res = new THREE.Vector3();
            // forward_cross_res.crossVectors(up, right);

            // this.general_pivot.up = up;
            // this.general_pivot.lookAt(forward_cross_res);

        };
/*
        // not required anymore. all pivots are prespawned
        this.trySpawnPivot = async (pivot_mesh_path) => {
            if(this.general_pivot != null){
                return;
            }
            //!!!!! async troubles !!!!!!!

            await this.loader.load(pivot_mesh_path, (object) => {
                object.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                this.general_pivot = object;
                this.scene.add(object);
                
                
                this.crosshair.add(this.general_pivot); 

                this.general_pivot.position.set(0,0,0);
                this.general_pivot.rotation.set(0,0,0);

                this.scene.attach(this.general_pivot);
            });
        };
*/

        this.start_model_placement = (model) => {
            if(this.current_model != null) {
                console.log("Error: start_model_placement. current_model is not null. Attaching it to general_pivot");
                this.confirm_placement();
            }

            console.log("start_model_placement. model: ", model);
            
            this.current_model = model;
            
            this.camera.add(model);
            model.position.set(0, 0, -0.5);
            model.rotation.set(0, 0, 0);
        }

        this.confirm_placement = () => {
            if(this.current_model == null)
                return;

            this.general_pivot.attach(this.current_model);
            this.current_model = null;
        }

        this.delete_placeble_model = () => {
            if(this.current_model != null){
                this.camera.remove(this.current_model);
                this.general_pivot.remove(this.current_model);
                this.current_model = null;
            }
        }

        this.adjust_position = (instances) => {
            this.confirm_placement();

            var model = instances;
            if (model == null) {
                console.log("Error: adjust_position. model is null");
                return;
            }

            this.camera.attach(model);
            this.current_model = model;
        }
    }
}