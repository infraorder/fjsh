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

class Gravity extends TICK.LinkedComponent {
  force: FJSH.Vector
  public constructor({ force = new FJSH.Vector() } = {} ) { 

    super();
    this.force = force;
  }
}

class Box {
  position: FJSH.Vector;
  rotation: FJSH.Euler;
  id: number;

  public constructor({ position = new FJSH.Vector(),
    rotation = new FJSH.Euler(),
    id = 0 } = {}) {

    this.position = position;
    this.rotation = rotation;
    this.id = id;
  }
}

class GravitySystem extends TICK.IterativeSystem {
  public constructor() {
    super((entity) => entity.hasAll(Box, Gravity));
  }

  public updateEntity(entity: TICK.Entity, dt: number) {

    const box = entity.get(Box)

    // Let's update all regeneration components on our hero and apply their effects 
    entity.iterate(Gravity, (gravity) => {
      box.position.x += gravity.force.x;
      box.position.y += gravity.force.y;
      box.position.z += gravity.force.z;
    });

    const mesh = fjsh.scene.getObjectById(box.id)
    mesh.position.add(new THREE.Vector3(box.position.x * dt, box.position.y * dt, box.position.z * dt))
  }

  protected entityAdded = ({current}: TICK.EntitySnapshot) => {
    // When new entity appears in the queue, that means that it has Hero and Regeneration
    // so we want to instantly heal the hero by existing Regeneration buffs
    current.iterate(Gravity, (gravity) => {
      this.instantlyApplyGravity(entity, gravity);
    })
    // Also, if any additional Regeneration buff will appear in the entity, we will handle 
    // them as well and instantly heal the hero
    current.onComponentAdded.connect(this.instantlyApplyGravity);
  }

  protected entityRemoved = ({current}: TICK.EntitySnapshot) => {
    // We don't want to know if any new components were added to the entity when it left 
    // the queue already.
    current.onComponentAdded.disconnect(this.instantlyApplyGravity);
  }

  private instantlyApplyGravity = (entity: TICK.Entity, gravity: Gravity) => {
    // We need to filter components, because this function will called on every added 
    // component (not only Regeneration)
    if (!(gravity instanceof Gravity)) return;

    const box = entity.get(Box)!;

    box.position.x += gravity.force.x;
    box.position.y += gravity.force.y;
    box.position.z += gravity.force.z;
  }

}

const orbitControls = new OrbitControls(fjsh.camera, fjsh.renderer.domElement)
orbitControls.enableDamping = true

const geometry = new THREE.BoxGeometry( 1, 1, 1 )
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const box = new THREE.Mesh( geometry, material )
fjsh.scene.add( box )

const entity = new TICK.Entity()
  .add(new Box({ id: box.id }))
  .append(new Gravity({ force: { x: 0, y: -.1, z: 0 } }))
  .append(new Gravity({ force: { x: 0, y: 0, z: -.1 } }))

fjsh.engine.addEntity(entity)
fjsh.engine.addSystem(new GravitySystem())

window.onload = () => fjsh.startup();
