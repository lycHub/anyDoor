const program = require('commander');
const Server = require('./app');
// .command('anyDoor [options]')
program
  .usage('anyDoor [options] <file ...>')
  .option('-P, --port <n>', 'port,default=3000')
  .option('-H, --hostname  [value]', 'hostname,default=localhost')
  .option('-D, --dir  [value]', 'root path, default=process.cwd()')
  .option('-O, --open', 'Open browser automatically')
  .version('0.0.1')
  .parse(process.argv);

const config = {
  port: program.port || 3000,
  hostname: program.hostname || 'localhost',
  root: program.dir || process.cwd(),
  open: program.open || false
};

new Server(config).start();