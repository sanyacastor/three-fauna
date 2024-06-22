import * as THREE from 'three';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, HemisphereLight } from 'three';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
/*
  import { debug_camera_controller } from './proteapot/scripts/debug_camera_controller.js';
  import { xrobj_spwnr } from './proteapot/scripts/xrobj_spwnr.js';
*/
import { debug_camera_controller } from './scripts/debug_camera_controller.js'
import { pivot_placer } from './scripts/pivot_placer.js'
import { meshes_manager } from './scripts/meshes_manager.js'

import { data_loader } from './scripts/data_loader.js';
import { data_updater } from './scripts/data_updater.js';
import { xrobjectdata_manager } from './scripts/xrobjectdata_manager.js';

// ================== Scene setup ==================
const scene = new Scene();
const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new WebGLRenderer( { antialias: true, alpha: true } );

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
renderer.xr.enabled = true;

camera.position.z = 5;

// ------------------ Lights ------------------
const light = new HemisphereLight( 0xffffff, 0xffffe0, 3 );
light.position.set( 0.5, 1, 0.25 );
scene.add( light );

// ------------------ Animation ------------------
function animate() {
  renderer.render(scene, camera);
}

// ================== DOOM ==================
const container = document.createElement( 'div' );
document.body.appendChild( container );
container.appendChild( renderer.domElement );
document.body.appendChild(renderer.domElement);
// ================== Tools =================

// ----------------- data -----------------
var use_testdata_insteadDB = false;
var xrobjectDataManager =  new xrobjectdata_manager();
var dataLoader = new data_loader(use_testdata_insteadDB);
var dataUpdater = new data_updater(use_testdata_insteadDB, '/.netlify/functions/updatePlace');
var loader = new FBXLoader();

xrobjectDataManager.prepare_dropdown(document.getElementById('select_model_dropdown'));

// ----------------- main ----------------
var pivotplacer = new pivot_placer(camera, loader, scene,
                                   '/proteapot/meshes/sheet_frame_corners.fbx',
                                   '/proteapot/meshes/pivot.fbx', 
                                   '/proteapot/meshes/sheet_frame.fbx');
var texture_loader = new THREE.TextureLoader();                     
var meshesManager = new meshes_manager(THREE, loader, texture_loader, pivotplacer, camera, scene, xrobjectDataManager);
xrobjectDataManager.register_meshes_manager(meshesManager);
// ---------------- for debug ----------------
let debug_camera_controller_instance = new debug_camera_controller(camera, 0.1);

// ----------------- test -----------------

/*let xrobjectData = xrobjectDataManager.get_xrobject(''8324891730946216012-46-21463);
console.log("xrobjectData: >>" + xrobjectData.name + ": " + xrobjectData.model_path + "<<");*/

// ================= ARButton ===================

document.body.appendChild( ARButton.createButton( renderer,
  {
    optionalFeatures: [ 'dom-overlay', 'dom-overlay-for-handheld-ar' ],
    domOverlay: { root: document.body }
  }
 ) );

// ================= subscriptions ====================
subscribeButtons();

function subscribeButtons() {
  const save_button = document.getElementById('hud_save_button');
  const load_button = document.getElementById('hud_load_button');
  const pivot_button = document.getElementById('hud_pivot_button');
  const select_model_dropdown = document.getElementById('select_model_dropdown');
  const confirm_button = document.getElementById('hud_confirm_button');
  const abort_button = document.getElementById('hud_abort_button');
  const adjust_button = document.getElementById('hud_adjust_button');

  save_button.addEventListener('click', () => {
    console.log('save button clicked');
    let savejson = meshesManager.get_save_data();
    dataUpdater.updatePlace("399239316304298187", savejson);
    console.log("savejson: >>" + JSON.stringify(savejson) + "<<");
  });

  load_button.addEventListener('click', async () => {
    console.log('load button clicked');
    let ret = await dataLoader.loadSaveData();
    let data = dataLoader.pickExactPlace();
    console.log("loadedData: >>" + JSON.stringify(data) + "<<");
    meshesManager.spawn_meshes(data, xrobjectDataManager, loader);
  });

  pivot_button.addEventListener('click', async () => {
    console.log(pivotplacer.crosshair);
    await pivotplacer.place_general_pivot_at_crosshair();
  });


  select_model_dropdown.addEventListener('click', () => {
    console.log('model button clicked');
  });

  select_model_dropdown.addEventListener('change', () => {
    const selectModelDropdown = document.getElementById('select_model_dropdown') as HTMLSelectElement;

    
    if (selectModelDropdown) {
      console.log('model dropdown changed ' + selectModelDropdown.value);
      meshesManager.prepare_mesh_with_id(selectModelDropdown.value);
    } else {
        console.error('Select element not found');
    }
  });

  confirm_button.addEventListener('click', () => {
    console.log('confirm button clicked');
    pivotplacer.confirm_placement();
  });

  abort_button.addEventListener('click', () => {
    console.log('abort button clicked');
    pivotplacer.delete_placeble_model();
  });

  adjust_button.addEventListener('click', () => {
    var instance = castRay(scene, camera);

    if (instance != null) {
      console.log('adjust button clicked');
      pivotplacer.adjust_position(instance);
    }
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
}