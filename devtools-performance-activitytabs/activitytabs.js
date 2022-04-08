function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

function a() {
  wait(500);
}

function b() {
  wait(500);
}

function c() {
  wait(500);
}

document.querySelector("#atgo").addEventListener("click", () => {
  document.querySelector("#atgo").disabled = true;
  a();
  b();
  c();
  document.querySelector("#atgo").disabled = false;
});
