import multer from 'multer';

import { join, extname } from 'path';
import { includes } from 'lodash';

const fileSize = 1024 * 1024 + 200;

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

  const size = req.rawHeaders.slice(-1)[0];

  if (size > fileSize) {
    file.err = new Error('File size limit exceeded');
  }

  if (!includes(allowedMimes, file.mimetype)) {
    file.err = new Error('Unsupported file type format');
  }

  cb(null, true);
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.err) return cb(file.err);

    return cb(
      null,
      join(
        __dirname,
        '..',
        process.env.STATIC_PATH
          ? `${process.env.STATIC_PATH}/avatars`
          : '../uploads/avatars'
      )
    );
  },
  filename(req, file, cb) {
    const uniqueName = `${Date.now().toString(36)}${Math.round(
      Math.random() * 1e5
    ).toString(36)}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export default (req, res, next) => {
  return multer({
    fileFilter,
    storage,
    limits: { fileSize },
  }).single('avatar')(req, res, (err) => {
    if (err)
      return res
        .status(400)
        .json({ message: `Bad request: ${err.message.toLowerCase()}` });
    return next();
  });
};
