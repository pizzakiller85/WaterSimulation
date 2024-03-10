// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width;
var height;
var objCount = 1000;
var objSize = 20;
var deathAge = 100000;
var maturaty = 2000;
//var maturaty = 20000;
var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;
var fps = 160;

var resize = function () {
  width = window.innerWidth * 2;
  height = window.innerHeight * 2;
  canvas.width = width;
  canvas.height = height;
};
window.onresize = resize;
resize();

ctx.fillStyle = "#123123";

var states = [];

var colors = ["blue", "green", "red"];

function createNewObj(newx, newy, newcolor, newage) {
  var state = {
    x: newx,
    y: newy,
    color: newcolor,
    size: objSize,
    age: newage,
  };
  return state;
}
function initStates() {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  console.log(startTime);

  for (var i = 0; i < objCount; i++) {
    var rand = randomInRange(-width, width);

    var rand2 = randomInRange(-height, height);
    var state = {
      x: width / 2 + rand,
      y: height / 2 + rand2,
      color: colors[random(3)],
      size: objSize,
      age: random(deathAge / 10),
    };
    states.push(state);
  }
}
initStates();

var multi = 0.3;
var dirsx = [-1, 1];

function update(progress) {
  for (var i = 0; i < states.length; i++) {
    var state = states[i];
    var rand = random(2);

    if (rand == 0) state.x += progress * multi;
    else if (rand == 1) state.x -= progress * multi;

    rand = random(2);

    if (rand == 0) state.y += progress * multi;
    else if (rand == 1) state.y -= progress * multi;

    checkBoundary(state);
  }
}
function checkBoundary(state) {
  if (state.y > height) {
    state.y -= height;
  }
  if (state.x > width) {
    state.x -= width;
  }

  if (state.x < 0) {
    state.x = width;
  }
  if (state.y < 0) {
    state.y = height;
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  for (var i = 0; i < states.length; i++) {
    var state = states[i];
    state.age++;
    if (state.age < deathAge) {
      ctx.fillStyle = state.color;
      ctx.fillRect(
        state.x - state.size / 2,
        state.y - state.size / 2,
        state.size,
        state.size
      );
    } else {
      i--;
      states.splice(i, 1);
    }
  }

  var objs = states.length;
  for (var i = 0; i < objs; i++) {
    var s1 = states[i];

    for (var j = i; j < objs; j++) {
      if (j == i) continue;
      var s2 = states[j];
      var lim = 20;
      if (
        s1.x + lim > s2.x &&
        s1.x - lim < s2.x &&
        s1.y + lim > s2.y &&
        s1.y - lim < s2.y
      ) {
        if (s1.color == "blue" && s2.color == "red") {
          states.splice(j, 1);
        } else if (s1.color == "red" && s2.color == "blue") {
          states.splice(i, 1);
        } else if (s1.color == "blue" && s2.color == "green") {
          states.splice(i, 1);
        } else if (s1.color == "green" && s2.color == "blue") {
          states.splice(j, 1);
        } else if (s1.color == "red" && s2.color == "green") {
          states.splice(j, 1);
        } else if (s1.color == "green" && s2.color == "red") {
          states.splice(i, 1);
        }
        // green makes babies
        else if (
          s1.color == "green" &&
          s2.color == "green" &&
          s1.age > maturaty &&
          s2.age > maturaty
        ) {
          var newState = createNewObj(s1.x, s1.y, s1.color, 0);
          states.push(newState);
        }
        // red makes babies
        else if (
          s1.color == "red" &&
          s2.color == "red" &&
          s1.age > maturaty &&
          s2.age > maturaty
        ) {
          var newState = createNewObj(s1.x, s1.y, s1.color, 0);
          states.push(newState);
        }
        // blue makes babies
        else if (
          s1.color == "blue" &&
          s2.color == "blue" &&
          s1.age > maturaty &&
          s2.age > maturaty
        ) {
          var newState = createNewObj(s1.x, s1.y, s1.color, 0);
          states.push(newState);
        }

        objs--;
        //console.log("colission");
        //states.splice(j, 1);
        //console.log("colission" + states.length);
        break;
      }
    }
  }
}
function loop(timestamp) {
  var progress = timestamp - lastRender;

  //console.log(timestamp + " " + lastRender + " " + progress)

  lastRender = timestamp;
  window.requestAnimationFrame(loop);

  now = Date.now();
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame
  createStats();
  if (elapsed > fpsInterval) {
    update(progress);
    draw();

    // Get ready for next frame by setting then=now, but...
    // Also, adjust for fpsInterval not being multiple of 16.67
    then = now - (elapsed % fpsInterval);

    // TESTING...Report #seconds since start and achieved fps.
    var sinceStart = now - startTime;
    var currentFps =
      Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100;
    //$results.text("Elapsed time= " + Math.round(sinceStart / 1000 * 100) / 100 + " secs @ " + currentFps + " fps.");
    console.log("aaaaaaa");
    document.getElementById("fps").innerHTML =
      "Elapsed time= " +
      Math.round((sinceStart / 1000) * 100) / 100 +
      " secs @ " +
      currentFps +
      " fps.";
  }
}
function createStats() {
  document.getElementById("objCount").innerHTML = states.length;
  document.getElementById("objCountBlue").innerHTML = states.filter(
    (x) => x.color == "blue"
  ).length;
  document.getElementById("objCountRed").innerHTML = states.filter(
    (x) => x.color == "red"
  ).length;
  document.getElementById("objCountGreen").innerHTML = states.filter(
    (x) => x.color == "green"
  ).length;

  //document.getElementById("fps").innerHTML = "Elapsed time= " + Math.round(sinceStart / 1000 * 100) / 100 + " secs @ " + currentFps + " fps.";
}

var lastRender = 0;
window.requestAnimationFrame(loop);
