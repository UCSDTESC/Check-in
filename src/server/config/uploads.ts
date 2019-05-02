import * as crypto from 'crypto';
import { extension } from 'mime';
import * as multer from 'multer';

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    return crypto.pseudoRandomBytes(16, (err, raw) =>
      cb(null, `${raw.toString('hex')}.${extension(file.mimetype)}`));
  },
});

export default multer({
  storage,
  // 5MB file size
  limits: {fileSize: 5 * 1024 * 1024},
});
