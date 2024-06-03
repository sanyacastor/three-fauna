export class meshes_manager {
    constructor(loader, pivotplacer, camera, scene, xrobjectdata_manager) {
        this.loader = loader;
        this.pivotplacer = pivotplacer;
        this.camera = camera;
        this.scene = scene;
        this.xrobjectdata_manager = xrobjectdata_manager;

        this.current_place_id = 0;
        this.current_place_name = "unnamed place"

        this.get_save_data = () => {
            let xr_objects = [];
            this.pivotplacer.general_pivot.children.forEach((model) => {

                let xr_object = {
                    id: model.xrobjectid,
                    name: model.xrobjectname,
                    pos: [model.position.x, model.position.y, model.position.z],
                    rot: [model.quaternion.x, model.quaternion.y, model.quaternion.z, model.quaternion.w],
                    scale: [model.scale.x, model.scale.y, model.scale.z]
                };

                console.log("get_save_data. xr_object: ", xr_object);
                if(xr_object.id != undefined && xr_object.id != "")
                    xr_objects.push(xr_object);
            });

            let save_data = {
                coll: { name: "Place" },
                id: this.current_place_id,
                ts: { isoString: new Date().toISOString() },
                name: this.current_place_name,
                xr_objects: xr_objects
            };

            return save_data;
        }

        this.prepare_mesh_with_id = async (id) => {
            let objdata = this.xrobjectdata_manager.get_xrobject(id);

            if (objdata === undefined) {
                console.log("Error: Could not find xrobject with id: ", id);
                return;
            }

            console.log("prepare_mesh_with_id. id: " + id + " model_path: ", objdata.model_path);

            loader.load(objdata.model_path, (model) => {
                model.name = objdata.name;
                this.pivotplacer.general_pivot.add(model);
                model.xrobjectid = id;
                model.xrobjectname = objdata.name;

                this.pivotplacer.start_model_placement(model);
                //this.camera.attach(model);
            });
        }

        this.spawn_meshes = (place_data, xrobjectdata_manager, loader) => {
            //this.testSaveString = '[{"coll":{"name":"Place"},"id":"399239316304298187","ts":{"isoString":"2024-05-29T22:04:56.890Z"},"name":"Initial test place","xr_objects":[{"id":"399332537155977419","name":"Polyhedron","pos":[0,0.3,0],"rot":[0,0,0,1],"scale":[1,1,1]},{"id":"399332498998296779","name":"Gear01","pos":[0,-0.3,0],"rot":[0,0,0,1],"scale":[1,1,1]}]},{"coll":{"name":"Place"},"id":"399255095038968011","ts":{"isoString":"2024-05-29T21:30:17.830Z"},"name":"Test Place 2","xr_objects":[{"id":"399332498998296779","name":"Gear01","pos":[0,-0.3,0],"rot":[0,0,0,1],"scale":[1,1,1]}]}]';
            if (place_data === undefined) {
                console.log("Error: place_data is undefined");
                return;
            }

            if (place_data.xr_objects === undefined) {
                console.log("Error: place_data.xr_objects is undefined");
                return;
            }

            this.current_place_id = place_data.id;
            this.current_place_name = place_data.name;

            place_data.xr_objects.forEach(element => {
                let id = element.id;
                let name = element.name;
                let objdata = xrobjectdata_manager.get_xrobject(id);


                if (objdata === undefined) {
                    console.log("Error: Could not find xrobject with id: ", id);
                    return;
                }

                console.log("spawn_mesh. name: " + name + " model_path: ", objdata.model_path);

                loader.load(objdata.model_path, (model) => {
                    model.name = name;
                    
                    this.pivotplacer.general_pivot.add(model);
                    model.xrobjectid = id;
                    model.xrobjectname = name;

                    model.position.set(element.pos[0], element.pos[1], element.pos[2]);
                    model.quaternion.set(element.rot[0], element.rot[1], element.rot[2], element.rot[3]);
                    model.scale.set(element.scale[0], element.scale[1], element.scale[2]);
                });
            });
        }
    }
}