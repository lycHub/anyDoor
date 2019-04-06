// 文件的范围读取
module.exports = function (totalSize, req, res) {
  const range = req.headers['range']; // https://www.cnblogs.com/1995hxt/p/5692050.html
  if (range) {
    // 因为有分组，所以match返回的是['匹配到的内容', '分组一', '分组二']
    const sizes = range.match(/bytes=(\d*)-(\d*)/);
    
    const end = sizes[2] || totalSize - 1;
    const start = sizes[1] || totalSize - end;
    if (start < 0 || end > totalSize || start > end) {
      return { code: 200 };
    }else {
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`);
      res.setHeader('Content-Length', end - start);
      return {
        code: 206,
        start: Number.parseInt(start),
        end: Number.parseInt(end)
      };
    }
  }else {
    return { code: 200 };
  }
}