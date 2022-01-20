import * as THREE from 'three';
import * as TICK from 'tick-knock';
import { AnimeParams, AnimeInstance } from 'animejs';
import anime from 'animejs';
import { nanoid } from 'nanoid'

// FJSH {{{
class App {

  engine:     TICK.Engine;

  scene:      THREE.Scene;
  // orthographic camera
  // TODO - allow this to be persepctive too
  camera:     OrthographicCamera;
  clock:      THREE.Clock;
  renderer:   THREE.WebGLRenderer;
  debug:      boolean;

  // CONSTRUCTOR {{{
  constructor({ debug = false,
      sceneBackground = new THREE.Color( "#fee" ),
      renderer = { antialias: true },
      camera = new OrthographicCamera({ frustumSize: 20, 
        aspect: window.innerWidth / window.innerHeight,
        near: -100, 
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
    this.engine.update(this.clock.getElapsedTime())
    this.renderer.render( this.scene, this.camera )
    window.requestAnimationFrame( this.tick )
  }
}
// }}} FJSH
// VECTOR3 {{{
class Vector {

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
class Vector2 {

  x: number;
  y: number;

  constructor({ x = 0, y = 0 } = {}) {

    this.x = x;
    this.y = y;
  }
}
// }}} VECTOR2
// VELOCITY2 {{{
class Velocity2 {

  x: number;
  y: number;

  constructor({ x = 0, y = 0 } = {}) {

    this.x = x;
    this.y = y;
  }
}
// }}} VELOCITY2
// EULER {{{
class Euler {

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
class Transform extends TICK.LinkedComponent {

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
class OrthographicCamera extends THREE.OrthographicCamera {

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

enum AnimationMethods {

  sin,
  cos,
}

// }}} ORTHOGRAPHICCAMERA
// ANIMATIONEASINGS {{{
enum AnimationEasings {
  linear = "linear",
  easeInQuad = "easeInQuad",
  easeInCubic = "easeInCubic",
  easeInQuart = "easeInQuart",
  easeInQuint = "easeInQuint",
  easeInSine = "easeInSine",
  easeInExpo = "easeInExpo",
  easeInCirc = "easeInCirc",
  easeInBack = "easeInBack",
  easeInElastic = "easeInElastic",
  easeInBounce = "easeInBounce",
  easeOutQuad = "easeOutQuad",
  easeOutCubic = "easeOutCubic",
  easeOutQuart = "easeOutQuart",
  easeOutQuint = "easeOutQuint",
  easeOutSine = "easeOutSine",
  easeOutExpo = "easeOutExpo",
  easeOutCirc = "easeOutCirc",
  easeOutBack = "easeOutBack",
  easeOutElastic = "easeOutElastic",
  easeOutBounce = "easeOutBounce",
  easeInOutQuad = "easeInOutQuad",
  easeInOutCubic = "easeInOutCubic",
  easeInOutQuart = "easeInOutQuart",
  easeInOutQuint = "easeInOutQuint",
  easeInOutSine = "easeInOutSine",
  easeInOutExpo = "easeInOutExpo",
  easeInOutCirc = "easeInOutCirc",
  easeInOutBack = "easeInOutBack",
  easeInOutElastic = "easeInOutElastic",
  easeInOutBounce = "easeInOutBounce"
}
// }}}
// ANIMATIONCOMPONENT {{{
class Animation extends TICK.LinkedComponent {
  
  id = Util.genId();
  options: AnimeParams;
    
  constructor(options: AnimeParams) {

    super();
    this.options = options;
    this.options.autoplay = false;
  }
}
// }}} ANIMATIONCOMPONENT
// ANIMATIONSYSTEM {{{
class AnimationSystem extends TICK.IterativeSystem {
  animations: Map<string, AnimeInstance>;

  public constructor() {
    super((entity) => entity.hasAll(Transform, Animation));
    this.animations = new Map()
  }

  public updateEntity(entity: TICK.Entity) {

    entity.iterate(Animation, (animation) => {

      const anim = this.animations.get(animation.id)!;

      anim.tick(Date.now()) // TODO - find a way to override tick... don't like the fact that this computes dt twice
    })
  }

  protected entityAdded = ({current}: TICK.EntitySnapshot) => {

    current.iterate(Animation, (animation) => {
      
      const transform = current.get(Transform)!;

      animation.options.targets = transform.position
      this.animations.set(animation.id, anime(animation.options))
    })
  }

  protected entityRemoved = ({current}: TICK.EntitySnapshot) => {

    current.iterate(Animation, (animation) => {

      this.animations.delete(animation.id)
    })
  }
}
// }}} ANIMATIONSYSTEM
// UTIL {{{
const Util = {
  range: (n: number) => Array.from({length: n}, (_v, k) => k),
  random: (scale = 2) => (0.5 - Math.random()) * scale,
  genId: () => nanoid()
}
// }}} UTIL

const FJSH = {
  App,
  Vector2,
  Vector,
  Velocity2,
  Euler,
  Transform,
  OrthographicCamera,
  AnimationEasings,
  Animation,
  AnimationSystem,
  Util,
}

export {
  FJSH,
  THREE
}
