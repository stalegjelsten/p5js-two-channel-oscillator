// this is (mostly) stolen from https://js6450.github.io/sound-p5-part3.html
// original author: Jiwon Shin (http://jiwonshin.com/)
let osc
let playing = false
let frequency
let scalingFactor = 1
let minFrequency = 12
let slider

function setup() {
    createCanvas(windowWidth, windowHeight-30)
    osc = new p5.Oscillator('sine')

    createSpan("Juster definisjonsmengden: ")
    slider = createSlider(1, 20, 1, 1)
    noStroke()
    textSize(20)
}

function draw() {
    fill(0,70)
    if (playing == true) {
        background(101, 148, 105)
        textAlign(LEFT)
        text("t = 0", 10, height-50)
        

        let logFrequency = constrain(map(mouseX, 0, width, 
            log(minFrequency), log(20000)), log(minFrequency), 2e4)
        frequency = exp(logFrequency)

        osc.freq(frequency)
        ellipse(mouseX, height / 2, 100, 100)
        textAlign(RIGHT)
        text("Frekvens: " + floor(frequency) + " Hz", width-10, height-20)
        text("t = " + 1/scalingFactor + " sek", width-10, height-50)
        drawSine()
    } else {
        background(127, 186, 132)
    }
    scalingFactor = slider.value()
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

function playSine() {
    if (playing == true) {
        osc.amp(0, 0.5)
        playing = false
    } else {
        osc.start()
        osc.amp(1, 0.5)
        playing = true
    }
}

function mousePressed(){
    playSine()
}