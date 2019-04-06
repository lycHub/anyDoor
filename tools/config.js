module.exports = {
  hostname: 'localhost',
  port: 3000,
  root: process.cwd(),   // F:\node\练习\anyDoor
  compressExt: /\.(html|js|css|md|json)/,
  cache: {
    maxAge: 600,    // 有效期，单位秒
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true,
    open: false
  }
}