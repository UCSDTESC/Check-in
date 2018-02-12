var crypto = require('crypto');

var multer = require('multer');
var mime = require('mime');

module.exports = function() {
  var storage = multer.diskStorage({
    dest: 'public/uploads/',
    filename(req, file, cb) {
      return crypto.pseudoRandomBytes(16, (err, raw) =>
        cb(null, raw.toString('hex') + '.' + mime.extension(file.mimetype)));
    }
  });

  return multer({
    storage,
    //5MB file size
    limits: {fileSize: 5 * 1024 * 1024}
  });
};
