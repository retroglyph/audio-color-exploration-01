/*global window*/
var audio_context = window.AudioContext || window.webkitAudioContext,
  con = new audio_context(),
  osc = con.createOscillator(),
  lfo = con.createOscillator(),
  vol = con.createGain(),

  lfo_amp = con.createGain(),
  playing = false,
  cur_freq = 200,
  offset_freq = 0,
  keyMappings = {
    // first row
    z: 130.81, // c3
    x: 146.83, // d
    c: 164.81, // e
    v: 174.61, // f
    b: 196.00, // g
    n: 220.00, // a
    m: 246.94, // b
    ',': 261.63, // c4 = middle c
    // second row
    s: 138.59, // c#/Db
    d: 155.56, // d#/Eb
    g: 185.00, // f#/Gb
    h: 207.65, // g#/Ab
    j: 233.08, // a#/Bb
    // third row
    q: 261.63, // c4 = middle c
    w: 293.66, // d
    e: 329.63, // e
    r: 349.23, // f
    t: 392.00, // g
    y: 440.00, // a
    u: 493.88, // b
    i: 523.25, // c5
    // fourth row
    '2': 277.18, // Db/C#
    '3': 311.13, // Eb
    '5': 369.99, // Gb
    '6': 415.30, // Ab
    '7': 466.16 // Bb
  },
  // set variable to manipulate container, button and color_display divs
  ctnr = document.querySelector('.container'),
  btn0 = document.querySelector("#btn0"),
  btn1 = document.querySelector('#btn1'),
  btn2 = document.querySelector('#btn2'),
  btn3 = document.querySelector('#btn3'),
  canvas1 = document.querySelector('#canvas1'),
  ctx1 = canvas1.getContext('2d'),
  color_display = document.querySelector('#color_display'),
  // create a canvas element which later we will dynamically add via insertBefore()
  canvas = document.createElement('canvas'),
  canvasWidth = color_display.clientWidth, //versus offsetHeight
  ctx = canvas.getContext('2d');

lfo_amp.gain.value = 200;

osc.frequency.value = cur_freq;
lfo.frequency.value = 15;
vol.gain.value = 0.00;

lfo.connect(lfo_amp);
lfo_amp.connect(osc.frequency);
//osc.connect(con.destination);
osc.connect(vol);
vol.connect(con.destination);

osc.start();
lfo.start();

function byte2Hex(n) {
  'use strict';

  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
}

function rgb2Color(r, g, b) {
  'use strict';

  return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function renderRainbows() {
  'use strict';

  var j, i, x, y, clr, red, green, blue,
    amplitude = 127,
    center = 128,
    numSins = 32,
    sinPadding = 3,
    sinHeight = canvasWidth / numSins,
    frequency = 0.01,
    canvasHeight = numSins * sinHeight + 2 * sinPadding; //(numSins) * (sinHeight + sinPadding);

  ctx1.fillStyle = 'rgb(0,0,0)';
  ctx1.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx1.lineWidth = 1;
  canvas1.width = canvasWidth;
  canvas1.height = canvasHeight;

  for (j = 0; j < numSins; j += 1) {
    frequency += 0.05;
    for (i = 0; i < numSins; i += 1) {
      //colVal = Math.sin(frequency * i) * amplitude + center;
      red = Math.sin(frequency * i + 0) * amplitude + center;
      green = Math.sin(frequency * i + 2) * amplitude + center;
      blue = Math.sin(frequency * i + 4) * amplitude + center;

      x = i * sinHeight;
      y = j * sinHeight;
      clr = rgb2Color(red, green, blue);
      ctx1.fillStyle = clr;
      ctx1.strokeStyle = clr;
      ctx1.fillRect(x, y, sinHeight, sinHeight);
    }
  }
}

function rendersin() {
  'use strict';

  var i, s, hue, x, y, clr, len,
    numSins = 42,
    sinPadding = 3,
    sinHeight = 6,
    frequency = 0.15,
    canvasHeight = (numSins) * (sinHeight + sinPadding),
    hueStart = Math.random() * 10 - 5,
    curHue = hueStart;

  ctx1.fillStyle = 'rgb(0,0,0)';
  ctx1.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx1.lineWidth = 1;
  canvas1.width = canvasWidth;
  canvas1.height = canvasHeight; // window.innerHeight;
  //canvasHeight = window.innerHeight;
  /*var w = ctnr.clientWidth; //clientWidth is the inner width (ie. the space inside an
      element including padding but excluding borders and scrollbars) offsetWidth is the
      outer width (ie. the space occupied by the element, including padding and borders)
      scrollWidth is the total width including stuff that is only visible if you scroll. */

  for (i = 0; i < numSins; i += 1) {
    s = Math.sin(frequency * i) * canvasWidth / 2;
    hue = hueStart + (i * 3);

    x = s < 0 ?
      canvasWidth / 2 + s :
      canvasWidth / 2; //s + w*2;//col * rowHeight; //triSide;
    y = (i - 1) * (sinHeight + sinPadding) + sinPadding; //rowHeight;
    clr = 'hsl(' + hue * 6 + ', 50%, ' + (60 - (curHue + i * i / 64)) + '%)';
    ctx1.fillStyle = clr;
    ctx1.strokeStyle = clr;
    /*ctx1.beginPath();
    ctx1.moveTo(x, y);*/
    len = Math.abs(s); // s<0?w:w+s;
    ctx1.fillRect(x, y, len, sinHeight);
    /*ctx1.lineTo(x + triSide, y);
    ctx1.lineTo(x + halfSide, y + rowHeight);
    ctx1.closePath();*/
    ctx1.fill();
    //ctx1.stroke();

  }
}

function rendergrays() {
  'use strict';

  var j, i, x, y, clr, colVal,
    amplitude = 127,
    center = 128,
    numSins = 32,
    sinPadding = 3,
    sinHeight = canvasWidth / numSins,
    frequency = 0.01,
    canvasHeight = numSins * sinHeight + 2 * sinPadding; //(numSins) * (sinHeight + sinPadding);

  ctx1.fillStyle = 'rgb(0,0,0)';
  ctx1.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx1.lineWidth = 1;
  canvas1.width = canvasWidth;
  canvas1.height = canvasHeight; // window.innerHeight;
  //canvasHeight = window.innerHeight;
  /*var w = ctnr.clientWidth; clientWidth is the inner width (ie. the space inside an
      element including padding but excluding borders and scrollbars) offsetWidth is the
      outer width (ie. the space occupied by the element, including padding and borders)
      scrollWidth is the total width including stuff that is only visible if you scroll. */

  for (j = 0; j < numSins; j += 1) {
    frequency += 0.05;
    for (i = 0; i < numSins; i += 1) {
      colVal = Math.sin(frequency * i) * amplitude + center;

      x = i * sinHeight;
      y = j * sinHeight;
      clr = rgb2Color(colVal, colVal, colVal);
      ctx1.fillStyle = clr;
      ctx1.strokeStyle = clr;
      ctx1.fillRect(x, y, sinHeight, sinHeight);
    }
  }
}

function printKey(txt) {
  'use strict';

  document.getElementById("keyPress").innerHTML = txt;
}

function doBtn1() {
  'use strict';

  printKey('sin: btn1');
  rendergrays();
}

function doBtn2() {
  'use strict';

  ctx1.clearRect(0, 0, ctx1.width, ctx1.height);
  printKey('sin: btn2');
  renderRainbows();
}

function doBtn3() {
  'use strict';

  printKey('sin: btn3');
}

function loadSinWave() {
  'use strict';

  var i,
    txt = 'sin:\n',
    counter = 0.3,
    sineText = document.getElementById("demo"); //cdocument.getElementById("sin");
  for (i = 0; i < 32; i += 1) {
    txt += Math.sin(counter * i) + "\n";
    //console.log(Math.sin(counter*i));
  }
  sineText.innerHTML = txt;
  //printKey(txt);
}

function toggleOscVol() {
  'use strict';

  loadSinWave(null);
  if (playing) {
    ctx1.clearRect(0, 0, ctx1.width, ctx1.height);
    vol.gain.value = 0;
    ctnr.style.backgroundColor = 'maroon';
    playing = false;
    btn0.innerHTML = 'Turn Osc On';
  } else {
    rendersin();
    ctnr.style.backgroundColor = '#441122';
    playing = true;
    btn0.innerHTML = 'Turn Osc Off';
    //alert("starting, playing:" + playing);
    vol.gain.value = 1;
  }
}

//This function is called when user move the mouse
//And print the mouse coordinates on screen
function setFrequency(e) {
  'use strict';

  var x = e.clientX;
  var y = e.clientY;
  var coor = "Coordinates: (" + x + "," + y + ")";

  document.getElementById("demo").innerHTML = coor;

  lfo.frequency.value = event.clientX;
  offset_freq = (event.clientY - ctnr.clientHeight) / 20;
  //console.log("cur_freq:" + cur_freq + " offset_freq:" + offset_freq + " ctnr.clientHeight:" + ctnr.clientHeight);
  osc.frequency.value = cur_freq + offset_freq;
}

// this function is called when the user
// presses a key on the keboard
// it receives the key they pressed as 'key'

function setNote(key) {
  'use strict';

  var formatted;

  // look at the value of key (the key the user pressed)
  // and do different things depending what it is
  if (key in keyMappings) { //(!typeof(keyMappings.hasOwnProperty('key')) === undefined) { //(key in keyMappings) {
    // play corresponding frequency
    osc.frequency.value = keyMappings[key];
  } else {
    osc.frequency.value = Math.random() * 1500 + 400;
  }
  cur_freq = osc.frequency.value + offset_freq;
  formatted = Math.floor(osc.frequency.value * 100) / 100;
  document.getElementById("keyPress").innerHTML = "Key : " + key + "; Frequency:" + formatted;
  color_display.style.backgroundColor = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';

}

ctnr.onmousemove = function(event) {
  'use strict';

  setFrequency(event);
};

btn0.onkeydown = function(event) {
  'use strict';

  setNote(event.key);
};

btn0.addEventListener("click", toggleOscVol);
btn1.addEventListener("click", doBtn1);
btn2.addEventListener("click", doBtn2);
btn3.addEventListener("click", doBtn3);

rendersin();
canvas1.addEventListener('dblclick', rendersin);
