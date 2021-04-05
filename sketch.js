// this is (mostly) stolen from https://js6450.github.io/sound-p5-part3.html
// original author: Jiwon Shin (http://jiwonshin.com/)
let osc
let playing = false
let frequency
let scalingFactor = 1e5

function setup() {
    createCanvas(windowWidth, windowHeight)

    osc = new p5.Oscillator()
    osc.amp(0)
    osc.start()
    noStroke()
    textSize(20)
}

function draw() {
    if (playing == true) {
        background(101, 148, 105)
        fill(0,70)

        frequency = constrain(map(mouseX, 0, width, -50, 20000), 0, 2e4)

        osc.freq(frequency)
        ellipse(mouseX, height / 2, 100, 100)
        text("Frekvens: " + floor(frequency) + " Hz", width-200, height-20)
        drawSine()
    } else {
        background(127, 186, 132)
    }
}

function drawSine() {
  push()
  noFill()
  stroke(0, 70)
  beginShape()
  for (let x = 0; x <= width; x++) {
    let y = 4/5 * height + height/10 * sin(frequency / scalingFactor * x)
    vertex(x,y)
  }
  endShape()
  pop()
}

function mousePressed() {
    if (playing == true) {
        osc.amp(0)
        playing = false
    } else {
        osc.amp(1)
        playing = true
    }
}