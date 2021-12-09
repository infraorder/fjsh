import './styles.scss';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three';
import * as TICK from 'tick-knock'
import * as FJSH from './fjsh';

const fjsh = new FJSH.App({
  debug: true,
  renderer: {
    antialias: true,
  },
});

const orbitControls = new OrbitControls(fjsh.camera, fjsh.renderer.domElement)
orbitControls.enableDamping = true

const material = new THREE.MeshNormalMaterial();

const boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
const box = new THREE.Mesh( boxGeometry, material );
fjsh.scene.add( box );

const planeGeometry = new THREE.PlaneGeometry(2, 2);
const plane = new THREE.Mesh( planeGeometry, material );
plane.rotation.x = Math.PI * -0.5;
plane.position.y = -2
fjsh.scene.add( plane )

console.log(box.position.x)
const entity = new TICK.Entity()
  .add(new FJSH.Transform({ position: box.position }))
  .append(new FJSH.Animation({ y: 10, loop: true }))

fjsh.engine.addSystem(new FJSH.AnimationSystem());
fjsh.engine.addEntity(entity);

window.onload = () => fjsh.startup();
