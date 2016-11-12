var autonomy = require('ardrone-autonomy');
var mission  = autonomy.createMission();
var Kinect2 = require('kinect2'),
	express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
cv = require('opencv');

var faceCount = 0;

var kinect = new Kinect2();

function Vector(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

function vectorSubtract(u, v) {
	var x = u.x - v.x;
	var y = u.y - v.y;
	var z = u.z - v.z;
	return new Vector(x, y, z);
}

var point;
var gotPoint = false;

if(kinect.open()) {
	server.listen(8000);
	console.log('Server listening on port 8000');
	console.log('Point your browser to http://localhost:8000');

	app.get('/', function(req, res) {
		res.sendFile(__dirname + '/public/index.html');
	});

	kinect.on('bodyFrame', function(bodyFrame){
		io.sockets.emit('bodyFrame', bodyFrame);
		bodyFrame.bodies.forEach(function(body) {
			if (body.rightHandState == Kinect2.HandState.open && !gotPoint) {
				var elbowJoint = body.joints[Kinect2.JointType.elbowRight];
				var wristJoint = body.joints[Kinect2.JointType.wristRight];
				var elbow = new Vector(elbowJoint.cameraX, elbowJoint.cameraY, elbowJoint.cameraZ);
				var wrist = new Vector(wristJoint.cameraX, wristJoint.cameraY, wristJoint.cameraZ);
				var rightFootJoint = body.joints[Kinect2.JointType.footRight];
				var rightFoot = new Vector(rightFootJoint.cameraX, rightFootJoint.cameraY, rightFootJoint.cameraZ);
				var leftFootJoint = body.joints[Kinect2.JointType.footLeft];
				var leftFoot = new Vector(leftFootJoint.cameraX, leftFootJoint.cameraY, leftFootJoint.cameraZ);
				var pointLine = vectorSubtract(wrist, elbow);
				var t = ((rightFoot.y + leftFoot.y) / 2 - elbow.y) / pointLine.y;
				point = new Vector(elbow.x + t * pointLine.x, elbow.y + t * pointLine.y, elbow.z + t * pointLine.z);
				console.log('Floor Point X: ' + point.x + ' Y: ' + point.y + ' Z: ' + point.z);
				gotPoint = true;
				goToPoint(point);
			}/*
			 else if (body.rightHandState == Kinect2.HandState.lasso && gotPoint) {
			 gotPoint = false;
			 }*/
		});
	});

	kinect.openBodyReader();
}

function goToPoint(coords) {
	mission.zero();
	mission.takeoff();
	mission.altitude(1.5);
	console.log(coords.x, coords.z);
	mission.go({x: coords.z, y: -coords.x - 0.25, z: 0});
	// mission.hover(1000);
	//comp vision logic
	mission.go({x: 0, y: 0, z: 1});
	mission.land();

	mission.run(function (err, result) {
		if (err) {
			console.trace("Oops, something bad happened: %s", err.message);
			mission.client().stop();
			mission.client().land();
		} else {
			console.log("Mission success!");
			process.exit(0);
		}
	});
}
/*
 var player = require('play-sound')(opts = {player: "./res/mplayer.exe"})
 var client = autonomy.createClient();
 var pngStream = client.getPngStream();
 pngStream.on('data', function(pngBuffer) {
 cv.readImage(pngBuffer, function(err, im) {
 im.detectObject('haarcascade_frontalface_alt.xml', {}, function(err, faces) {
 for (var i = 0; i < faces.length; i++) {
 var face = faces[i];
 if (face.width >= 75 && face.height >= 75) {
 faceCount++;
 console.log('Face detected.');
 }
 if (faceCount > 15) {
 // $ mplayer foo.mp3
 player.play('./res/tts.mp3', function(err){
 if (err) throw err
 });
 faceCount = 0;
 }
 }
 })
 });
 });
 */

// -
