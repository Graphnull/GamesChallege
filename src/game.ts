import 'phaser';
import plasmaBundle from './../assets/plasma-bundle.glsl'
import starfields from './../assets/starfields.glsl'
import logo from './../assets/phaser3-logo.png'
import libspng from './../assets/libs.png'
import * as CANNON from 'cannon-es'

let m = new CANNON.Material({ friction: 0, restitution: 1 })
let bodies: CANNON.Body[] = [];
let images: Phaser.GameObjects.Rectangle[] = []
class Side {
    img: Phaser.GameObjects.Rectangle;
    x: number
    y: number
    body: CANNON.Body
    constructor(context: Scene, x, y) {
        let { world } = context;
        this.img = context.add.rectangle(x, y, 20, 100, 0xaaaaaa);
        images.push(this.img)
        this.x = x
        this.y = y;
        var sphereBody = new CANNON.Body({
            material:m,
            fixedRotation:true,
            linearDamping:0,
            mass: 0, // kg
            position: new CANNON.Vec3(x, y, 0), // m
            shape: new CANNON.Box(new CANNON.Vec3(10, 50, 25))
        });
        this.body = sphereBody
        bodies.push(sphereBody)
        world.addBody(sphereBody);
    }
}
class BB {
    img: Phaser.GameObjects.Rectangle;
    x: number
    y: number
    body: CANNON.Body
    constructor(context: Scene, x, y, w, h) {
        let { world } = context;
        this.img = context.add.rectangle(x, y, w, h, 0xffaaaa);
        images.push(this.img)
        this.x = x;
        this.y = y;
        var sphereBody = new CANNON.Body({
            material:m,
            fixedRotation:true,
            linearDamping:0,
            mass: 0, // kg
            position: new CANNON.Vec3(x, y, 0), // m
            shape: new CANNON.Box(new CANNON.Vec3(w/2, h/2, 25)),
            //type:CANNON.Body.STATIC
        });
        this.body = sphereBody
        bodies.push(sphereBody)
        world.addBody(sphereBody);
    }
}
class Point {
    img: Phaser.GameObjects.Rectangle;
    x: number
    y: number
    body: CANNON.Body
    constructor(context: Scene, x, y) {
        let { world } = context;
        this.img = context.add.rectangle(x, y, 50, 50, 0xaaaaaa);
        images.push(this.img)
        this.x = x;
        this.y = y;
        var sphereBody = new CANNON.Body({
            material:m,
            fixedRotation:true,
            linearDamping:0,
            mass: 5, // kg
            position: new CANNON.Vec3(x, y, 0), // m
            velocity: new CANNON.Vec3(-100, -100, 0), // m
            shape: new CANNON.Box(new CANNON.Vec3(25, 25, 25))
        });
        this.body = sphereBody
        bodies.push(sphereBody)
        world.addBody(sphereBody);
    }
}
export default class Scene extends Phaser.Scene {
    constructor() {
        super('demo');
    }

    preload() {
        /*
        this.load.image('logo', logo);
        this.load.image('libs', libspng);
        this.load.glsl('bundle', plasmaBundle);
        this.load.glsl('stars', starfields);*/
    }
    world: CANNON.World
    create() {
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, 0, 0) // m/s²
        });
        let keyw = this.input.keyboard.addKey('W')
        let keys = this.input.keyboard.addKey('S')
        //this.input.keyboard.checkDown(keyd(e)=>{console.log(e)})
        /*
        // Create a plane
        var groundBody = new CANNON.Body({
            position: new CANNON.Vec3(0, 300, 0), // m
            
            mass: 0 // mass == 0 makes the body static
        });
        var groundShape = new CANNON.Plane();
        groundBody.addShape(groundShape);
        this.world.addBody(groundBody);*/

        let b1 = new BB(this, 400, 0-20,800,40)
        let b2 = new BB(this, 400, 600+20,800,40)
        //let b3 = new BB(this, 0, 300,40,600)
        //this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

        //this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);
        let left = new Side(this, 0, 300);


        let right = new Side(this, 800 - 5, 300);
        let point = new Point(this, 400, 300);


        (async () => {
            let iter = 0;
            let startTime = Date.now();
            let fps = 60
            let stepTime = (1 / fps) * 1000
            while (1) {
            
                iter%10===0 && console.log('t',(startTime + (iter + 1) * stepTime) - Date.now());
                await new Promise((res) => setTimeout(res, (startTime + (iter + 1) * stepTime) - Date.now()))
                this.world.step(1.0 / fps, stepTime, 1);
            
                if(keyw.isDown){
                    left.body.position.y=Math.min(Math.max(left.body.position.y-30,0),600)
                }
                if(keys.isDown){
                    left.body.position.y=Math.min(Math.max(left.body.position.y+30,0),600)
                }
                bodies.forEach((b, i) => {
                    images[i].setRotation(b.quaternion.z*180)
                    images[i].setPosition(b.position.x, b.position.y)
                })

                iter++;
            }
        })()

        //let img = this.add.image(400, 300, 'libs');
        //const logo = this.add.image(400, 70, 'logo');


        /*this.tweens.add({
            targets: logo,
            y: 350,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        })*/
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    width: 800,
    height: 600,
    scene: Scene
};

const game = new Phaser.Game(config);
