
var five = require("johnny-five");
console.log("Connecting to board")
var board = new five.Board();
console.log("Instance created")

board.on("ready", function() {

  console.log("Board Ready")

  // Create a new `servo` hardware instance.
  var servo = new five.Servo(10);

  // Create a new `animation` instance.
  var animation = new five.Animation(servo);

  // Enqueue an animation segment with options param
  animation.enqueue({
    cuePoints: [0, 0.25, 0.75, 1],
    keyFrames: [90, { value: 180, easing: "inQuad" }, { value: 0, easing: "outQuad" }, 90],
    duration: 3000
  });

  setTimeout(function(){
    process.exit(0);
  }, 3000);

  // Inject the `servo` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    servo: servo,
    animation: animation
  });


  /* Pseudo code

      if(hold){
        call takePic
    }


    Everything below is the code for the button
  */

  button = new five.Button(2);

  // Inject the `button` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    button: button
  });

  // Button Event API

  // "down" the button is pressed
  button.on("down", function() {
    console.log("down");
  });

  // "hold" the button is pressed for specified time.
  //        defaults to 500ms (1/2 second)
  //        set
  button.on("hold", function() {
    console.log("hold");
  });

  // "up" the button is released
  button.on("up", function() {
    console.log("up");
  });
});
