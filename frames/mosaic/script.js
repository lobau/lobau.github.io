var windowWidth,
	windowHeight,
	canvas,
	scaleRatio,
	canvasWidth,
	canvasHeight,
	context,
	Images,
	mousePressed,
	hoveredElement,
	clickedElement,
	isSelectionMode,
	rowHeight,
	margin,
	numberOfImages,
	Image,
	inRangeColor,
	inSelectionColor,
	selectedColor,
	topClicked,
	isPressAndHold,
	pressAndHoldTimer,
	originX,
	originY,
	isSIV,
	sivElement,
	selectionMode,
	mosaicMaxWidth;


var up = 48;
var half = Math.round(up / 2);
var third = Math.round(up / 3);
var sixth = Math.round(up / 6);

/////////////////////////////////////
// Load the various icons and glyphs
/////////////////////////////////////

var closeIcon = loadIcon("close");

window.onload = function() {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;

	canvas = $("background");

	/////////////////////////////////////
	// Canvas Crap for retina
	/////////////////////////////////////
	scaleRatio = window.devicePixelRatio;
	canvasWidth = windowWidth;
	canvasHeight = windowHeight;

	canvas.width = canvasWidth * scaleRatio;
	canvas.height = canvasHeight * scaleRatio;
	canvas.style.width = canvasWidth + "px";
	canvas.style.height = canvasHeight + "px";

	context = canvas.getContext("2d");
	context.scale(scaleRatio, scaleRatio);

	/////////////////////////////////////
	// Variables
	/////////////////////////////////////

	Images = [];
	mousePressed = false;
	hoveredElement = '';
	clickedElement = '';
	rowHeight = 4 * up;
	margin = sixth;
	numberOfImages = 35;
	inRangeColor = "#999";
	inSelectionColor = "#eee";
	selectedColor = "#2d2d2d";

	mosaicMaxWidth = 20 * up;

	topClicked = false;
	isPressAndHold = false;

	isSelectionMode = false;

	for (var i = 0; i < numberOfImages + 1; i++) {
		var particle = new Image();
		particle.src = 'img/' + i + '.jpg';
		particle.index = i;
		particle.onload = function() {
			var tile = new MosaicImage(this);
			Images.push(tile);
			relayout();
			redraw();
		};
	}

	canvas.addEventListener('mousemove', mousemovement, false);
	canvas.addEventListener('mousedown', mousepress, false);
	canvas.addEventListener('mouseup', mouserelease, false);


	canvas.addEventListener('contextmenu', function(e) {
		e.preventDefault();
	}, false);

	document.addEventListener("keydown", function(e) {
		// console.log(e.which);
		if (e.which == 27) {
			clearSelection();
			isSelectionMode = false;
			redraw();
		}

		if (e.which == 65 && (e.metaKey || e.ctrlKey)) {
			selectAll();
			isSelectionMode = true;
			redraw();
		}

		// console.log(e.which);
	}, false);
};

function $(el) {
	return document.getElementById(el);
}

function loadIcon(iconURL) {
	var icon = new Image();
	icon.src = 'icons/' + iconURL + '.svg';

	return icon;
}

function mousemovement(e) {
	var x = e.pageX;
	var y = e.pageY;

	clearTimeout(pressAndHoldTimer);
	isPressAndHold = false;

	if (mousePressed) {
		var distanceX = Math.abs(originX - x);
		var distanceY = Math.abs(originY - y);

		for (var i = 0; i < Images.length; i++) {
			if (x >= Images[i].x && x <= Images[i].x + Images[i].width && y >= Images[i].y && y <= Images[i].y + Images[i].height) {
				Images[i].isHovered = true;
				hoveredElement = Images[i];
			}
			else {
				Images[i].isHovered = false;
			}
		}

		var minElement = Math.min(clickedElement.index, hoveredElement.index);
		var maxElement = Math.max(clickedElement.index, hoveredElement.index);

		for (var j = 0; j < Images.length; j++) {
			if (j >= minElement && j <= maxElement) {
				Images[j].isInRange = true;
			}
			else {
				Images[j].isInRange = false;
			}
		}

		if (distanceX + distanceY > 20 && originY > up && !isSelectionMode) {
			isSelectionMode = true;
			hoveredElement.isInRange = true;
			hoveredElement.isPressed = true;
			hoveredElement.isHovered = true;
			clickedElement = hoveredElement;
		}
	}

	redraw();
}

function mousepress(e) {
	var x = e.pageX;
	var y = e.pageY;

	originX = x;
	originY = y;

	mousePressed = true;

	pressAndHoldTimer = setTimeout(function() {
		isPressAndHold = true;
		isSelectionMode = true;

		for (var i = 0; i < Images.length; i++) {
			if (x >= Images[i].x &&
				x <= Images[i].x + Images[i].width &&
				y >= Images[i].y &&
				y <= Images[i].y + Images[i].height) {
				Images[i].isPressed = true;
				Images[i].isHovered = true;
				Images[i].isInRange = true;
				clickedElement = Images[i];
				hoveredElement = Images[i];
			}
		}

		redraw();
	}, 750);

	if (y <= up) {
		topClicked = true;
	}

	if (e.which == 1) {
		if (isSelectionMode || isPressAndHold || e.ctrlKey || e.metaKey) {
			for (var i = 0; i < Images.length; i++) {
				if (x >= Images[i].x &&
					x <= Images[i].x + Images[i].width &&
					y >= Images[i].y &&
					y <= Images[i].y + Images[i].height) {
					Images[i].isPressed = true;
					Images[i].isHovered = true;
					Images[i].isInRange = true;
					clickedElement = Images[i];
					hoveredElement = Images[i];
				}
			}
		}

		if (e.ctrlKey || event.metaKey) {
			isSelectionMode = true;
			redraw();
		}

	}
	else if (e.which == 3) {
		for (var i = 0; i < Images.length; i++) {
			if (x >= Images[i].x &&
				x <= Images[i].x + Images[i].width &&
				y >= Images[i].y &&
				y <= Images[i].y + Images[i].height) {
				Images[i].isPressed = true;
				Images[i].isHovered = true;
				Images[i].isInRange = true;
				clickedElement = Images[i];
				hoveredElement = Images[i];
			}
		}
		isSelectionMode = true;
		redraw();
	}

	if (clickedElement.isSelected) {
		selectionMode = "deselect";
	}
	else {
		selectionMode = "select";
	}

	redraw();
}

function mouserelease(e) {
	var x = e.pageX;
	var y = e.pageY;

	clearTimeout(pressAndHoldTimer);
	isPressAndHold = false;

	if (y <= up && topClicked) {
		// clicked on top
		if (isSelectionMode) {
			isSelectionMode = false;
			clearSelection();
		}
		else {
			isSelectionMode = true;
		}
		redraw();
	}

	if (!isSelectionMode && !isSIV && y > up) {
		for (var i = 0; i < Images.length; i++) {
			if (x >= Images[i].x &&
				x <= Images[i].x + Images[i].width &&
				y >= Images[i].y &&
				y <= Images[i].y + Images[i].height) {
				sivElement = Images[i];
			}
		}
		isSIV = true;
	}
	else if (isSIV) {
		isSIV = false;
		clearSelection();
	}



	// if (e.which == 1) {
	var minElement = Math.min(clickedElement.index, hoveredElement.index);
	var maxElement = Math.max(clickedElement.index, hoveredElement.index);

	for (var i = minElement; i <= maxElement; i++) {
		if (selectionMode == "select") {
			Images[i].isSelected = true;
		}
		else {
			Images[i].isSelected = false;
		}

		// if (Images[i].isSelected) {
		// 	Images[i].isSelected = false;
		// }
		// else {
		// 	Images[i].isSelected = true;
		// }
	}

	mousePressed = false;

	for (var j = 0; j < Images.length; j++) {
		Images[j].isPressed = false;
		Images[j].isHovered = false;
		Images[j].isInRange = false;
	}

	clickedElement = "";
	hoveredElement = "";

	redraw();

	// }
	// else if (e.which == 3) {
	// 	context.fillStyle = "rgba(255, 255, 255, 1)";
	// 	context.shadowColor = 'rgba(0, 0, 0, 0.25)';
	// 	context.shadowOffsetX = 0;
	// 	context.shadowOffsetY = 6;
	// 	context.shadowBlur = 30;
	// 	context.fillRect(x, y, 220, 400);
	// 	resetShadows();
	// }
}

function resetShadows() {
	context.shadowColor = "rgba(0,0,0,0)";
	context.shadowBlur = 0;
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
}

function rgbToHsl(r, g, b) {
	r /= 255, g /= 255, b /= 255;

	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	}
	else {
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

	return [h, s, l];
}

function MosaicImage(particle) {
	this.x = 0;
	this.y = 0;
	this.nativeWidth = particle.width / 2;
	this.nativeHeight = particle.height / 2;
	this.width = 0;
	this.height = 0;
	this.image = particle;
	this.imageURL = particle.src;
	this.aspectRatio = this.nativeWidth / this.nativeHeight;
	this.index = particle.index;

	this.isHovered = false;
	this.isPressed = false;
	this.isSelected = false;
	this.isInRange = false;


	// get data
	context.drawImage(this.image, this.x, this.y, this.nativeWidth, this.nativeHeight);
	this.data = context.getImageData(this.x, this.y, this.nativeWidth, this.nativeHeight);

	var blockSize = 5, // only visit every 5 pixels
		i = -4,
		length = this.data.data.length,
		rgb = {
			r: 0,
			g: 0,
			b: 0
		},
		count = 0;

	while ((i += blockSize * 4) < length) {
		++count;
		rgb.r += this.data.data[i];
		rgb.g += this.data.data[i + 1];
		rgb.b += this.data.data[i + 2];
	}

	// ~~ used to floor values
	rgb.r = ~~(rgb.r / count);
	rgb.g = ~~(rgb.g / count);
	rgb.b = ~~(rgb.b / count);

	this.averageColor = rgb;
	this.averageColorRGB = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
	var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

	this.hue = Math.round(hsl[0] * 360);
	if (this.hue >= 180) {
		this.shiftedhue = this.hue - 180;
	}
	else {
		this.shiftedhue = this.hue + 180;
	}

	this.averageColorHSL = "hsla(" + this.hue + "," + Math.round(hsl[1] * 100 + 50) + "%," + Math.round(hsl[2] * 80) + "%, 0.5)";
	this.averageColorHSLDisabled = "hsla(" + this.hue + "," + Math.round(hsl[1] * 100 + 50) + "%," + Math.round(hsl[2] * 80) + "%, 0.15)";
	this.averageColorShiftedHSL = "hsl(" + this.shiftedhue + "," + Math.round(100) + "%," + Math.round(hsl[2] * 80) + "%)";

	this.t = 0; // timer for making an overlay longer based on the time

	this.draw = function() {
		var strokeWidth = 6;

		if (this.isSelected) {

			context.lineWidth = strokeWidth;
			context.strokeStyle = this.averageColorHSL;
			context.strokeRect(this.x + strokeWidth / 2, this.y + strokeWidth / 2, this.width - strokeWidth, this.height - strokeWidth);

			if (!this.isInRange) {
				context.lineWidth = strokeWidth;
				context.strokeStyle = selectedColor;
				context.strokeRect(this.x + strokeWidth / 2, this.y + strokeWidth / 2, this.width - strokeWidth, this.height - strokeWidth);
			}

			context.beginPath();
			context.drawImage(this.image, this.x + margin, this.y + margin, this.width - margin * 2, this.height - margin * 2);
			context.fill();

		}
		else {
			if (isSelectionMode) {
				context.lineWidth = strokeWidth;
				// context.strokeStyle = this.averageColorHSLDisabled;
				context.strokeStyle = inSelectionColor;
				context.strokeRect(this.x + strokeWidth / 2, this.y + strokeWidth / 2, this.width - strokeWidth, this.height - strokeWidth);

				context.beginPath();
				context.drawImage(this.image, this.x + margin, this.y + margin, this.width - margin * 2, this.height - margin * 2);
				context.fill();

			}
			else {
				// context.save();
				// roundedImage(this.x, this.y, this.width, this.height, 20);
				// context.clip();
				context.beginPath();
				context.drawImage(this.image, this.x, this.y, this.width, this.height);
				context.fill();
				// context.restore();
			}
		}


		if (this.isInRange) {

			if (selectionMode == "select") {
				context.lineWidth = strokeWidth;
				context.strokeStyle = inRangeColor;
				context.strokeRect(this.x + strokeWidth / 2, this.y + strokeWidth / 2, this.width - strokeWidth, this.height - strokeWidth);

			}
			else {
				context.lineWidth = strokeWidth;
				context.strokeStyle = "#c4c4c4";
				context.strokeRect(this.x + strokeWidth / 2, this.y + strokeWidth / 2, this.width - strokeWidth, this.height - strokeWidth);

			}

			// context.fillStyle = "rgba(255, 0, 0, 0.5)";
			// context.fillRect(this.x, this.y, this.width, this.height / 3);

			// context.fillStyle = "white";
			// context.font = "16px Arial";
			// context.fillText("In range", this.x + 8, this.y + 23);
		}

		// if (this.isPressed) {
		// 	context.fillStyle = "rgba(0, 255, 0, 0.5)";
		// 	context.fillRect(this.x, this.y + this.height / 3, this.width, this.height / 3);

		// 	context.fillStyle = "white";
		// 	context.font = "16px Arial";
		// 	context.fillText("Has been pressed", this.x + 8, this.y + this.height / 3 + 23);
		// }

		// if (this.isHovered) {
		// 	context.fillStyle = "rgba(0, 0, 255, 0.5)";
		// 	context.fillRect(this.x, this.y + this.height / 3 * 2, this.width, this.height / 3);

		// 	context.fillStyle = "white";
		// 	context.font = "16px Arial";
		// 	context.fillText("End of selection", this.x + 8, this.y + this.height / 3 * 2 + 23);
		// }
	};

	return this;
}

window.onresize = function() {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;

	/////////////////////////////////////
	// Canvas Crap for retina
	/////////////////////////////////////
	scaleRatio = window.devicePixelRatio;
	canvasWidth = windowWidth;
	canvasHeight = windowHeight;

	canvas.width = canvasWidth * scaleRatio;
	canvas.height = canvasHeight * scaleRatio;
	canvas.style.width = canvasWidth + "px";
	canvas.style.height = canvasHeight + "px";

	context = canvas.getContext("2d");
	context.scale(scaleRatio, scaleRatio);

	relayout();
	redraw();
};

function clearSelection() {
	for (var i = 0; i < Images.length; i++) {
		Images[i].isSelected = false;
	}
}

function selectAll() {
	for (var i = 0; i < Images.length; i++) {
		Images[i].isSelected = true;
	}
}

function redraw() {
	context.save();

	// if (isSelectionMode) {
	// 	context.fillStyle = "#333";
	// 	context.fillRect(0, 0, canvasWidth, canvasHeight);
	// }
	// else {
	context.fillStyle = "rgb(242, 242, 242)";
	context.fillRect(0, 0, canvasWidth, canvasHeight);
	// }

	context.shadowColor = 'rgba(0, 0, 0, 0.15)';
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 3;
	context.shadowBlur = 12;
	context.fillStyle = "white";
	context.fillRect(canvasWidth / 2 - mosaicMaxWidth / 2, up, mosaicMaxWidth + margin * 2, canvasHeight);
	resetShadows();

	var numberOfElementSelected = 0;

	for (var i = 0; i < Images.length; i++) {
		Images[i].draw();
		if (Images[i].isSelected) {
			numberOfElementSelected++;
		}
	}

	if (isSelectionMode) {
		context.fillStyle = selectedColor;
		context.fillRect(0, 0, canvasWidth, up);

		context.beginPath();
		context.drawImage(closeIcon, 0, 0, up, up);
		context.fill();

		context.fillStyle = "white";
		context.font = "16px Cantarell";

		var stringX = up;
		var stringY = 30;
		var buttonColor;

		if (mousePressed && numberOfElementSelected == 0) {
			context.fillText("Click to select or drag to select a range.", stringX, stringY);
		}
		else {
			if (numberOfElementSelected == 0) {
				context.fillText("Click to select or drag to select a range.", stringX, stringY);
			}
			else {
				if (numberOfElementSelected > 1) {
					context.fillText(numberOfElementSelected + " photos selected", stringX, stringY);
				}
				else {
					context.fillText(numberOfElementSelected + " photo selected", stringX, stringY);
				}
			}
		}

		if (numberOfElementSelected > 0) {
			buttonColor = "white";
		}
		else {
			buttonColor = "rgba(255, 255, 255, 0.35)";
		}
		// drawButton("Share    Loop    Delete", canvasWidth, 0, buttonColor, "right");

	}
	else {
		drawButton("Select", canvasWidth, 0, "#424242", "right");
	}

	if (isSIV) {
		drawImageScaled(sivElement.image, context, sivElement.averageColorRGB);
	}

	context.restore();
}

function drawButton(string, x, y, color, align) {

	context.font = "14px Cantarell";
	var txt = string.toUpperCase();
	var textWidth = context.measureText(txt).width + third * 2;
	var offset;

	switch (align) {
		case "left":
			offset = 0;
			break;
		case "right":
			offset = textWidth;
			break;
		case "center":
			offset = textWidth / 2;
			break;
		default:
			offset = 0;
			break;
	}

	context.fillStyle = color;
	context.fillText(txt, x + third - offset, 30);
}

function compare(a, b) {
	if (a.index < b.index)
		return -1;
	if (a.index > b.index)
		return 1;
	return 0;
}

function relayout() {
	var maxWidth = canvasWidth - margin * 2;
	var totalWidth = 0;
	var horizontalMargin = 0;

	if (maxWidth >= mosaicMaxWidth) {
		maxWidth = mosaicMaxWidth;
		horizontalMargin = (canvasWidth - maxWidth) / 2;
	}

	Images.sort(compare);

	for (var i = 0; i < Images.length; i++) {
		Images[i].x = totalWidth;
		Images[i].width = rowHeight * Images[i].aspectRatio;
		Images[i].height = rowHeight;
		totalWidth += Images[i].width;
	}

	var numRows = Math.ceil(totalWidth / maxWidth);
	var rowWidth = totalWidth / numRows;
	var Rows = [];

	// Row Layers
	for (var i = 0; i < numRows; i++) {
		Rows[i] = [];
		for (var k = 0; k < Images.length; k++) {
			var centerX = Images[k].x + Images[k].width / 2;
			if (centerX > rowWidth * i && centerX <= rowWidth * (i + 1)) {
				Rows[i].push(Images[k]);
			}
		}
	}

	var verticalOffset = margin + up;
	for (i = 0; i < Rows.length; i++) {
		var currentRow = Rows[i];
		var lengthOfRow = 0;
		for (k = 0; k < currentRow.length; k++) {
			lengthOfRow += currentRow[k].width;
		}

		var ratio = lengthOfRow / (maxWidth - (currentRow.length - 1) * margin);
		var adjustedHeight = rowHeight / ratio;
		var horizontalOffset = margin + horizontalMargin;

		for (k = 0; k < currentRow.length; k++) {
			currentRow[k].height = adjustedHeight;
			currentRow[k].width = adjustedHeight * currentRow[k].aspectRatio;
			currentRow[k].x = horizontalOffset;
			currentRow[k].y = verticalOffset;
			horizontalOffset += currentRow[k].width + margin;
		}
		verticalOffset += adjustedHeight + margin;
	}
}

function drawImageScaled(img, ctx, bgColor) {

	// scaleRatio = window.devicePixelRatio;
	// canvasWidth = windowWidth;
	// canvasHeight = windowHeight;

	// canvas.width = canvasWidth * scaleRatio;
	// canvas.height = canvasHeight * scaleRatio;
	// canvas.style.width = canvasWidth + "px";
	// canvas.style.height = canvasHeight + "px";

	// var canvas = ctx.canvas;
	var scaledWidth = canvas.width / scaleRatio;
	var scaledHeight = canvas.height / scaleRatio;

	var hRatio = scaledWidth / img.width;
	var vRatio = scaledHeight / img.height;
	var ratio = Math.min(hRatio, vRatio);
	var centerShift_x = (scaledWidth - img.width * ratio) / 2;
	var centerShift_y = (scaledHeight - img.height * ratio) / 2;

	context.fillStyle = bgColor;
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "rgba(0, 0, 0, 0.5)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	//ctx.clearRect(0,0,canvas.width, canvas.height);
	context.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
}

function roundedImage(x, y, width, height, radius) {
	context.beginPath();
	context.moveTo(x + radius, y);
	context.lineTo(x + width - radius, y);
	context.quadraticCurveTo(x + width, y, x + width, y + radius);
	context.lineTo(x + width, y + height - radius);
	context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	context.lineTo(x + radius, y + height);
	context.quadraticCurveTo(x, y + height, x, y + height - radius);
	context.lineTo(x, y + radius);
	context.quadraticCurveTo(x, y, x + radius, y);
	context.closePath();
}
