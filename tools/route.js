const fs = require('fs');
const { promisify } = require('util');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const ejs = require('ejs');
const path = require('path');
const mime = require('mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

const tplPath = path.join(__dirname, '../views/index.ejs');
const source = fs.readFileSync(tplPath, 'utf8');
const template = ejs.compile(source);

module.exports = async function (req, res, filePath, config) {
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      // console.log('ext', path.extname(path.basename(filePath)).split('.').pop());
      const ext = path.extname(path.basename(filePath)).replace('.', '');
      const ct = mime.getType(ext) || 'text/plain';
      res.setHeader('Content-Type', ct + ';charset=utf-8');
      if (isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }
      /*let content = '';
       const readStream = fs.createReadStream(filePath, 'utf8');
       readStream.on('data', function(chunk) {
       content += chunk;
       }).on('end', function (chunk) {
       res.end(content);
       });*/
      // 将数据通过管道推送给res, 当文件较大时，也不会阻塞
      let rs;
      const { code, start, end } = range(stats.size, req, res);
      if (code === 200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath, 'utf8');
      }else {
        res.statusCode = 216;
        rs = fs.createReadStream(filePath, { start, end }, 'utf8');
      }
      
      if (filePath.match(config.compressExt)) {
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
    }else if(stats.isDirectory()) {
      res.setHeader('Content-Type', 'text/html;charset=utf-8');
      const files = await readdir(filePath);
      /*ejs.renderFile('./views/index.ejs', { files }, function (error, str) {
        res.end(str);
      });*/
      
      const dir = path.relative(config.root, filePath);
      // console.log('dir', dir);
      res.end(template({
        title: path.basename(filePath),
        dir: dir ? '/' + dir : '',
        files
      }));
    }
  }catch (err) {
    console.error(err);
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.statusCode = 404;
    res.end(filePath + 'is not found!');
  }
}