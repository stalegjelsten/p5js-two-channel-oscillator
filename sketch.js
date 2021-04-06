// A Sine Wave generator in p5.js. Written by Ståle Gjelsten
// Hosted at: https://stalegjelsten.github.io/p5js-sine-generator/
//
//
// the source code for this project is (mostly) stolen from 
// https://js6450.github.io/sound-p5-part3.html and later it's been heavily
// modified. 
// original author: Jiwon Shin (http://jiwonshin.com/)


// initializing an oscillator object
let osc

function setup() {
    createCanvas(windowWidth, windowHeight)

    // creating a new oscillator object wrapped in the SineOscillator class
    osc = new SineOscillator()


    // setting up the GUI control interface
    let gui = new dat.GUI();
    gui.add(osc, "minFrequency", 1, 50, 1)
    gui.add(osc, "maxFrequency", 15e3, 30e3, 1e3)
    gui.add(osc, "volume", 1, 10, .5)
    gui.add(osc, "zoom", 1, 10, 1)
    gui.add(osc, "play")
    gui.add(osc, "pause")
    gui.close()


    textSize(20)

    // we dont want to loop, as there are no animations while the mouse is
    // stationary. We call the mouseMoved function to redraw the screen.
    noLoop()
}

function draw() {
    background(101, 148, 105)

    textAlign(LEFT)
    text("t = 0 sek", 10, height-50)
    
    osc.setFrequency()
    osc.drawSine()

    noStroke()
    fill(0,80)
    ellipse(mouseX, height / 2, 100, 100)

    textAlign(RIGHT)
    text("Frekvens: " + floor(osc.frequency) + " Hz", width-10, height-20)
    text("t = " + 1/osc.zoom + " sek", width-10, height-50)
}


class SineOscillator {
    constructor() {
        this.p5osc = new p5.Oscillator("sine")
        this.volume = 5
        this.playing = false
        this.started = false
        this.zoom = 5
        this.minFrequency = 12
        this.maxFrequency = 20e3
        this.lastFrequency = 0
        this.frequency = 12
    }

    // mapping the mouseX position relative to the window to the natural
    // logarithm of the minFrequency and maxFrequceny. 
    // A logarithmic or semi-log scale makes a lot of sense for sound 
    // frequencies as humans are way better at differentiating between 
    // frequencies in the lower frequency range
    setFrequency() {
        let logFrequency = constrain(map(mouseX, 0, width, log(osc.minFrequency),
            log(osc.maxFrequency)), log(osc.minFrequency), log(osc.maxFrequency))
        this.frequency = exp(logFrequency)
        this.p5osc.freq(this.frequency)
    }

    // starting the playback and setting flags started and playing. amplitude
    // is scaled by volume slider
    play() {
        this.p5osc.start()
        this.p5osc.amp(osc.volume/10, 0.5)
        this.playing = true
        this.started = true
    }

    // pausing the playback over 0.5 sec fade-out
    pause() {
        this.p5osc.amp(0, 0.5)
        this.playing = false
    }

    // draw the sine wave with a fitting amplitude (scaled by volume)
    drawSine() {
        push()
        noFill()
        stroke(0, 80)
        beginShape()
        for (let x = 0; x <= width; x++) {
            let y = 4/5 * height + (height/5 * this.volume / 10) * 
                sin(this.frequency / (width / TWO_PI) / this.zoom * x)
            vertex(x,y)
        }
        endShape()
        pop()
    }
}


// play and pause by pressing spacebar
function keyPressed() {
    if (key == " ") {
        if (osc.playing == true) {
            osc.pause()
        } else if (osc.playing == false) {
            osc.play()
        }
    }
}

// start the tone generator by first touch or mouse press
function mousePressed() {
    if (osc.started == false) {
        osc.play()
    }
}


// only draw the screen after mouse is moved (aka. frequency is changed)
function mouseMoved() {
    redraw()
}