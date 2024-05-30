export class pivot_placer {
    
    constructor(camera_ref, loader, scene, crosshair_path){
        this.scene = scene;
        this.camera = camera_ref;
        this.loader = loader;

        this.crosshair = null;
        this.general_pivot = null;

        /*this.place_general_pivot_at_crosshair = this.place_general_pivot_at_crosshair.bind(this); 
        this.spawnPivot = this.spawnPivot.bind(this);*/             // didn't help

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
    
            if(this.general_pivot == null){
                await this.spawnPivot(pivot_mesh_path);

                console.log("crosshair:" + this.crosshair);
                console.log("generalpivot:" + this.general_pivot);

                this.crosshair.add(this.general_pivot); 
                this.scene.attach(this.general_pivot);
                
            } else {
                console.log("crosshair:" + this.crosshair);
                console.log("generalpivot:" + this.general_pivot);

                this.crosshair.add(this.general_pivot); 

                this.general_pivot.position.set(0,0,0);
                this.general_pivot.rotation.set(0,0,0);

                this.scene.attach(this.general_pivot);
            }
    
        };

        this.spawnPivot = async (pivot_mesh_path) => {
            //!!!!! async troubles !!!!!!!

            this.loader.load(pivot_mesh_path, (object) => {
                object.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                this.general_pivot = object;
                this.scene.add(object);
            });
        };
    }
}