/*
	Laurent Baumann
	lobau.io/
	@lobau
*/

class ShadedBox {
  constructor(domEl, param) {
    this.view = domEl;
    this.param = param;
    this.shadow = this.param.shadow || "255, 0, 0";
    this.size = this.param.size || "400px";
    this.elevation = this.param.elevation || 30;
    this.transparency = this.param.transparency || 0.15;

    var position = this.view.getBoundingClientRect();
    var objectX = position.x + position.width / 2;
    var objectY = position.y + position.height / 2;

    this.updateShadow({
      x: objectX,
      y: objectY - 200,
    });

    window.addEventListener(
      "mousemove",
      function (e) {
        this.updateShadow(e);
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
    var distanceY = objectY - mouseY + 160; // 160 vertical offset so shadow is visible on hover

    var distanceToMouseX = mouseX - position.x;
    var distanceToMouseY = mouseY - position.y;

    this.view.style.backgroundImage = `radial-gradient(${this.size} at ${distanceToMouseX}px ${distanceToMouseY}px, var(--gradient-light), var(--gradient-dark))`;

    var maxShadows = 6;
    var shadowString = "";
    shadowString += `inset 0px 0px 0px 1px rgba(0, 0, 0, 0.25), `;

    var offsetX, offsetY, blur, falloff, transparency, distance;
    for (var i = 1; i < maxShadows; i++) {
      if (i != 1) {
        shadowString += ", ";
      }
      offsetX = distanceX / (i * i * this.elevation);
      offsetY = distanceY / (i * i * this.elevation);
      distance = Math.abs(offsetX) + Math.abs(offsetY);

      blur = distance / 1.5;
      falloff = distance / 5;
      transparency = this.transparency / i;
      shadowString += `${offsetX}px ${offsetY}px ${blur}px -${falloff}px rgba(${this.shadow}, ${transparency})`;
    }

    var maxOffset = 3;
    var innerShadowOffsetX = Math.min(
      Math.max(distanceX / 100, -maxOffset),
      maxOffset
    );
    var innerShadowOffsetY = Math.min(
      Math.max(distanceY / 100, -maxOffset),
      maxOffset
    );
    shadowString += `, inset ${innerShadowOffsetX}px ${innerShadowOffsetY}px 5px -1px var(--gradient-light)`;

    this.view.style.boxShadow = shadowString;
  }
}

var buttonStyle = {
  shadow: "85, 3, 77",
  size: "500px",
  elevation: 80,
  transparency: 0.08,
};

var Shaded_elements = [];
var shaded_el = document.querySelectorAll("a");
for (var i = 0; i < shaded_el.length; i++) {
  console.log(shaded_el[i]);
  Shaded_elements.push(new ShadedBox(shaded_el[i], buttonStyle));
}
