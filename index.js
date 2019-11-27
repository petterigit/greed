const express = require("express");
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
const assert = require('assert');
var promise = require("bluebird");
var http = require('http');
var fs = require('fs');

const app = express();
var server = http.createServer(app);
app.use(bodyParser.urlencoded({extended: true}))

/* Rahti compatible stuff */
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
	ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
	mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
	mongoURLLabel = "";
var port = normalizePort(port || '3000');
app.set('port', port);


/* Mongo setup */

// Reading env variables (config example from https://github.com/sclorg/nodejs-ex/blob/master/server.js)
var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null) {
  var mongoHost, mongoPort, mongoDatabase, mongoPassword, mongoUser;
  // If using plane old env vars via service discovery
  if (process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
    mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
    mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
    mongoUser = process.env[mongoServiceName + '_USER'];

  // If using env vars from secret from service binding
  } else if (process.env.database_name) {
    mongoDatabase = process.env.database_name;
    mongoPassword = process.env.password;
    mongoUser = process.env.username;
    var mongoUriParts = process.env.uri && process.env.uri.split("//");
    if (mongoUriParts.length == 2) {
      mongoUriParts = mongoUriParts[1].split(":");
      if (mongoUriParts && mongoUriParts.length == 2) {
        mongoHost = mongoUriParts[0];
        mongoPort = mongoUriParts[1];
      }
    }
  }

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }
}

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  /* Express JS file management */
  var scoreSchema = new mongoose.Schema({
		name: String,
		score: String
	});
	scoreSchema.methods.log = function() {
		var message = this.score
		? "Score of " + this.score + " by " + this.name
		: "Not a score";
	  return message;
	}
	var Score = mongoose.model('Score', scoreSchema);

	app.post('/highscores', (req, res) => {
	  var newScore = new Score();
	  newScore.name = req.body.name + "";
	  newScore.score = req.body.score + "";
	  
	  newScore.save(function (err, newScore) {
		if (err) return console.error(err);
		newScore.log();
		});
	  res.redirect('/');
	});
	
  
  app.use(express.static('public'))
  
  app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
  });
  
  app.post("/gethighscores", (req, res) => {
		let html_content = "";
		
		html_content += getHtmlTop();
		
		html_content += "<h2>Scores</h2>";
		Score.find(function (err, scores) {
		  if (err) return console.error(err);
		  for (let i = 0; i<scores.length; i++) {
			html_content += "<h2>" + scores[i].name + " " + scores[i].score + "</h2>";
		  }
		  
		  html_content += getHtmlTail();
		  fs.writeFile(__dirname + "/public/highscores.html", html_content, function (err) {
			if (err) throw err;
			res.sendFile(__dirname + "/public/highscores.html");
			});
		});
		
		
			
  });
  
  app.listen(8080, () => {
  console.log('listening on 8080')
  })
  
});


function getHtmlTail() {
	
	let text = "";
	text += '</body></html>'
	return text;
	
}

function getHtmlTop() {
	
	let text = "";
	text += '<!DOCTYPE html><html><head>'
	text += '<link rel="stylesheet" type="text/css" href="styles.css">'
	text += '<meta charset="UTF-8" /><title>Greed</title>'
	text += '</head><body>'
	return text;
}


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
