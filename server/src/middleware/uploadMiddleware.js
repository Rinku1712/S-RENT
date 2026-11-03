const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const { uploadDirectory, removeUploadedFiles } = require('../utils/itemImageStorage');

// 1. Configure storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    fs.mkdir(uploadDirectory, { recursive: true }, (error) => {
      callback(error, uploadDirectory);
    });
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const uniqueName = crypto.randomUUID() + extension;

    callback(null, uniqueName);
  },
});

// 2. Validate image type
const fileFilter = (req, file, callback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Only JPG, PNG and WEBP images are allowed');
    error.statusCode = 400;

    return callback(error);
  }

  callback(null, true);
};

// 3. Configure Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});

// 4. Upload middleware
const uploadItemImages = (req, res, next) => {
  upload.array('images', 10)(req, res, async (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            success: false,
            message: 'Each image must be smaller than 5 MB',
          });
        }

        return res.status(400).json({
          success: false,
          message: 'Maximum 10 images are allowed',
        });
      }

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Image upload failed',
      });
    }

    // Check actual image signature
    try {
      for (const file of req.files || []) {
        const buffer = await fs.promises.readFile(file.path);

        const isJPEG = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;

        const isPNG = buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));

        const isWEBP =
          buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';

        if (!isJPEG && !isPNG && !isWEBP) {
          await removeUploadedFiles(req.files);

          return res.status(400).json({
            success: false,
            message: 'Invalid image file',
          });
        }
      }

      // All images are valid
      next();
    } catch (error) {
      await removeUploadedFiles(req.files || []);

      console.error('Image validation error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to validate images',
      });
    }
  });
};

module.exports = uploadItemImages;
