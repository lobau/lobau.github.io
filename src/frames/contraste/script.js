window.onload = function () {
  // document.getElementById("red").value = Math.round(Math.random() * 255);
  // document.getElementById("green").value = Math.round(Math.random() * 255);
  // document.getElementById("blue").value = Math.round(Math.random() * 255);

  document.getElementById("red").value = 100;
  document.getElementById("green").value = 90;
  document.getElementById("blue").value = 190;
  update();
};

function update() {
  color = {
    r: document.getElementById("red").value,
    g: document.getElementById("green").value,
    b: document.getElementById("blue").value,
  };

  document.getElementById(
    "header"
  ).style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  document.getElementById("redValue").innerHTML = color.r;
  document.getElementById("greenValue").innerHTML = color.g;
  document.getElementById("blueValue").innerHTML = color.b;

  var ratioOnWhite =
    Math.round(
      contrastRatio([255, 255, 255], [color.r, color.g, color.b]) * 100
    ) / 100;
  var ratioOnBlack =
    Math.round(contrastRatio([0, 0, 0], [color.r, color.g, color.b]) * 100) /
    100;

  svgColor = ratioOnBlack > ratioOnWhite ? "#000" : "#fff";
  bestColor = ratioOnBlack > ratioOnWhite ? "black" : "white";
  bestContrast = Math.max(ratioOnBlack, ratioOnWhite);
  qualitatif = bestContrast > 7 ? "AAA" : "AA";

  // document.getElementById("output").innerHTML = `
	// 		Contrast ratio with white: ${ratioOnWhite}<br />
	// 		Contrast ratio with black: ${ratioOnBlack}<br />
	// 	`;

  // document.getElementById(
  //   "close"
  // ).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.29291 9.70711L5.50001 6.91421L2.70712 9.70711L1.29291 8.29289L4.0858 5.5L1.29291 2.70711L2.70712 1.29289L5.50001 4.08579L8.29291 1.29289L9.70712 2.70711L6.91423 5.5L9.70712 8.29289L8.29291 9.70711Z" fill="${svgColor}"/></svg>`;

  document.getElementById("contrastHeader").innerText = qualitatif + " " + bestContrast;
  document.getElementById("contrastHeader").style.color = svgColor;

  document.getElementById("contrastValue").innerText = "Best with " + bestColor;
  document.getElementById("contrastValue").style.color = svgColor;
}

function luminanceRatio(r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(rgb1, rgb2) {
  var l1 = luminanceRatio(rgb1[0], rgb1[1], rgb1[2]) + 0.05;
  var l2 = luminanceRatio(rgb2[0], rgb2[1], rgb2[2]) + 0.05;
  return Math.max(l1, l2) / Math.min(l1, l2);
}
