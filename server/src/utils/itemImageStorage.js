const fs = require('fs').promises;
const path = require('path');

const uploadDirectory = path.resolve(__dirname, '../uploads/items');
const storedImagePattern = /^\/?uploads\/items\/([A-Za-z0-9][A-Za-z0-9._-]*)$/;

const getStoredImagePath = (filename) => `uploads/items/${filename}`;

const removeFile = async (filePath) => {
  const resolvedPath = path.resolve(filePath);

  if (!resolvedPath.startsWith(`${uploadDirectory}${path.sep}`)) {
    throw new Error('Refusing to remove a file outside the item image directory');
  }

  try {
    await fs.unlink(resolvedPath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

const removeUploadedFiles = async (files = []) => {
  await Promise.all(files.map((file) => removeFile(file.path)));
};

const removeStoredItemImages = async (images = []) => {
  const storedFiles = images
    .map((image) => {
      if (typeof image !== 'string') {
        return null;
      }

      const match = image.match(storedImagePattern);
      return match ? path.join(uploadDirectory, match[1]) : null;
    })
    .filter(Boolean);

  await Promise.all(storedFiles.map(removeFile));
};

module.exports = {
  uploadDirectory,
  getStoredImagePath,
  removeUploadedFiles,
  removeStoredItemImages,
};
