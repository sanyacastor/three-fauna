import * as THREE from 'three';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, HemisphereLight } from 'three';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
/*
  import { debug_camera_controller } from './proteapot/scripts/debug_camera_controller.js';
  import { xrobj_spwnr } from './proteapot/scripts/xrobj_spwnr.js';
*/

const container = document.createElement( 'div' );
document.body.appendChild( container );

const scene = new Scene();
const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
renderer.xr.enabled = true;
container.appendChild( renderer.domElement );

document.body.appendChild(renderer.domElement);

const geometry = new BoxGeometry();
const material = new MeshBasicMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);

//scene.add(cube);

camera.position.z = 5;


const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 3 );
light.position.set( 0.5, 1, 0.25 );
scene.add( light );

const loader = new FBXLoader();

document.body.appendChild( ARButton.createButton( renderer,
  {
    optionalFeatures: [ 'dom-overlay', 'dom-overlay-for-handheld-ar' ],
    domOverlay: { root: document.body }
  }
 ) );


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




function animate() {
  if(polyhedron != undefined){
    polyhedron.rotation.x += 0.0001;
    polyhedron.rotation.y += 0.0001;
  }
  /*if(polyhedron != undefined){
    let polyscale = polyhedron.scale.clone();
    polyhedron.scale.set(polyscale.x * 1.01, polyscale.y * 1.01, polyscale.z * 1.01);
  }*/
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}