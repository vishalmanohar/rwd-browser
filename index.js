var express = require('express')
var fs = require('fs')

var app = express();
var rootScreenshotFolder = '/Users/vishal/tw_projects/banner/cinnamon/rwd-tests/build/results/'

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(express.static(rootScreenshotFolder + "tablet"))
app.use(express.static(rootScreenshotFolder + "desktop"))
app.use(express.static(rootScreenshotFolder + "mobile"))

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})


app.get('/files/:device', function(request, response) {
  var device = request.params.device
  return fs.readdir(rootScreenshotFolder + device, function(err, files){
  	var imageFiles = files.filter(function (file) {return file.substr(-4) === ".png"})
    var groupedFileNames = []

  	var originalFiles = imageFiles.filter(function (file) {return (file.indexOf(".fail.") == -1  &&  file.indexOf(".diff.")  == -1) })
  	originalFiles.forEach(function(file){
		var displayName = file.replace(".png", "")//.replace("tablet_", "").replace("mobile_", "").replace("desktop_", "")
  		var errorFileName = file.replace(".png", ".fail.png");
  		var diffFileName = file.replace(".png", ".diff.png");
  		var fileResponse = {name : displayName, baseline : file, diff : diffFileName}
  		if(imageFiles.indexOf(errorFileName) > -1){
  			fileResponse.fail = errorFileName;
  		}
  		groupedFileNames.push(fileResponse)
  	});


  	 var data = {
  	 	"files" : groupedFileNames
  	 }
  	 response.send(data)
  });
});
