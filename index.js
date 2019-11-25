const express = require("express");
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(bodyParser.urlencoded({extended: true}))

/* Rahti compatible stuff */
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
	ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
	mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
	mongoURLLabel = "";
var port = normalizePort(port || '3000');
app.set('port', port);


/* Mongo setup */
//const url = "mongodb+srv://greedadmin:greedadmin@greed-igors.mongodb.net/test?retryWrites=true&w=majority";

// Reading env variables (config example from https://github.com/sclorg/nodejs-ex/blob/master/server.js)
var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

// For local dev
// var mongoURL = 'mongodb://localhost:27017/demodb';

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


const client = new MongoClient(mongoURL, {useUnifiedTopology: true}, { useNewUrlParser: true });
client.connect(err => {
  //const collection = client.db("greed").collection("devices");
  // perform actions on the collection object
  db = client.db(mongoDatabase);
  
  /* var cursor = db.collection('highscores').find();
  cursor.each(function(err, document) {
	  console.log(document);
  });
  */
  
  
  
  app.post('/highscores', (req, res) => {
	  db.collection('highscores').insertOne(req.body, (err, result) => {
		if (err) return console.log(err)
		res.redirect('/')
		console.log('saved to database')
		let cursor = db.collection('highscores').find();
		cursor.each(function(err, document) {
			console.log(document);
		});
	  })
	})
  /* Express JS file management */
  app.use(express.static('public'))
  app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
  });
  
  app.listen(port, () => {
  console.log('listening on ' + port)
  })
  client.close();
  
  
});

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
