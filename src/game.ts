import 'phaser';
import plasmaBundle from './../assets/plasma-bundle.glsl'
import starfields from './../assets/starfields.glsl'
import logo from './../assets/phaser3-logo.png'
import libspng from './../assets/libs.png'
import * as CANNON from 'cannon-es'

let bodies: CANNON.Body[] = [];
let images: Phaser.GameObjects.Rectangle[] = []
class Side {
    img: Phaser.GameObjects.Rectangle;
    x: number
    y: number
    body: CANNON.Body
    constructor(context: Scene, x, y) {
        let { world } = context;
        this.img = context.add.rectangle(x, y, 5, 5, 0xaaaaaa);
        images.push(this.img)
        this.x = x
        this.y = y;
        var radius = 10; // m
        var sphereBody = new CANNON.Body({
            mass: 5, // kg
            position: new CANNON.Vec3(x, y, 0), // m
            shape: new CANNON.Sphere(radius)
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
        this.img = context.add.rectangle(x, y, 5, 5, 0xaaaaaa);

        images.push(this.img)
        this.x = x
        this.y = y;
        var radius = 10; // m
        var sphereBody = new CANNON.Body({
            mass: 5, // kg
            position: new CANNON.Vec3(x, y, 0), // m
            velocity: new CANNON.Vec3(-10, -10, 0), // m
            shape: new CANNON.Sphere(radius)
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
        // Create a plane
        var groundBody = new CANNON.Body({
            mass: 0 // mass == 0 makes the body static
        });
        var groundShape = new CANNON.Plane();
        groundBody.addShape(groundShape);
        this.world.addBody(groundBody);
        //this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

        //this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);
        let left = new Side(this, 0, 300);

        let right = new Side(this, 800 - 5, 300);
        let point = new Point(this, 400, 300);


        (async () => {
            let iter = 0;
            let startTime = Date.now();
            let stepTime = (1 / 60) * 1000
            while (1) {
                await new Promise((res) => setTimeout(res, (startTime + (iter + 1) * stepTime) - Date.now()))
                this.world.step(1.0 / 60.0, stepTime, 3);
                bodies.forEach((b, i) => {
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
