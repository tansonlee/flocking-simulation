class Boid {
	constructor() {
		this.position = createVector(random(width), random(height));
		this.velocity = createVector(random(-4.5, 4.5), random(-4.5, 4.5));
		this.acceleration = createVector(0, 0);
		this.maxForce = 0.2;
		this.speed = 3;
		this.viewAngle = TWO_PI;
	}

	show() {
		push();
		translate(this.position.x, this.position.y);
		rotate(this.velocity.heading() + HALF_PI); // have the bird face its heading
		image(bird, 0, 0, 15, 6);
		pop();
	}

	update() {
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.speed);
		this.acceleration.mult(0);

		// wrap edges
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

	// #1 Separation : keep distance from the boids in the local vicinity
	separation(flock, perception) {
		let boidsInPerception = 0;
		let sumOfSeperationVectors = createVector(0, 0);

		// find the sum of all seperation vectors and number of boids in the local flock
		for (let boid of flock) {
			const d = dist(
				this.position.x,
				this.position.y,
				boid.position.x,
				boid.position.y
			);

			if (boid !== this && d < perception) {
				const difference = p5.Vector.sub(this.position, boid.position);
				// difference vector inversely proportional to distance between boids
				difference.div(d * d);

				sumOfSeperationVectors.add(difference);
				boidsInPerception++;
			}
		}

		if (boidsInPerception > 0) {
			// calculate the average vector for separation and normalize
			const averageSeperationVector = p5.Vector.div(
				sumOfSeperationVectors,
				boidsInPerception
			);
			averageSeperationVector.setMag(this.speed);

			// calculate vector required to make this.vector into the separation vector
			const steering = p5.Vector.sub(
				averageSeperationVector,
				this.velocity
			);
			steering.limit(this.maxForce);
			return steering;
		}

		return createVector(0, 0);
	}

	// #2 Alignment : align with the average velocity of the local flock
	alignment(flock, perception) {
		let boidsInPerception = 0;
		const sumOfVelocities = createVector(0, 0);

		// calculate quantity and sum of velocities for all boids in the local flock
		for (let boid of flock) {
			const d = dist(
				this.position.x,
				this.position.y,
				boid.position.x,
				boid.position.y
			);

			// check if the boid is within the perception range
			if (boid !== this && d < perception) {
				// check if the boid is in front (PI / 3)
				// find the angle between this.velocity and difference in position vector
				// -PI / 6 < angle < PI / 6
				const diffPosition = p5.Vector.sub(
					boid.position,
					this.position
				);
				const angleBetween = this.velocity.angleBetween(diffPosition);

				if (
					angleBetween >= -this.viewAngle / 2 &&
					angleBetween < this.viewAngle / 2
				) {
					sumOfVelocities.add(boid.velocity);
					boidsInPerception++;
				}
			}
		}

		if (boidsInPerception > 0) {
			// find the average velocity and normalize
			const averageVelocity = p5.Vector.div(
				sumOfVelocities,
				boidsInPerception
			);
			averageVelocity.setMag(this.speed);

			// calculate desired velocity
			const steer = p5.Vector.sub(averageVelocity, this.velocity);
			steer.limit(this.maxForce);
			return steer;
		}

		return createVector(0, 0);
	}

	// #3 Cohesion : steer toward the average position of the local flock
	cohesion(flock, perception) {
		let boidsInPerception = 0;
		const sumOfPositions = createVector(0, 0);

		// calculate quantity and sum of positions for all boids in the local flock
		for (let boid of flock) {
			const d = dist(
				this.position.x,
				this.position.y,
				boid.position.x,
				boid.position.y
			);

			if (boid !== this && d < perception) {
				// check if the boid is in front (PI / 3)
				// find the angle between this.velocity and difference in position vector
				// -PI / 6 < angle < PI / 6
				const diffPosition = p5.Vector.sub(
					boid.position,
					this.position
				);
				const angleBetween = this.velocity.angleBetween(diffPosition);

				if (
					angleBetween >= -this.viewAngle / 2 &&
					angleBetween < this.viewAngle / 2
				) {
					sumOfPositions.add(boid.position);
					boidsInPerception++;
				}
			}
		}

		if (boidsInPerception > 0) {
			const averagePosition = p5.Vector.div(
				sumOfPositions,
				boidsInPerception
			);

			// desired velocity to go to the centre
			const desired = p5.Vector.sub(averagePosition, this.position);
			desired.setMag(this.speed);

			// velocity required to make current velocity change to desired
			const steer = p5.Vector.sub(desired, this.velocity);
			steer.limit(this.maxForce);
			return steer;
		}

		return createVector(0, 0);
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
