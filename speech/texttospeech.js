var request = require("request");
var authorization = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6Imh0dHBzOi8vc3BlZWNoLnBsYXRmb3JtLmJpbmcuY29tIiwic3Vic2NyaXB0aW9uLWlkIjoiMzYzOGRjZmQ2ZDhmNDljZmE2MjA2MmNhODcxMWUxZWUiLCJwcm9kdWN0LWlkIjoiQmluZy5TcGVlY2guUHJldmlldyIsImNvZ25pdGl2ZS1zZXJ2aWNlcy1lbmRwb2ludCI6Imh0dHBzOi8vYXBpLmNvZ25pdGl2ZS5taWNyb3NvZnQuY29tL2ludGVybmFsL3YxLjAvIiwiYXp1cmUtcmVzb3VyY2UtaWQiOiIiLCJpc3MiOiJ1cm46bXMuY29nbml0aXZlc2VydmljZXMiLCJhdWQiOiJ1cm46bXMuc3BlZWNoIiwiZXhwIjoxNDc5MDMwNjA0fQ.NsGU-51yqvomlPrBE6tr5ObbtfdrtkqEVmXFt5Lh7E4";
var beg = "<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)'>";
var text = "Microsoft Bing Voice Output API";
var end = "</voice></speak>";
var bodyStuff = beg + text + end;
var requestUrl = "https://speech.platform.bing.com/synthesize";

//var play = require('play').Play();

var player = require('play-sound')(opts = {})

request({
  uri: requestUrl,
  method: "POST",
  headers: {
    "Content-Type": "application/ssml+xml",
    "Ocp-Apim-Subscription-Key": "cb43a35ea21840e3b91671cac2a50faa",
    "X-Microsoft-OutputFormat": "riff-8khz-8bit-mono-mulaw",
    "User-Agent": "kinect-the-blind",
    "Authorization": authorization
  },
  body: bodyStuff
}, function(error, response, body) {
  // body.play();

  // $ mplayer foo.mp3
  player.play(body, function(err){
    if (err) throw err
  })
});

function setText(newString) {
  text = newString;
  bodyStuff = beg + text + end;
}
