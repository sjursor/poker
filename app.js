var		firebase = require('firebase-admin');

const 	express = require('express');
const 	ecstatic = require('ecstatic');
const 	http = require('http');

const app = express();

app.use('/scripts', express.static(__dirname + '/node_modules/'));
//app.use('/firebase.js', express.static(__dirname + 'firebase.js'));

app.use(ecstatic({
  root: `${__dirname}/public`,
  showdir: false,
}));

http.createServer(app).listen(8080);

console.log('See if its cool on -> :8080');