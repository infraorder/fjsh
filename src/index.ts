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

enum OscilatorMethod {
  sin,
  cos,
}

class Oscilator extends TICK.LinkedComponent {
  
  position: FJSH.Vector;
  rotation: FJSH.Vector;
  method: OscilatorMethod;

  public constructor({  rotation = { x: 0, y: 0, z: 0 }, position = { x: 0, y: 0, z: 0 }, method = OscilatorMethod.sin } = {} ) { 

    super();
    this.position = position;
    this.rotation = rotation;
    this.method = method;
  }
}

class ComponentPrimative {

  position: FJSH.Vector;
  rotation: FJSH.Euler;
}

class Box extends ComponentPrimative {

  initial: ComponentPrimative;
  id: number;

  public constructor({ position = new FJSH.Vector(),
    rotation = new FJSH.Euler(),
    id = 0 } = {}) {

    super();

    this.position = position;
    this.rotation = rotation;
    this.initial = new ComponentPrimative()
    this.initial.position = { ...position };
    this.initial.rotation = { ...rotation };
    this.initial.rotation = { x: rotation.x, y: rotation.y, z: rotation.z, order: rotation.order };

    this.id = id;
  }
}

class OscilatorSystem extends TICK.IterativeSystem {
  public constructor() {
    super((entity) => entity.hasAll(Box, Oscilator));
  }

  public updateEntity(entity: TICK.Entity, dt: number) {
    
    const box = entity.get(Box)!;

    const delta = {
      position: {x:0,y:0,z:0},
      rotation: {x:0,y:0,z:0},
    }

    entity.iterate(Oscilator, (oscilator: Oscilator) => {
      
      let oscilation = Math.sin;
      if (oscilator.method == OscilatorMethod.cos) {

        oscilation = Math.cos
      }

      delta.position.x += ((oscilation(dt) - 0.5) * oscilator.position.x);
      delta.position.y += ((oscilation(dt) - 0.5) * oscilator.position.y);
      delta.position.z += ((oscilation(dt) - 0.5) * oscilator.position.z);

      delta.rotation.x += ((oscilation(dt) - 0.5) * oscilator.rotation.x) * Math.PI;
      delta.rotation.y += ((oscilation(dt) - 0.5) * oscilator.rotation.y) * Math.PI;
      delta.rotation.z += ((oscilation(dt) - 0.5) * oscilator.rotation.z) * Math.PI;
    })

    box.position.x = delta.position.x + box.initial.position.x;
    box.position.y = delta.position.y + box.initial.position.y;
    box.position.z = delta.position.z + box.initial.position.z;

    box.rotation.x = delta.rotation.x + box.initial.rotation.x;
    box.rotation.y = delta.rotation.y + box.initial.rotation.y;
    box.rotation.z = delta.rotation.z + box.initial.rotation.z;
  }
}

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

const entity = new TICK.Entity()
  .add(new Box({ id: box.id, position: box.position, rotation: box.rotation }))
  .append(new Oscilator({ position: { x: 1, y: 0, z: 0 } }))
  .append(new Oscilator({ position: { x: 0, y: -1, z: .5 }, rotation: { x: 1, y: -.2, z: 0 }, method: OscilatorMethod.cos }))

const planeEntity = new TICK.Entity()
  .add(new Box({ id: plane.id, position: plane.position, rotation: plane.rotation }))
  .append(new Oscilator({ position: { x: 0, y: .5, z: 0 } }))

fjsh.engine.addEntity(entity)
fjsh.engine.addEntity(planeEntity)
fjsh.engine.addSystem(new OscilatorSystem())

window.onload = () => fjsh.startup();
