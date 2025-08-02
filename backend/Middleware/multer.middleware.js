import multer from 'multer';

const storage = multer.memoryStorage(); // store file buffer in memory

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // max 3MB file size
  fileFilter: (req, file, cb) => {
    // Accept image files only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

export { upload };
