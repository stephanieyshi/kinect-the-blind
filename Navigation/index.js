var Kinect2 = require('./../lib/kinect2'), //change to 'kinect2' in a project of your own
	express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	zlib = require('zlib');
var five = require("johnny-five");
var board = new five.Board();
// var sync = require('synchronize');
// var fiber = sync.fiber;
// var await = sync.await;
// var defer = sync.defer;

var animation;
var turning = false;

var kinect = new Kinect2();

if(kinect.open()) {
	server.listen(8000);
	console.log('Server listening on port 8000');
	console.log('Point your browser to http://localhost:8000');

	app.use(express.static(__dirname + '/public'));

	var compressing = false;
	var counter = 0;
	kinect.on('depthFrame', function(data){
		//compress the depth data using zlib
		if(!compressing) {
			compressing = true;
			zlib.deflate(data, (function(err, result){
				if(!err) {
					// var min = Infinity;
					var json = result.toJSON(result);
					var length = json.data.length;

					// console.log((json.data[Symbol.iterator]) === 'function');

					var buffer = result.toString('base64');
					io.sockets.sockets.forEach(function(socket){
						socket.volatile.emit('depthFrame', buffer);
					});

					if (json.data.length < 30000) {
						console.log("TRIGGERED " +  counter++);
						turnMotor();
					}

					// for (var dataPoint in json.data) {
					// 		// if (dataPoint > 255) {
					// 		// 	counter++;
					// 		// }
					// 	console.log(dataPoint[]);
					// }
                    //
					// if ((counter + 0.0)/length > 0.5) {
					// 	console.log("TRIGGERED " +  counter++);
					// 	turnMotor();
					// }

				}
				compressing = false;
			}));
		}
	});

	kinect.openDepthReader();
}

board.on("ready", function() {

		// Create a new `servo` hardware instance.
		var servo = new five.Servo(10);
		// Create a new `animation` instance.
		animation = new five.Animation(servo);



		// setTimeout(function () {
		// 	process.exit(0);
		// }, 3000);

		// Inject the `servo` hardware into
		// the Repl instance's context;
		// allows direct command line access
		board.repl.inject({
			servo: servo,
			animation: animation
		});

		// process.exit(0);


});

function  turnMotor() {
	if (turning || !animation) return;
	// Enqueue an animation segment with options param
	// See Animation example and docs for details
	turning = true;
	console.log('turning');
	animation.enqueue({
		cuePoints: [0, 0.25, 0.75, 1],
		keyFrames: [90, { value: 180, easing: "inQuad" }, { value: 0, easing: "outQuad" }, 90],
		duration: 3000
	});
	setTimeout(function() {
		turning=false;
	}, 3000);
}