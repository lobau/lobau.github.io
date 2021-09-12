var images = [];
var audioContext = null;
var meter = null;
var rafID = null;
var isMicOn = false;

var meter;

function enablePrototype() {
  // monkeypatch Web Audio
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  // grab an audio context
  audioContext = new AudioContext();

  // Attempt to get audio input
  try {
    // monkeypatch getUserMedia
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    // ask for an audio input
    navigator.getUserMedia(
      {
        audio: {
          mandatory: {
            googEchoCancellation: "false",
            googAutoGainControl: "false",
            googNoiseSuppression: "false",
            googHighpassFilter: "false",
          },
          optional: [],
        },
      }, gotStream, didntGetStream);
  } catch (e) {
    alert("getUserMedia threw exception :" + e);
  }
}

window.onload = function () {
  var img = document.createElement("img");
  img.src = "images/Fall_Leaves.jpg";
  img.onload = changeImage;

  document
    .querySelector('input[type="file"]')
    .addEventListener("change", function () {
      if (this.files && this.files[0]) {
        var img = document.createElement("img");
        img.src = URL.createObjectURL(this.files[0]); // set src to blob url
        img.onload = changeImage;
      }
    });

  document.getElementById("micToggleButton").onclick = function () {
      if(isMicOn) {
        // enablePrototype();
        document.getElementById("micToggleButton").innerText = "Enable Mic";
        isMicOn = false;
      } else {
        enablePrototype();
        document.getElementById("micToggleButton").innerText = "Disable Mic";
        isMicOn = true;
      }
    
  };

  // Make the DIV element draggable:
  var draggables = document.getElementsByClassName("draggable");
  for (var i = 0; i < draggables.length; i++) {
    dragElement(draggables.item(i));
  }
};

function didntGetStream() {
  alert("Stream generation failed.");
}

var mediaStreamSource = null;

function gotStream(stream) {
  audioContext.resume();
  // Create an AudioNode from the stream.
  mediaStreamSource = audioContext.createMediaStreamSource(stream);

  // Create a new volume meter and connect it.
  // meter = createAudioMeter(audioContext, .7);
  meter = createAudioMeter(audioContext);
  mediaStreamSource.connect(meter);

  // kick off the visual updating
  update();
}

function update(time) {
  var h1 = Math.min(8, meter.volume * 120 + 2);
  var y1 = 12 - h1 / 2;

  var h2 = Math.min(12, meter.volume * 180 + 2);
  var y2 = 12 - h2 / 2;

  var h3 = Math.min(8, meter.volume * 120 + 2);
  var y3 = 12 - h3 / 2;

  document.getElementById("equalizer").innerHTML = `<svg fill="#444">
    <rect x="6" y="${y1}" width="2" height="${h1}" rx="1"></rect>
    <rect x="11" y="${y2}" width="2" height="${h2}" rx="1"></rect>
    <rect x="16" y="${y3}" width="2" height="${h3}" rx="1"></rect>
  </svg>`;

  document.getElementById("name").innerHTML = meter.volume.toFixed(3);

  if (meter.volume > 0.008) {
    frame = Math.floor(Math.random() * 8);
    document.getElementById("avatar").className = "avatar_talk_" + frame;
  } else {
    if (Math.random() > 0.95) {
      document.getElementById("avatar").className = "avatar_blink";
    } else {
      document.getElementById("avatar").className = "avatar_default";
    }
  }

    if(isMicOn) {
        setTimeout(
            function () {
            update();
            }, 100, false);
    } else {
        document.getElementById("avatar").className = "avatar_blink";
        document.getElementById("name").innerHTML = "Mic Off";
        document.getElementById("equalizer").innerHTML = `<svg fill="#444">
            <rect x="6" y="11" width="2" height="1" rx="1"></rect>
            <rect x="11" y="11" width="2" height="1" rx="1"></rect>
            <rect x="16" y="11" width="2" height="1" rx="1"></rect>
        </svg>`;
        // delete(audioContext);
        audioContext.close();
    }
  
}

// FIX FOR CHROME
// https://github.com/processing/p5.js-sound/issues/249#issuecomment-386657799
var restart = function () {
  if (audioContext.state !== "running") {
    audioContext.resume();
  }
};

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;

    elmnt.style.filter = "var(--shadow-large)";
    elmnt.style.transform = "scale(1.05)";
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    elmnt.style.filter = "var(--shadow-normal)";
    elmnt.style.transform = "scale(1)";
  }
}

// Background COlor

function changeImage() {
  document.getElementById("container").style.backgroundImage =
    "url(" + this.src + ")";

  const colorThief = new ColorThief();
  var domRGB = colorThief.getColor(this); // return color as [r, g, b]
  var domHSL = rgbToHsl(domRGB[0], domRGB[1], domRGB[2]); // convert color to {h, s, l} for editing

  var accentInk = {
    h: domHSL.h,
    s: 0.7,
    l: 0.2,
  };

  var accentBold = {
    h: domHSL.h,
    s: domHSL.s,
    l: 0.5,
  };

  var accentRegular = {
    h: domHSL.h,
    s: domHSL.s,
    l: 0.75,
  };

  var accentLight = {
    h: domHSL.h,
    s: domHSL.s,
    l: 0.82,
  };

  var accentSurface = {
    h: domHSL.h,
    s: domHSL.s,
    l: 0.9,
  };

  document.documentElement.style.setProperty(
    "--accent-ink",
    printColor(accentInk)
  );
  document.documentElement.style.setProperty(
    "--accent-bold",
    printColor(accentBold)
  );
  document.documentElement.style.setProperty(
    "--accent-regular",
    printColor(accentRegular)
  );
  document.documentElement.style.setProperty(
    "--accent-light",
    printColor(accentLight)
  );
  document.documentElement.style.setProperty(
    "--accent-surface",
    printColor(accentSurface)
  );
}

function printColor(HslColor) {
  var hue = Math.round(HslColor.h * 360);
  var sat = Math.round(HslColor.s * 100);
  var lum = Math.round(HslColor.l * 100);

  return "hsl(" + hue + ", " + sat + "%, " + lum + "%)";
}

function rgbToHsl(r, g, b, index) {
  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  // return [h, s, l];
  return {
    h: h,
    s: s,
    l: l,
    index: index,
  };
}
