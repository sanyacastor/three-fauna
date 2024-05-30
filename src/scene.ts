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
const light = new HemisphereLight( 0xffffff, 0xff0000, 3 );
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
var use_testdata_insteadDB = true;
var xrobjectDataManager =  new xrobjectdata_manager();
var dataLoader = new data_loader(use_testdata_insteadDB);
var loader = new FBXLoader();

// ----------------- main ----------------
var pivotplacer = new pivot_placer(camera, loader, scene, '/proteapot/meshes/sheet_frame_corners.fbx');
var meshesManager = new meshes_manager(loader, pivotplacer, camera, scene, xrobjectDataManager);

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
  const model_button = document.getElementById('hud_model_button');

  save_button.addEventListener('click', () => {
    console.log('save button clicked');
    let savejson = meshesManager.get_save_data();
    console.log("savejson: >>" + JSON.stringify(savejson) + "<<");
  });

  load_button.addEventListener('click', async () => {
    console.log('load button clicked');
    let ret = await dataLoader.loadSaveData();
    let data = dataLoader.pickExactPlace();
    console.log("loadedData: >>" + JSON.stringify(data) + "<<");
    meshesManager.spawn_meshes(data, xrobjectDataManager, loader);
  });

  pivot_button.addEventListener('click', () => {
    console.log(pivotplacer.crosshair);
    pivotplacer.place_general_pivot_at_crosshair('/proteapot/meshes/sheet_frame.fbx');
  });

  model_button.addEventListener('click', () => {
    console.log('model button clicked');
  });
}


  /*
  import * as THREE from '/build/three.module.js';

  import { DataLoader } from './DataLoader.js';
  import { DataUpdater } from './DataUpdater.js';
  import { DataSaveLoadTests } from './DataSaveLoadTests.js';

  let use_testdata_insteadDB = false;


  document.addEventListener('DOMContentLoaded', async () => {
    const dataLoader = new DataLoader(use_testdata_insteadDB);
    const dataUpdater = new DataUpdater(use_testdata_insteadDB, '/.netlify/functions/updatePlace');
    const dataSaveLoadTester = new DataSaveLoadTests(use_testdata_insteadDB, '/.netlify/functions/updatePlace');
  });*/

  /*
let polyhedron: any;

loader.load('/proteapot/meshes/polyhedron.fbx', function (object: any) {
  object.traverse(function (child: any) {
    polyhedron = object;
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
    scene.add(object);
    object.position.set(0,0,-1);
    object.scale.set(1,1,1);
    console.log("loaded" + object);

    //object.add(cube);
    //cube.scale.set(0.5,0.5,0.5);
  });
});




const geometry = new BoxGeometry();
const material = new MeshBasicMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);
scene.add(cube);



*/