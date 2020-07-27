let numBoids = 100;
const flock = [];
let bird, bg;

// constants to adjust
const alignmentFactor = 1.5;
const cohesionFactor = 0.8;
const separationFactor = 1.8;
const wallAvoidanceFactor = 2.5;

const separationPerception = 25;
const alignmentPerception = 25;
const cohesionPerception = 30;

function preload() {
	bird = loadImage("assets/bird.png");
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
		const alignment = boid.alignment(flock, alignmentPerception);
		const cohesion = boid.cohesion(flock, cohesionPerception);
		const separation = boid.separation(flock, separationPerception);
		const wallAvoidance = boid.avoidWalls();

		alignment.mult(alignmentFactor);
		cohesion.mult(cohesionFactor);
		separation.mult(separationFactor);
		wallAvoidance.mult(wallAvoidanceFactor);

		boid.acceleration.add(alignment);
		boid.acceleration.add(cohesion);
		boid.acceleration.add(separation);
		boid.acceleration.add(wallAvoidance);

		boid.update();
		boid.show();
	}
}
