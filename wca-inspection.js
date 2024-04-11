document.ontouchmove = function (event) {
  event.preventDefault();
};

var state = "ready";
var running = false;
var startTime;
var lastSecond;
var stopColor;

var states = {
  ready: { function: null, down: "set", up: "set" },
  set: { function: set, down: "set", up: "go" },
  go: { function: startTimer, down: "stop", up: "stop" },
  stop: { function: stopTimer, down: "ready", up: "ready" },
};

var fading = [
  { time: 8, color: "#ff0" },
  { time: 12, color: "#f80" },
  { time: 15, color: "#f00" },
  { time: 17, color: "#800" },
];

const recentAnimations = new Set();
function startAnimation(animation, ms) {
  stopRecentAnimations();
  recentAnimations.add(animation);
  setTimeout(() => {
    recentAnimations.delete(animation)
  }, ms + 100);
}
function stopRecentAnimations() {
  for (const animation of recentAnimations) {
    animation.cancel();
  }
  recentAnimations.clear();
}

function setSec(value) {
  var strValue = "" + value;
  document.body.querySelector("#sec-first").textContent = (strValue.charAt(0));
  document.body.querySelector("#sec-rest").textContent = (strValue.substr(1));
}

function set() {
  setSec(0);
  document.body.querySelector("#milli").textContent = ("00");
  document.body.querySelector("#main").style.backgroundColor =  "#987";
  document.body.querySelector("#main").classList.add("ready-pulse");
  document.body.querySelector("#main").style.backgroundColor = null;
}

function startTimer() {
  running = true;
  lastSecond = startTime = Math.floor(performance.now());
  animFrame();
  stopColor = "green";
  document.body.querySelector("#main").style.backgroundColor = ("green");
  document.body.querySelector("#main").classList.remove("ready-pulse");
}

function stopTimer() {
  startAnimation(document.body.querySelector("#main").animate([{opacity: 0, backgroundColor: stopColor}, {opacity: 1}], {duration: 250}), 250);
  // document.body.querySelector("#main").stop().fadeOut(0).css("background-color", stopColor).fadeIn(250);
  running = false;
}

function animFrame() {
  if (running) {
    var now = Math.floor(performance.now());
    var currentSecond = Math.floor((now - startTime) / 1000);
    setSec(currentSecond);
    document.body.querySelector("#milli").textContent = (
      ("00" + (Math.floor((now - startTime) / 10) % 1000)).substr(-2)
    );

    for (const i in fading) {
      var time = fading[i].time;
      var color = fading[i].color;

      function justPassed(threshold) {
        return lastSecond < threshold && currentSecond === threshold;
      }

      if (justPassed(time - 1)) {
        startAnimation(document.body.querySelector("#main").animate([{backgroundColor: color}], {duration: 1000, fill: "forwards", overwrite: true}), 1000);
        // document.body.querySelector("#main").animate({ "background-color": color }, 1000);
      }
      if (justPassed(time)) {
        console.log({stopColor, color})
        stopColor = color;
        document.body.querySelector("#main").style.backgroundColor = stopColor;
        startAnimation(document.body.querySelector("#main").animate([{opacity: 0}, {opacity: 1}], {duration: 250, fill: "forwards"}), 250);
        // document.body.querySelector("#main").fadeOut(0).fadeIn(250);
      }
    }

    lastSecond = currentSecond;
    requestAnimationFrame(animFrame);
  }
}

function touchHandler(direction) {
  state = states[state][direction];

  // console.log("state", state);
  if (states[state]["function"]) {
    states[state]["function"]();
  }
}

function keyboardHandler(direction, ev) {
  // Only trigger on spacebar.
  if (ev.which === 32) {
    touchHandler(direction);
  }
}

// If we do this now, we can avoid flickering later.
setSec("-");
document.body.querySelector("#milli").textContent = ("--");

FastClick.attach(document.body);
document.body.addEventListener("keypress", keyboardHandler.bind(this, "down"));
document.body.addEventListener("keyup", keyboardHandler.bind(this, "up"));
document.body.addEventListener("touchstart", touchHandler.bind(this, "down"));
document.body.addEventListener("touchend", touchHandler.bind(this, "up"));

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistration().then(
    function (r) {
      console.log(r);
      if (!r) {
        navigator.serviceWorker.register("./service-worker.js").then(
          function (registration) {
            console.log(
              "Registered service worker with scope: ",
              registration.scope
            );
          },
          function (err) {
            console.error(err);
          }
        );
      } else {
        console.log("Service worker already registered.");
      }
    },
    function (err) {
      console.error("Could not enable offline support.");
    }
  );
}
