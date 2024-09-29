var radius = 340;

var autoRotate = true;
var rotateSpeed = -60;
var imgWidth = 200;
var imgHeight = 170;

setTimeout(init, 1000);

var ordrag = document.getElementById("drag-container");
var ospin = document.getElementById("spin-container");
var aImg = document.getElementsByTagName("img");
var aEle = [...aImg];

ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

var ground = document.getElementById("ground");
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform =
      "rotateY(" +
      i * (360 / aEle.length) +
      "deg) translateZ(" +
      radius +
      "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTransform(obj) {
  if (tY > 180) tY = 180;
  if (tY < 0) tY = 0;

  obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = yes ? "running" : "pause";
}

var sY,
  sX,
  nX,
  nY,
  desX = 0,
  desY = 0,
  tX = 0,
  tY = 10;

if (autoRotate) {
  var animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
  ospin.style.animation = `${animationName} ${Math.abs(
    rotateSpeed
  )}s infinite linear`;
}

document.onpointerdown = function (e) {
  clearInterval(ordrag.timer);
  e = e || window.event;
  sX = e.clientX;
  sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    nX = e.clientX;
    nY = e.clientY;

    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTransform(ordrag);
    sX = nX;
    sY = nY;
  };
  this.onpointerup = function (e) {
    ordrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTransform(ordrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(ordrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };
  return false;
};

document.onmousewheel = function (e) {
  e = e || window.event;

  var d = e.wheelDelta / 20 || -e.deltaY / 20; // deltaY for modern browsers
  radius += d;
  init(1); // Optional: This could be optimized if recalculating isn't needed every scroll
};
