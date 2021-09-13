window.onload = function () {
  const vectorMap = [
    {
      p1: { x: -20, y: -16, z: 0 },
      p2: { x: 20, y: -16, z: 0 }
    },
    {
      p1: { x: -20, y: -16, z: 0 },
      p2: { x: 0, y: 16, z: 0 }
    },
    {
      p1: { x: 0, y: 16, z: 0 },
      p2: { x: 20, y: -16, z: 0 }
    }
  ];

  var el = document.getElementById("canvas");
  el.setAttribute("width", window.innerWidth);
  el.setAttribute("height", window.innerHeight);

  var context = el.getContext("2d");
  var globalZ = 500; // this is the light. 0 is touching the surface
  var grainIntensity = 0.12; // intensity of the noise / grain
  var scale = el.height / 60;

  // var scaleRatio = 2;
  var width = el.width;
  var height = el.height;
  var middleX = width / 2;
  var middleY = height / 2;

  var imageData = context.createImageData(width, height);
  for (var i = 0; i < width * height * 4; i += 4) {
    imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = 255; // setup color to white
  }

  var intensityMap = new Array(width * height);

  function paint_canvas() {
    var data = imageData.data;
    for (var i = 0; i < width * height; ++i) {
        var noise = -Math.random() * grainIntensity;
        var intensity = intensityMap[i] + noise;
        // var intensity = intensityMap[i];
    
        var color1 = [249, 227, 117];
        var color2 = [240, 78, 250];
    
        var r = color1[2] * intensity + color2[2] * (1 - intensity);
        var g = color1[1] * intensity + color2[1] * (1 - intensity) - (1 / (intensity * 4)) * 100;
        var b = color1[0] * intensity + color2[0] * (1 - intensity) - (1 / (intensity * 7)) * 100;
    
        data[i * 4 + 3] = 255;
        data[i * 4 + 2] = r;
        data[i * 4 + 1] = g;
        data[i * 4] = b;
    }
  }

  function clean_canvas() {
    for (var i = 0; i < width * height; i++) {
      intensityMap[i] = 1;
    }
  }

  function intensityPixel(x, y, mult) {
    intensityMap[x + y * width] *= mult;
  }

  function subVect(v1, v2) {
    return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
  }

  function vect2Length(v2) {
    if (v2.lengthv2) return v2.lengthv2;
    v2.lengthv2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    return v2.lengthv2;
  }

  function vectLength(v3) {
    return Math.sqrt(v3.x * v3.x + v3.y * v3.y + v3.z * v3.z);
  }

  function getAngle(p2p1, p2p3) {
    var dot = p2p1.x * p2p3.x + p2p1.y * p2p3.y;
    return Math.acos(dot / (vect2Length(p2p1) * vect2Length(p2p3))) / Math.PI;
  }

  function applyLightOnEverything() {
    // apply shadow of the lamp on the whole map
    for (var j = 0; j < height; ++j) {
      for (var i = 0; i < width; ++i) {
        var vect = { x: light.x - i, y: light.y - j, z: light.z };
        intensityPixel(i, j, vect.z / vectLength(vect));
      }
    }
  }

  var light = { x: middleX * 1.35, y: 200, z: globalZ };
  var lightDistance = 0;
  var angle = 0;

  window.requestAnimationFrame(updateLight);

  function updateLight(timestamp) {
    angle += 0.01;
    lightX = Math.cos(angle) * width / 4 + middleX;
    lightY = Math.sin(angle) * width / 4 + middleY;

    lightDistance += 0.01;
    light = { x: lightX, y: lightY, z: globalZ + Math.sin(lightDistance) * 300 + 200 };
    loadImage();

    window.requestAnimationFrame(updateLight);
  }

  function addLine(p1, p2) {
    var p2p1 = subVect(p1, p2);
    var p1p2 = subVect(p2, p1);
    var d1 = (light.x - p1.x) * (p2.y - p1.y) - (light.y - p1.y) * (p2.x - p1.x);
    var la1 = getAngle(p1p2, subVect(light, p1));
    var la2 = getAngle(p2p1, subVect(light, p2));
    for (var j = 0; j < height; ++j) {
      for (var i = 0; i < width; ++i) {
        var d2 = (i - p1.x) * (p2.y - p1.y) - (j - p1.y) * (p2.x - p1.x);
        if (d1 * d2 <= 0) {
          var a1 = getAngle(p2p1, { x: i - p2.x, y: j - p2.y, z: 0 }) / (1 - la2);
          if (a1 >= 1)
            continue;
          var a2 = getAngle(p1p2, { x: i - p1.x, y: j - p1.y, z: 0 }) / (1 - la1);
          var sum = a1 + a2;
          if (a2 >= 1 || sum >= 1) continue;
          sum = Math.pow(sum, .08);
          intensityPixel(i, j, sum);
        } else if (d1 * d2 > 0) {
          a1 = getAngle(p2p1, { x: i - p2.x, y: j - p2.y, z: 0 }) / (1 - la1);
          if (a1 >= 1)
            continue;
          a2 = getAngle(p1p2, { x: i - p1.x, y: j - p1.y, z: 0 }) / (1 - la2);
          sum = a1 + a2;
          if (a2 >= 1 || sum >= 1) continue;
          sum = 1 / sum;
          sum = Math.pow(sum, 0.04);
          intensityPixel(i, j, sum);
        }
      }
    }
  }

  function doAllVect() {
    for (var i = 0; i < vectorMap.length; i++) {
      addLine(
        { x: vectorMap[i].p1.x * scale + middleX, y: - vectorMap[i].p1.y * scale + middleY },
        { x: vectorMap[i].p2.x * scale + middleX, y: - vectorMap[i].p2.y * scale + middleY }
      );
    }
  }

  function loadImage() {
    clean_canvas();
    applyLightOnEverything();
    // doAllVect();
    paint_canvas();
    context.putImageData(imageData, 0, 0);
  }

  loadImage();

  window.onresize = function () {
    var el = document.getElementById("canvas");
    el.setAttribute("width", window.innerWidth);
    el.setAttribute("height", window.innerHeight);

    width = el.width;
    height = el.height;
    middleX = width / 2;
    middleY = height / 2;
    scale = height / 100;

    imageData = context.createImageData(width, height);

    // loadImage();
  };
};
