var Kinect2 = require('./../lib/kinect2'), //change to 'kinect2' in a project of your own
	express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	zlib = require('zlib');

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
			zlib.deflate(data, function(err, result){
				if(!err) {
					// var min = Infinity;
					var json = result.toJSON(result);
					var length = json.data.length;

					// console.log((json.data[Symbol.iterator]) === 'function');

					if (json.data.length < 30000) {
						console.log("TRIGGERED " +  counter++);
					}

					// for (var dataPoint in json.data) {
					// 		if (dataPoint > 255) {
					// 			counter++;
					// 		}
					// }
                    //
					// if ((counter + 0.0)/length > 0.5) {
					// 	console.log("TRIGGERED " +  counter++);
					// }

					var buffer = result.toString('base64');
					io.sockets.sockets.forEach(function(socket){
						socket.volatile.emit('depthFrame', buffer);
					});
				}
				compressing = false;
			});
		}
	});

	kinect.openDepthReader();
}
