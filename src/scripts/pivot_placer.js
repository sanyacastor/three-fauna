export class pivot_placer {
    
    constructor(camera_ref, loader, scene, crosshair_path){
        this.scene = scene;
        this.camera = camera_ref;
        this.loader = loader;

        this.crosshair = null;
        this.general_pivot = null;

        /*this.place_general_pivot_at_crosshair = this.place_general_pivot_at_crosshair.bind(this); 
        this.trySpawnPivot = this.trySpawnPivot.bind(this);*/             // didn't help

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

        this.place_general_pivot_at_crosshair  = async (pivot_mesh_path) => {
            //!!!!! async troubles !!!!!!!

            if(this.crosshair == null){
                console.log("Crosshair not loaded yet");
                return;
            }

            if(this.general_pivot == null)
                await this.trySpawnPivot(pivot_mesh_path);
            else{
                this.crosshair.add(this.general_pivot); 

                this.general_pivot.position.set(0,0,0);
                this.general_pivot.rotation.set(0,0,0);
    
                this.scene.attach(this.general_pivot);
            }
        };

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
/*
  adjust_button.addEventListener('click', () => {
    var instances = castRay(scene, camera);
    console.log('adjust button clicked');
    console.log(instances);
    pivotplacer.adjust_position(instances);
  });

  function castRay(scene, camera) {
    // Create a raycaster and set its origin and direction
    const raycaster = new THREE.Raycaster();
    const centerVector = new THREE.Vector2(0, 0); // Center of the screen in NDC (Normalized Device Coordinates)
    raycaster.setFromCamera(centerVector, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
    return intersects.length > 0 ? intersects[0].object : null;
  }
*/
    }
}