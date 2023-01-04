// A Sine Wave generator in p5.js. Written by Ståle Gjelsten
// Hosted at: https://stalegjelsten.github.io/p5js-sine-generator/
//
//
// the source code for this project is (mostly) stolen from 
// https://js6450.github.io/sound-p5-part3.html and later it's been heavily
// modified. 
// original author: Jiwon Shin (http://jiwonshin.com/)


// initializing two oscillator objects. Horizontal and vertical
let oscH
let oscV

function setup() {
    createCanvas(windowWidth, windowHeight)

    // creating a new oscillator object wrapped in the SineOscillator class
    oscH = new SineOscillator(-1.0)
    oscV = new SineOscillator(1.0)


    // setting up the GUI control interface
    let gui = new dat.GUI();
    gui.add(oscH, "minFrequency", 1, 50, 1)
    gui.add(oscH, "maxFrequency", 200, 30e3, 100)
    gui.add(oscV, "minFrequency", 1, 50, 1)
    gui.add(oscV, "maxFrequency", 200, 30e3, 100)
    // gui.add(oscH, "volume", 1, 10, .5).onChange(function(){oscH.changeVol()})  
    // gui.add(oscH, "zoom", 1, 10, 1).onChange(function(){oscH.drawSine()})
    gui.close()


    textSize(20)

    // we dont want to loop, as there are no animations while the mouse is
    // stationary. We call the mouseMoved function to redraw the screen.
    noLoop()
}

function draw() {
    background(101, 148, 105)
    noStroke()
    fill(0,80)

    textAlign(LEFT)
    text("t = 0 sek", 10, height-50)
    
    oscH.setFrequency()
    oscH.drawSine()
    oscV.setFrequency()
    oscV.drawSine()

    // oscV.setFrequency()
    // oscV.drawSine()

    ellipse(mouseX, mouseY, 100, 100)

    textAlign(RIGHT)
    text("Frekvens: " + floor(oscH.frequency) + " Hz", width-10, height-20)
    text("Frekvens: " + floor(oscV.frequency) + " Hz", width/2+width/5, 20)
    text("t = " + (1/oscH.zoom).toPrecision(2) + " sek", width-10, height-50)
}


class SineOscillator {
    constructor(pan) {
        this.p5osc = new p5.Oscillator("sine")
        this.volume = 5
        this.playing = false
        this.started = false
        this.zoom = 5
        this.minFrequency = 12
        this.maxFrequency = 20e3
        this.lastFrequency = 0
        this.frequency = 12
        this.pan = pan
    }

    // mapping the mouseX position relative to the window to the natural
    // logarithm of the minFrequency and maxFrequceny. 
    // A logarithmic or semi-log scale makes a lot of sense for sound 
    // frequencies as humans are way better at differentiating between 
    // frequencies in the lower frequency range
    setFrequency() {
        let mousedir = mouseX
        let dimension = width
        if (this.pan > 0) {
            mousedir = mouseY
            dimension = height
        }
        let logFrequency = constrain(map(mousedir, 0, dimension, log(this.minFrequency),
            log(this.maxFrequency)), log(this.minFrequency), log(this.maxFrequency))
        this.frequency = exp(logFrequency)
        this.p5osc.freq(this.frequency)
    }

    // starting the playback and setting flags started and playing. amplitude
    // is scaled by volume slider
    play() {
        this.p5osc.start()
        this.p5osc.amp(this.volume/10, 0.5)
        this.p5osc.pan(this.pan)
        this.playing = true
        this.started = true
    }

    changeVol() {
        this.p5osc.amp(oscH.volume/10, 0.2)
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
        if (this.pan > 0) {
            for (let y = 0; y <= height; y++) {
                let x = 1/2 * width + (height/5 * this.volume / 10) * 
                    sin(this.frequency / (height / TWO_PI) / this.zoom * y)
                vertex(x,y)
            }
        } else {
            for (let x = 0; x <= width; x++) {
                let y = 4/5 * height + (height/5 * this.volume / 10) * 
                    sin(this.frequency / (width / TWO_PI) / this.zoom * x)
                vertex(x,y)
            }
        }
        endShape()
        pop()
    }
}


// play and pause by pressing spacebar
function keyPressed() {
    if (key == " ") {
        if (oscH.playing == true) {
            oscH.pause()
            oscV.pause()
        } else if (oscH.playing == false) {
            oscH.play()
            oscV.play()
        }
    }
}

// start the tone generator by first touch or mouse press
function mousePressed() {
    if (oscH.started == false) {
        oscH.play()
        oscV.play()
    }
}


// only draw the screen after mouse is moved (aka. frequency is changed)
function mouseMoved() {
    redraw()
}

// Trying to make the simulation more touch friendly :^)
function touchMoved() {
    redraw()
    if (osc.started == false) {
        osc.play()
    }
}
