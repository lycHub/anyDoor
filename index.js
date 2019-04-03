const http = require('http');
const chalk = require('chalk');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('Hello World XXX');
});

server.listen(port, hostname, () => {
  const addr = `http://${hostname}:${port}`;
  console.info(`Server running at ${chalk.green(addr)}`);
});