import * as THREE from 'three'
import * as TICK from 'tick-knock'

// FJSH {{{
export class App {

  engine:     TICK.Engine;

  scene:      THREE.Scene;
  // orthographic camera
  // TODO - allow this to be persepctive too
  camera:     OrthographicCamera;
  clock:      THREE.Clock;
  ambient:    THREE.AmbientLight;
  renderer:   THREE.WebGLRenderer;
  debug:      boolean;

  // CONSTRUCTOR {{{
  constructor({ debug = false,
      sceneBackground = new THREE.Color( "#fee" ),
      renderer = { antialias: true },
      camera = new OrthographicCamera({ frustumSize: 20, 
        aspect: window.innerWidth / window.innerHeight,
        near: 0, 
        far: 1000 }) } = {}) {

    this.scene = new THREE.Scene();
    this.scene.background = sceneBackground;
    this.debug = debug;

    this.camera = camera;
    this.scene.add(camera);

    this.clock = new THREE.Clock();

    this.renderer = new THREE.WebGLRenderer( renderer );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    // ecs
    this.engine = new TICK.Engine();
  }
  // }}}

  // not in constructor as this would mean user would not be able to
  // set .setup .loop and .resize beforehand
  // startup would have to be called manually
  startup = ( ) => {

    document.body.appendChild( this.renderer.domElement );

    this.camera.position.y = 1;
    this.camera.position.x = 1;
    this.camera.position.z = 1;

    this.camera.lookAt(new THREE.Vector3(0, 0, 0))

    window.addEventListener( 'resize', () => {

      this.camera.update( window.innerWidth / window.innerHeight )
      this.renderer.setSize( window.innerWidth, window.innerHeight )
    } );
    this.tick();
  }

  // TODO - implement 👷
  // 💡GENERAL IDEA - call each object within each region ( this should 
  //   maybe be done in order of closeness to the 📦player/🎥camera )
  tick = async () => {
    
    // this.engine.update();
    // this.world.step() // TODO - finish
    this.engine.update(this.clock.getDelta())
    this.renderer.render( this.scene, this.camera )
    window.requestAnimationFrame( this.tick )
  }
}
// }}} FJSH
// VECTOR3 {{{
export class Vector {

  x: number;
  y: number;
  z: number;

  constructor({ x = 0, y = 0, z = 0 } = {}) {

    this.x = x;
    this.y = y;
    this.z = z;
  }
}
// }}} VECTOR3
// VECTOR2 {{{
export class Vector2 {

  x: number;
  y: number;

  constructor({ x = 0, y = 0 } = {}) {

    this.x = x;
    this.y = y;
  }
}
// }}} VECTOR2
// VELOCITY2 {{{
export class Velocity2 {

  x: number;
  y: number;

  constructor({ x = 0, y = 0 } = {}) {

    this.x = x;
    this.y = y;
  }
}
// }}} VELOCITY2
// EULER {{{
export class Euler {

  x: number;
  y: number;
  z: number;
  order: string;

  constructor({ x = 0, y = 0, z = 0, order = "XYZ" } = {}) {
    
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }
}
// }}} EULER 
// TRANSFORM {{{
export class Transform extends TICK.LinkedComponent {

  position: Vector;
  rotation: Euler;
  constructor({ position = new Vector(), rotation = new Euler() } = {}) {

    super();
    
    this.position = position;
    this.rotation = rotation;
  }
}
// }}} TRANSFORM
// ORTHOGRAPHICCAMERA {{{
export class OrthographicCamera extends THREE.OrthographicCamera {

  frustumSize: number;

  constructor({ frustumSize = 0, aspect = 0, near = 1000, far = 0 } = {}) {

    super( ( frustumSize * aspect ) / -2,
      ( frustumSize * aspect ) / 2,
      frustumSize / 2,
      frustumSize / -2,
      near,
      far );

    this.frustumSize = frustumSize;
  }

  update = (aspect: number) => {

    this.left   = ( this.frustumSize * aspect ) / -2;
    this.right  = ( this.frustumSize * aspect ) /  2;
    this.top    = this.frustumSize /  2;
    this.bottom = this.frustumSize / -2;
    
    this.updateProjectionMatrix();
  }
}
// }}} ORTHOGRAPHICCAMERA
// UTIL {{{
export const Util = {
  range: (n: number) => Array.from({length: n}, (_v, k) => k),
  random: (scale = 2) => (0.5 - Math.random()) * scale,
}
// }}} UTIL
