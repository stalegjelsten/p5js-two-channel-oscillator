// this is (mostly) stolen from https://js6450.github.io/sound-p5-part3.html
// original author: Jiwon Shin (http://jiwonshin.com/)
var osc;
var playing = false;

function setup() {
    createCanvas(windowWidth, windowHeight);

    osc = new p5.Oscillator();
    osc.amp(0);
    osc.start();
    noStroke();
}

function draw() {
    if (playing == true) {
        background(0, 30);
        fill(255);

        var frequency = map(mouseX, 0, width, -30, 20000);

        osc.freq(frequency);
        ellipse(mouseX, height / 2, 100, 100);
        text("Frekvens: " + frequency + " Hz", width-200, height-20)
    } else {
        background(255);
    }
}

function mousePressed() {
    if (playing == true) {
        osc.amp(0);
        playing = false;
    } else {
        osc.amp(1);
        playing = true;
    }
}