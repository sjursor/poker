var		firebase = require('firebase-admin');

const 	express = require('express');
const 	ecstatic = require('ecstatic');
const 	http = require('http');

const app = express();

app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use('/firebase.js', express.static(__dirname + 'firebase.js'));

app.use(ecstatic({
  root: `${__dirname}/public`,
  showdir: false,
}));

http.createServer(app).listen(8080);

console.log('See if its cool on -> :8080');

/*
const hostname = '127.0.0.1';
const port = 3000;
const http = require('http');
var   index = fs.readFileSync('public/index.html');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(index);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/