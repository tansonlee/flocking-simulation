let numBoids = 120;
let flock = [];
let img;

const alignmentFactor = 1.5;
const cohesionFactor = 0.8;
const separationFactor = 2;

function preload() {
	img = loadImage("assets/bird.png");
	bg = loadImage("assets/beach.png");
}

function setup() {
	createCanvas(800, 600);

	for (let i = 0; i < numBoids; i++) {
		flock.push(new Boid());
	}
}

function draw() {
	clear();
	image(bg, 0, 0);
	for (let boid of flock) {
		let alignment = boid.alignment(flock);
		let cohesion = boid.cohesion(flock);
		let separation = boid.separation(flock);
		let avoidWalls = boid.avoidWalls();

		alignment.mult(alignmentFactor);
		cohesion.mult(cohesionFactor);
		separation.mult(separationFactor);
		avoidWalls.mult(2.5);

		boid.acceleration.add(alignment);
		boid.acceleration.add(cohesion);
		boid.acceleration.add(separation);
		boid.acceleration.add(avoidWalls);

		boid.update();
		boid.show();
	}
}
