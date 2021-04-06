// A Sine Wave generator in p5.js. Written by Ståle Gjelsten
// Hosted at: https://stalegjelsten.github.io/p5js-sine-generator/
//
//
// the source code for this project is (mostly) stolen from 
// https://js6450.github.io/sound-p5-part3.html and later it's been heavily
// modified. 
// original author: Jiwon Shin (http://jiwonshin.com/)

let osc
let playing = false
let frequency


function setup() {
    createCanvas(windowWidth, windowHeight)
    osc = new SineOscillator()
    let gui = new dat.GUI();

    gui.add(osc, "minFrequency", 1, 50, 1)
    gui.add(osc, "maxFrequency", 15e3, 30e3, 1e3)
    gui.add(osc, "volume", 1, 10, .5)
    gui.add(osc, "zoom", 1, 10, 1)
    gui.add(osc, "play")
    gui.add(osc, "pause")
    gui.close()

    noStroke()
    textSize(20)
}

function draw() {
    fill(0,80)

    background(101, 148, 105)
    textAlign(LEFT)
    text("t = 0", 10, height-50)
    

    let logFrequency = constrain(map(mouseX, 0, width, log(osc.minFrequency),
        log(osc.maxFrequency)), log(osc.minFrequency), log(osc.maxFrequency))
    frequency = exp(logFrequency)

    osc.p5osc.freq(frequency)
    ellipse(mouseX, height / 2, 100, 100)
    textAlign(RIGHT)
    text("Frekvens: " + floor(frequency) + " Hz", width-10, height-20)
    text("t = " + 1/osc.zoom + " sek", width-10, height-50)
    osc.drawSine()
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
    }

    play() {
        this.p5osc.start()
        this.p5osc.amp(osc.volume/10, 0.5)
        this.playing = true
        this.started = true
    }

    pause() {
        this.p5osc.amp(osc.p5osc.amp(0, 0.5))
        this.playing = false
    }

    drawSine() {
        push()
        noFill()
        stroke(0, 80)
        beginShape()
        for (let x = 0; x <= width; x++) {
            let y = 4/5 * height + (height/5 * this.volume / 10) * 
                sin(frequency / (width / TWO_PI) / this.zoom * x)
            vertex(x,y)
        }
        endShape()
        pop()
    }
}


function keyPressed() {
    if (key == " ") {
        if (osc.playing == true) {
            osc.pause()
        } else if (osc.playing == false) {
            osc.play()
        }
    }
}

function mousePressed() {
    if (osc.started == false) {
        osc.play()
    }
}