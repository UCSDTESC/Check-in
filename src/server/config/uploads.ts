import * as crypto from 'crypto';
import * as mime from 'mime';
import multer from 'multer';

const storage = multer.diskStorage({
  dest: 'public/uploads/',
  filename: (req, file, cb) => {
    return crypto.pseudoRandomBytes(16, (err, raw) =>
      cb(null, `${raw.toString('hex')}.${mime.getExtension(file.mimetype)}`));
  },
});

export default multer({
  storage,
  // 5MB file size
  limits: {fileSize: 5 * 1024 * 1024},
});
