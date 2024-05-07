// sketch.js - purpose and description here
// Author: Ziyuan Wang
// Date: 5/7/2024

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
/* exported preload, setup, draw */
/* global memory, dropper, restart, rate, slider, activeScore, bestScore, fpsCounter */
/* global p4_inspirations, p4_initialize, p4_render, p4_mutate */

let bestDesign;
let currentDesign;
let currentScore;
let currentInspiration;
let currentCanvas;
let currentInspirationPixels;

function preload() {
  

  let allInspirations = p4_inspirations();

  for (let i = 0; i < allInspirations.length; i++) {
    let insp = allInspirations[i];
    insp.image = loadImage(insp.assetUrl);
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = insp.name;
    dropper.appendChild(option);
  }
  dropper.onchange = e => inspirationChanged(allInspirations[e.target.value]);
  currentInspiration = allInspirations[0];

  restart.onclick = () =>
    inspirationChanged(allInspirations[dropper.value]);
}

function inspirationChanged(nextInspiration) {
  currentInspiration = nextInspiration;
  currentDesign = undefined;
  memory.innerHTML = "";
  setup();
}



function setup() {
  currentCanvas = createCanvas(width, height);
  currentCanvas.parent(document.getElementById("active"));
  currentScore = Number.NEGATIVE_INFINITY;
  currentDesign = p4_initialize(currentInspiration);
  bestDesign = currentDesign;
  image(currentInspiration.image, 0,0, width, height);
  loadPixels();
  currentInspirationPixels = pixels;
}

function evaluate() {
  loadPixels();

  let error = 0;
  let n = pixels.length;
  
  for (let i = 0; i < n; i++) {
    error += sq(pixels[i] - currentInspirationPixels[i]);
  }
  return 1/(1+error/n);
}



function memorialize() {
  let url = currentCanvas.canvas.toDataURL();

  let img = document.createElement("img");
  img.classList.add("memory");
  img.src = url;
  img.width = width;
  img.heigh = height;
  img.title = currentScore;

  document.getElementById("best").innerHTML = "";
  document.getElementById("best").appendChild(img.cloneNode());

  img.width = width / 2;
  img.height = height / 2;

  memory.insertBefore(img, memory.firstChild);

  if (memory.childNodes.length > memory.dataset.maxItems) {
    memory.removeChild(memory.lastChild);
  }
}

let mutationCount = 0;

function draw() {
  
  if(!currentDesign) {
    return;
  }
  randomSeed(mutationCount++);
  currentDesign = JSON.parse(JSON.stringify(bestDesign));
  rate.innerHTML = slider.value;
  p4_mutate(currentDesign, currentInspiration, slider.value/100.0);
  
  randomSeed(0);
  p4_render(currentDesign, currentInspiration);
  let nextScore = evaluate();
  activeScore.innerHTML = nextScore;
  if (nextScore > currentScore) {
    currentScore = nextScore;
    bestDesign = currentDesign;
    memorialize();
    bestScore.innerHTML = currentScore;
  }
  
  fpsCounter.innerHTML = Math.round(frameRate());

  image(currentInspiration.image, width, 0, width, height);
}

/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function p4_inspirations() {
  return [{
        name: "dusk",
        assetUrl:
          "https://cdn.glitch.global/b2a25a58-777e-40dc-adc4-f60e3b3e744f/dusk.jpg?v=1715020550784",
        credit:
          "https://i.pinimg.com/736x/ba/d9/0d/bad90d862bef011a71290be498b3bd4d.jpg",
    
      },
      {
        name: "dawn",
        assetUrl:
          "https://cdn.glitch.global/b2a25a58-777e-40dc-adc4-f60e3b3e744f/dawn.jpg?v=1715020591433",
        credit: "https://i.pinimg.com/564x/db/63/58/db6358b98afd0d48a48389ce172a9c17.jpg",
      },
      {
        name: "colors",
        assetUrl:
          "https://cdn.glitch.global/b2a25a58-777e-40dc-adc4-f60e3b3e744f/colors.jpg?v=1715020593074",
        credit:
          "https://i.pinimg.com/564x/61/b9/b7/61b9b73ec4fb65d13eda369a9d4464ff.jpgg",
      }];
}
function p4_initialize(inspiration) {
 
  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);

  let design = {
    bg: 128,
    rectangles: []
  };

  // Initialize rectangles with random positions and sizes
  for (let i = 0; i < 100; i++) {  
    let x = random(width);
    let y = random(height);
    let rectWidth = random(20, width / 4); // Random width between 20px and quarter canvas width
    let rectHeight = random(20, height / 4); // Random height between 20px and quarter canvas height

    // Sample the color at the rectangle's center position
    let col = inspiration.image.get(x + rectWidth / 2, y + rectHeight / 2);
    design.rectangles.push({
      x: x,
      y: y,
      width: rectWidth,
      height: rectHeight,
      fill: color(col[0], col[1], col[2]) // Use the sampled color
    });
  }

   // Add the inspiration image to the canvas
   //Generated with the help of GPT
   let canvasContainer = $('.image-container'); 
   let canvasWidth = canvasContainer.width(); 
   const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
   $('#inspiration').empty();
   $('#inspiration').append(imgHTML);

  return design;
}



//Generated with the help of GPT
function p4_render(design, inspiration) {
  
  background(design.bg);

  // Use a different variable name to avoid overshadowing the p5.js 'rect' function
  design.rectangles.forEach(r => {
    fill(r.fill);
    
    rect(r.x, r.y, r.width, r.height);  // Ensure this is calling the p5.js 'rect' function
  });
}





function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}

function p4_mutate(design, inspiration, rate) {
  // Mutate the background color and each rectangle's properties
  design.bg = mut(design.bg, 0, 255, rate);

  design.rectangles.forEach(rect => {
    // Mutate position, size potentially
    rect.x = mut(rect.x, 0, width - rect.width, rate);
    rect.y = mut(rect.y, 0, height - rect.height, rate);

    // Sample new color based on possibly new position
    let col = inspiration.image.get(rect.x + rect.width / 2, rect.y + rect.height / 2);
    rect.fill = color(col[0], col[1], col[2]);
  });
}


// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}