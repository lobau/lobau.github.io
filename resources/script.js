/*
    Laurent Baumann
    lobau.io/
    @lobau
*/

class ShadedBox {
    constructor(domEl, param) {
        this.view = domEl;
        this.param = param;
        // this.param = JSON.parse(this.view.dataset.param);
        this.centerColor = this.param.centerColor || "#FDC2A5";
        this.outerColor = this.param.outerColor || "#FFF3B7";
        this.shadow = this.param.shadow || "255, 0, 0";
        this.size = this.param.size || "400px";
        this.elevation = this.param.elevation || 30;
        this.transparency = this.param.transparency || 0.15;

        var position = this.view.getBoundingClientRect();
        var objectX = position.x + position.width / 2;
        var objectY = position.y + position.height / 2;

        this.updateShadow({
            x: objectX,
            y: objectY - 200
        });

        window.addEventListener(
            "mousemove",
            function(e) {
                this.updateShadow(e);
            }.bind(this)
        );

        window.addEventListener(
            "scroll",
            function() {
                this.updateShadow({
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 3
                });
            }.bind(this)
        );
    }

    updateShadow(e) {
        var position = this.view.getBoundingClientRect();

        var mouseX = e.x;
        var mouseY = e.y;

        var objectX = position.x + position.width / 2;
        var objectY = position.y + position.height / 2;

        var distanceX = objectX - mouseX;
        var distanceY = objectY - mouseY;

        var distanceToMouseX = mouseX - position.x;
        var distanceToMouseY = mouseY - position.y;

        this.view.style.background = `radial-gradient(${this.size} at ${distanceToMouseX}px ${distanceToMouseY}px, ${this.centerColor}, ${this.outerColor})`;

        var maxShadows = 3;
        var shadowString = "";
        // shadowString += `0px 0px 2px 1px rgba(0, 0, 0, 0.08), `;
        var offsetX, offsetY, blur, falloff, transparency, distance;
        for (var i = 1; i < maxShadows; i++) {
            if (i != 1) {
                shadowString += ", ";
            }
            offsetX = distanceX / (i * i * this.elevation);
            offsetY = distanceY / (i * i * this.elevation);
            distance = Math.abs(offsetX) + Math.abs(offsetY);

            blur = distance / 1.2;
            falloff = distance / 20;
            transparency = this.transparency / i;
            shadowString += `${offsetX}px ${offsetY}px ${blur}px -${falloff}px rgba(${this.shadow}, ${transparency})`;
        }

        var maxOffset = 15;
        var innerShadowOffsetX = Math.min(Math.max(distanceX / 100, -maxOffset), maxOffset);
        var innerShadowOffsetY = Math.min(Math.max(distanceY / 100, -maxOffset), maxOffset);
        shadowString += `, inset ${innerShadowOffsetX}px ${innerShadowOffsetY}px 10px -3px rgba(255, 255, 255, 1)`;


        this.view.style.boxShadow = shadowString;
    }

    getAngleDegrees(fromX, fromY, toX, toY, force360 = true) {
        let deltaX = fromX - toX;
        let deltaY = fromY - toY; // reverse
        let radians = Math.atan2(deltaY, deltaX);
        let degrees = (radians * 180) / Math.PI - 90; // rotate
        if (force360) {
            while (degrees >= 360) degrees -= 360;
            while (degrees < 0) degrees += 360;
        }
        return degrees;
    }
}

class ShadedBackground {
    constructor(domEl, param) {
        this.view = domEl;
        this.param = param;
        // this.param = JSON.parse(this.view.dataset.param);
        this.centerColor = this.param.centerColor || "yellow";
        this.outerColor = this.param.outerColor || "red";
        this.size = this.param.size || "600px";

        var position = this.view.getBoundingClientRect();
        var objectX = position.x + position.width / 2;
        var objectY = position.y + position.height / 2;

        this.updateGradient({
            x: objectX,
            y: objectY - 200
        });

        window.addEventListener(
            "mousemove",
            function(e) {
                this.updateGradient(e);
            }.bind(this)
        );

        window.addEventListener(
            "scroll",
            function() {
                this.updateGradient({
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 3
                });
            }.bind(this)
        );
    }

    updateGradient(e) {
        var position = this.view.getBoundingClientRect();

        var mouseX = e.x;
        var mouseY = e.y;

        var distanceX = mouseX - position.x;
        var distanceY = mouseY - position.y;

        this.view.style.background = `radial-gradient(${this.size} at ${distanceX}px ${distanceY}px, ${this.centerColor}, ${this.outerColor})`;
    }
}


// Buttons
var shadedButtonElements = document.getElementsByClassName("shadedButton");
var ShadedButtons = [];
for (var i = 0; i < shadedButtonElements.length; i++) {
    ShadedButtons.push(new ShadedBox(shadedButtonElements[i], {
        "centerColor": "#fff",
        "outerColor": "#eee",
        "size": "1200px",
        "shadow": "130, 62, 8",
        "elevation": 50,
        "transparency": 0.15
    }));
}

// Header background
var shadedBackgroundElements = document.getElementsByClassName("shadedBackground");
var shadedBackgrounds = [];
for (var i = 0; i < shadedBackgroundElements.length; i++) {
    shadedBackgrounds.push(new ShadedBackground(shadedBackgroundElements[i], {
        "centerColor": "#fff3b7",
        "outerColor": "#ffdbaf",
        "size": "1200px"
    }));
}

var shadedBoxElements = document.getElementsByClassName("shadedBox");
var ShadedBoxes = [];
for (var i = 0; i < shadedBoxElements.length; i++) {
    ShadedBoxes.push(new ShadedBox(shadedBoxElements[i], {
        "centerColor": "#fff",
        "outerColor": "#eee",
        "size": "1200px",
        "shadow": "130, 130, 130",
        "elevation": 40,
        "transparency": 0.15
    }));
}