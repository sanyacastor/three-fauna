export class xrobjectdata_manager {
    constructor() {
        this.test_xrobjects_savedata = [
            {
                "id": "399239488204701904",
                "coll": "Model",
                "ts": "2024-05-30T18:01:02.650Z",
                "name": "turtle",
                "model_path": "/proteapot/meshes/turtle.fbx"
            },
            {
                "id": "399332498998296779",
                "coll": "Model",
                "ts": "2024-05-30T18:00:27.706Z",
                "name": "gear01",
                "model_path": "/proteapot/meshes/gear01.fbx"
            },
            {
                "id": "399332537155977419",
                "coll": "Model",
                "ts": "2024-05-30T18:00:49.660Z",
                "name": "polyhedron",
                "model_path": "/proteapot/meshes/polyhedron.fbx"
            },
            {
                "id": "399332558840529099",
                "coll": "Model",
                "ts": "2024-05-30T18:01:43.260Z",
                "name": "mill",
                "model_path": "/proteapot/meshes/mill.fbx"
            },
            {
            "id": "399332623984361680",
            "coll": "Model",
            "ts": "2024-05-30T18:02:22.380Z",
            "name": "sheet_frame",
            "model_path": "/proteapot/meshes/sheet_fram.fbx"
            },
            {
                "id": "399332627297861840",
                "coll": "Model",
                "ts": "2024-05-30T18:02:47.370Z",
                "name": "sheet_frame_corners",
                "model_path": "/proteapot/meshes/sheet_frame_corners.fbx"
            }];

        this.get_xrobject = (id) => {
            let ret_xrobject;
            this.test_xrobjects_savedata.forEach((xrobject) => {
                if (xrobject.id === id)
                    ret_xrobject = xrobject;
            });

            if (ret_xrobject === undefined)
                console.log("Error: xrobject_manager.get_xrobject: Could not find xrobject with id: ", id);

            return ret_xrobject;
        }
    }
}