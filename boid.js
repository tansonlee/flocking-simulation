class Boid {
	constructor() {
		this.position = createVector(random(width), random(height));
		this.velocity = createVector(random(-4.5, 4.5), random(-4.5, 4.5));
		this.acceleration = createVector(0, 0);
		this.maxForce = 0.22;
		this.maxSpeed = 3;
	}

	show() {
		push();
		translate(this.position.x, this.position.y);
		rotate(this.velocity.heading() + HALF_PI);
		image(img, 0, 0, 15, 6);
		pop();
	}

	update() {
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.acceleration.mult(0);

		if (this.position.x < 0) {
			this.position.x = width;
		} else if (this.position.x > width) {
			this.position.x = 0;
		}

		if (this.position.y < 0) {
			this.position.y = height;
		} else if (this.position.y > height) {
			this.position.y = 0;
		}
	}

	// #1 Separation
	separation(flock) {
		const perception = 24;
		let desired = createVector(0, 0);
		let boidsInPerception = 0;

		for (let boid of flock) {
			const d = dist(
				this.position.x,
				this.position.y,
				boid.position.x,
				boid.position.y
			);

			if (boid != this && d < perception) {
				let difference = p5.Vector.sub(this.position, boid.position);
				difference.div(d * d);
				desired.add(difference);
				boidsInPerception++;
			}
		}
		if (boidsInPerception > 0) {
			desired.div(boidsInPerception);
			desired.setMag(this.maxSpeed);
			desired.sub(this.velocity);
			desired.limit(this.maxForce);
		}

		return desired;
	}

	//  #2 Alignment
	alignment(flock) {
		const perception = 25;
		let desired = createVector(0, 0);
		let boidsInPerception = 0;

		for (let boid of flock) {
			const d = dist(
				this.position.x,
				this.position.y,
				boid.position.x,
				boid.position.y
			);

			if (boid != this && d < perception) {
				desired.add(boid.velocity);
				boidsInPerception++;
			}
		}
		if (boidsInPerception > 0) {
			desired.div(boidsInPerception);
			desired.setMag(this.maxSpeed);
			desired.sub(this.velocity);
			desired.limit(this.maxForce);
		}

		return desired;
	}

	// #3 Cohesion
	cohesion(flock) {
		const perception = 30;
		let desired = createVector(0, 0);
		let boidsInPerception = 0;

		for (let boid of flock) {
			const d = dist(
				this.position.x,
				this.position.y,
				boid.position.x,
				boid.position.y
			);

			if (boid != this && d < perception) {
				desired.add(boid.position);
				boidsInPerception++;
			}
		}

		if (boidsInPerception > 0) {
			desired.div(boidsInPerception);
			desired.sub(this.position);
			desired.setMag(this.maxSpeed);
			desired.sub(this.velocity);
			desired.limit(this.maxForce);
		}

		return desired;
	}

	// avoid walls
	avoidWalls() {
		let desired = createVector(0, 0);

		// top
		const dTop = this.position.y;
		if (dTop > 0) {
			const topForce = wallForce(dTop);
			if (topForce > 0) {
				desired.y += topForce;
			}
		}

		// bottom
		const dBottom = height - this.position.y;
		if (dBottom > 0) {
			const bottomForce = wallForce(dBottom);
			if (bottomForce > 0) {
				desired.y -= bottomForce;
			}
		}

		// left
		const dLeft = this.position.x;
		if (dLeft > 0) {
			const leftForce = wallForce(dLeft);
			if (leftForce > 0) {
				desired.x += leftForce;
			}
		}

		// right
		const dRight = width - this.position.x;
		if (dRight > 0) {
			const rightForce = wallForce(dRight);
			if (rightForce > 0) {
				desired.x -= rightForce;
			}
		}
		desired.limit(this.maxForce);
		return desired;
	}
}

const wallForce = d => {
	return -0.4 * log(0.015 * d);
};
