# Boid Flocking Simulation

### A flocking simulation made with the Boid algorithm

Made with JavaScript and visualized with the p5.js library

<img src="assets/flocking-simulation.gif" width="600px">

The boid algorithm consists of 3 rules which apply to the local flock (within a perception distance and a viewing angle):

|Rule|Description|
|----|----|
|<img src="assets/separation.png" width="200px" align="left"> |**Separation**: Each boid steers to avoid colliding with other boids in the local flock|
|<img src="assets/alignment.png" width="200px"> |**Alignment**: Each boid steers to align its velocity with that of the local flock|
|<img src="assets/cohesion.png" width="200px"> |**Cohesion**: Each boid steers toward to centre of the local flock|

<br>
<br>
<br>

Sources: <br>
https://en.wikipedia.org/wiki/Boids <br>
https://www.youtube.com/watch?v=mhjuuHl6qHM&vl=en
