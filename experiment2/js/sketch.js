// sketch.js - purpose and description here
// Author: Ziyuan Wang
// Date: 4/16/2024

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
  constructor(param1, param2) {
    this.property1 = param1;
    this.property2 = param2;
  }

  myMethod() {
    // code to run when method is called
  }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
// Generated with help of GPT
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass(VALUE1, VALUE2);

  // Create "reimagine" button
  let reimagineButton = createButton('Reimagine');
  reimagineButton.mousePressed(reimagine);
  reimagineButton.parent('canvas-container'); // Adjust this if you have a specific element to attach the button to

  // set up window resizing
  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();
}

// Reimagine button event handler
function reimagine() {
  seed++;
}


let seed = 347;

const nightSkyColor = "#0b3f6b";
const sunsetStartColor = "#0b3f6b"; // deep blue color at the top of the sunset
const sunsetEndColor = "#ff8c00"; // orange color at the bottom of the sunset
const mountainColor = "#2e3b44";
const starColor = "#ffffff";

// function setup() {
//   createCanvas(400, 200);
//   createButton("reimagine").mousePressed(() => seed++);
// }

function draw() {
  randomSeed(seed);

  // Calculate parallax offset based on mouse position
  let parallaxX = map(mouseX, 0, width, -50, 50);
  let parallaxY = map(mouseY, 0, height, -50, 50);

  background(nightSkyColor);

  noStroke();

  // Draw sunset gradient
  for (let i = height / 2; i < height; i++) {
    let inter = map(i, height / 2, height, 0, 1);
    let c = lerpColor(color(sunsetStartColor), color(sunsetEndColor), inter);
    fill(c);
    rect(0, i, width, 1);
  }

  // Draw static stars with parallax effect
  for (let i = 0; i < 100; i++) {
    let starX = random(width) - parallaxX * 0.25; // stars move less
    let starY = random(height * 0.5) - parallaxY * 0.25;
    let starSize = random(1, 3);
    fill(starColor);
    circle(starX, starY, starSize);
  }

  // Calculate the mountain peak positions without parallax
  let peaks = [];
  let lastPeakX = 0;
  let lastPeakY = height * 0.3;
  for (let i = 0; i < 3; i++) {
    let peakX = random(lastPeakX, width * 0.8);
    let peakY = random(lastPeakY, height * 0.5);
    lastPeakX = peakX;
    lastPeakY = peakY;
    peaks.push({ x: peakX, y: peakY });
  }

  // Apply parallax to the entire mountain shape
  fill(mountainColor);
  beginShape();
  vertex(-50 - parallaxX * 0.5, 50 + height - parallaxY * 0.25);
  for (let peak of peaks) {
    vertex(peak.x - parallaxX * 0.5, peak.y - parallaxY * 0.5);
  }
  vertex(50 + width - parallaxX * 0.5, 50 + height - parallaxY * 0.25);
  endShape(CLOSE);

  // Draw snow on the mountain
  fill('#FFF'); // Snow color
  for (let peak of peaks) {

    beginShape();
    let snowCapY = 30 + peak.y - parallaxY * 0.5 - random(20, 40); // Randomize the snow cap height
    vertex(peak.x - parallaxX * 0.5, snowCapY); // Top Left of the snow cap
    vertex(peak.x - parallaxX * 0.5 - random(20, 40), snowCapY + 80); // Left base of the snow cap
    vertex(peak.x - parallaxX * 0.5 + random(40, 60), snowCapY + 80); // Right base of the snow cap
    vertex(peak.x - parallaxX * 0.5 + random(10, 20), snowCapY); // Top Right of the snow cap
    endShape(CLOSE);

  }

  // Mouse interactive shooting star
  fill(starColor);
  let starX = map(mouseX, 0, width, 0, width, true);
  let starY = map(mouseY, 0, height, 0, height * 0.5, true);
  star(starX, starY, 5, 10, 5);

  //Draw twinkling stars
  drawTwinklingStars();
}

// Mouse interactive shooting star function
// Generated with help of GPT
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);


}

//Draw twinkling stars function
// Generated with help of GPT
function drawTwinklingStars() {
  let numTwinklingStars = 30;
  let maxStarSize = 5;

  for (let i = 0; i < numTwinklingStars; i++) {
    let parallaxX = map(mouseX, 0, width, -50, 50);
    let parallaxY = map(mouseY, 0, height, -50, 50);


    let starX = random(width) - parallaxX * 0.25;
    let starY = random(height * 0.5) - parallaxY * 0.25;

    // Apply sinusoidal motion to the star's brightness
    let brightness = 150 + sin((2 * PI * millis()) / (500 + i * 100)) * 105;
    fill(brightness);

    // Apply sinusoidal motion to the star's Size
    let starSize = random(1, maxStarSize) * (0.5 + sin((2 * PI * millis()) / (500 + i * 100)) / 2);
    ellipse(starX, starY, starSize, starSize);
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  // code to run when mouse is pressed
}