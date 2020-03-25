var		firebase = require('firebase-admin');

const 	express = require('express');
const 	ecstatic = require('ecstatic');
const 	http = require('http');
const 	https = require('https');
const	fs = require('fs');

var privateKey = fs.readFileSync('sslcert/localhost.key');
var certificate = fs.readFileSync('sslcert/localhost.crt');
var credentials = {key: privateKey, cert: certificate};

var app = express();

app.use('/scripts', express.static(__dirname + '/node_modules/'));
//app.use('/firebase.js', express.static(__dirname + 'firebase.js'));

app.use(ecstatic({
  root: `${__dirname}/public`,
  showdir: false,
}));

//var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

//httpServer.listen(8080);
httpsServer.listen(8443);

//http.createServer(app).listen(8080);

console.log('See if its cool on -> :8080');
console.log('See if its https on -> :8443');