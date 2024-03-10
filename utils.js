function random(max) {
  return Math.floor(Math.random() * max);
}

function randomInRange(from, to) {
  var r = Math.random();
  return Math.floor(r * (to - from) + from);
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
