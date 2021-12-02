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

function setSec(value) {
  var strValue = "" + value;
  $("#sec-first").html(strValue.charAt(0));
  $("#sec-rest").html(strValue.substr(1));
}

function set() {
  setSec(0);
  $("#milli").html("000");
  $("#main").css("background-color", "#987");
  $("#main").addClass("ready-pulse");
}

function startTimer() {
  running = true;
  lastSecond = startTime = Math.floor(performance.now());
  animFrame();
  stopColor = "green";
  $("#main").css("background-color", "green");
  $("#main").removeClass("ready-pulse");
}

function stopTimer() {
  $("#main").stop().fadeOut(0).css("background-color", stopColor).fadeIn(250);
  running = false;
}

function animFrame() {
  if (running) {
    var now = Math.floor(performance.now());
    var currentSecond = Math.floor((now - startTime) / 1000);
    setSec(currentSecond);
    $("#milli").html(("000" + ((now - startTime) % 1000)).substr(-3));

    for (i in fading) {
      var time = fading[i].time;
      var color = fading[i].color;

      function justPassed(threshold) {
        return lastSecond < threshold && currentSecond === threshold;
      }

      if (justPassed(time - 1)) {
        $("#main").animate({ "background-color": color }, 1000);
      }
      if (justPassed(time)) {
        stopColor = color;
        $("#main").fadeOut(0).fadeIn(250);
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

$(document.body).ready(function () {
  // If we do this now, we can avoid flickering later.
  setSec("-");
  $("#milli").html("---");

  FastClick.attach(document.body);
  $(document.body).on("keypress", keyboardHandler.bind(this, "down"));
  $(document.body).on("keyup", keyboardHandler.bind(this, "up"));
  $(document.body).on("touchstart", touchHandler.bind(this, "down"));
  $(document.body).on("touchend", touchHandler.bind(this, "up"));
});

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
