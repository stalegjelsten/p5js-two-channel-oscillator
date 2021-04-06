// this is (mostly) stolen from https://js6450.github.io/sound-p5-part3.html
// original author: Jiwon Shin (http://jiwonshin.com/)
let osc
let playing = false
let frequency
let scalingFactor = 10
let minFrequency = 12

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

        let logFrequency = constrain(map(mouseX, 0, width, 
            log(minFrequency), log(20000)), log(minFrequency), 2e4)
        frequency = exp(logFrequency)

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
    let y = 4/5 * height + height/10 * sin(frequency / (width / TWO_PI) / scalingFactor * x)
    vertex(x,y)
  }
  endShape()
  pop()
}

function mousePressed() {
    if (playing == true) {
        osc.start()
        osc.amp(0)
        playing = false
    } else {
        osc.amp(1)
        playing = true
    }
}
