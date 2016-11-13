var requestUrl = "https://api.projectoxford.ai/vision/v1.0/describe?maxCandidates=1";
var testImageUrl = "http://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Bagel-Plain-Alt.jpg/250px-Bagel-Plain-Alt.jpg";
var request = require("request");

request({
  uri: requestUrl,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": "0ae68972dd774a458bacefaa1001b080"
  },
  body: JSON.stringify({"url": testImageUrl})
}, function(error, response, body) {
  var desired = getDescription(body);
  console.log(desired);
  return desired;
});

function getDescription(results) {
  var desired = JSON.parse(results);
  return desired.description.captions[0].text;
}

function setImageUrl(newImageUrl) {
  testImageUrl = newImageUrl;
}

function setImageData(newImageData) {
  testImageData = newImageData;
}
