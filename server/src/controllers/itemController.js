// Handle item requests and responses.
const itemService = require('../services/itemService');
const {
  getStoredImagePath,
  removeUploadedFiles,
  removeStoredItemImages,
} = require('../utils/itemImageStorage');

const cleanupUploadedFiles = async (files) => {
  try {
    await removeUploadedFiles(files);
    return true;
  } catch (error) {
    console.error('Failed to clean up uploaded item images:', error);
    return false;
  }
};

const getImageUrls = (body) => {
  const value = body.imageUrls === undefined ? body.images : body.imageUrls;

  if (value === undefined || value === '') {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    const error = new Error('Images must be provided as an array');
    error.statusCode = 400;
    throw error;
  }

  try {
    const parsedValue = JSON.parse(value);
    if (Array.isArray(parsedValue)) {
      return parsedValue;
    }
    if (typeof parsedValue === 'string') {
      return [parsedValue];
    }
  } catch {
    return [value];
  }

  const error = new Error('Images must be provided as an array');
  error.statusCode = 400;
  throw error;
};

const getCreateItemData = (req) => {
  const itemData = { ...req.body };

  if (typeof itemData.location === 'string') {
    try {
      itemData.location = JSON.parse(itemData.location);
    } catch {
      const error = new Error('Location must be valid JSON');
      error.statusCode = 400;
      throw error;
    }
  }

  const imageUrls = getImageUrls(req.body);
  const uploadedImages = (req.files || []).map((file) => getStoredImagePath(file.filename));
  itemData.images = [...imageUrls, ...uploadedImages];

  if (itemData.images.length > 10) {
    const error = new Error('A maximum of 10 images are allowed');
    error.statusCode = 400;
    throw error;
  }

  return itemData;
};

const createItem = async (req, res) => {
  try {
    // Use the authenticated user's ID; this route does not have an :id parameter.
    const itemData = getCreateItemData(req);
    const result = await itemService.createItem(req.user._id, itemData);

    if (!result.success && !(await cleanupUploadedFiles(req.files || []))) {
      return res.status(500).json({
        success: false,
        message: 'Item creation failed and uploaded images could not be removed',
      });
    }

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      ...(result.item && { item: result.item }),
    });
  } catch (error) {
    const cleanupSucceeded = await cleanupUploadedFiles(req.files || []);
    const statusCode = cleanupSucceeded ? error.statusCode || 500 : 500;
    return res.status(statusCode).json({
      success: false,
      message: cleanupSucceeded
        ? error.statusCode
          ? error.message
          : 'Failed to create item'
        : 'Item creation failed and uploaded images could not be removed',
    });
  }
};

const updateItemImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Select at least one image to replace the current images',
    });
  }

  try {
    const images = req.files.map((file) => getStoredImagePath(file.filename));
    const result = await itemService.updateItemImages(req.params.itemId, req.user._id, images);

    if (!result.success) {
      if (!(await cleanupUploadedFiles(req.files))) {
        return res.status(500).json({
          success: false,
          message: 'Image update failed and uploaded images could not be removed',
        });
      }

      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    try {
      await removeStoredItemImages(result.previousImages);
    } catch (error) {
      console.error('Failed to remove replaced item images:', error);
      return res.status(500).json({
        success: false,
        message: 'Images were updated, but old image files could not all be removed',
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      message: result.message,
      item: result.item,
    });
  } catch (error) {
    const cleanupSucceeded = await cleanupUploadedFiles(req.files);
    console.error('Failed to update item images:', error);
    return res.status(cleanupSucceeded ? error.statusCode || 500 : 500).json({
      success: false,
      message: cleanupSucceeded ? error.message || 'Failed to update item images' : 'Image update failed and uploaded images could not be removed',
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const result = await itemService.deleteItem(req.params.itemId, req.user._id);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    try {
      await removeStoredItemImages(result.previousImages);
    } catch (error) {
      console.error('Failed to remove deleted item images:', error);
      return res.status(500).json({
        success: false,
        message: 'Item was deleted, but old image files could not all be removed',
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Failed to delete item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete item',
    });
  }
};

const getAllItems = async (req, res) => {
  try {
    const result = await itemService.getAllItems();
    return res.status(200).json({ message: 'Here Is Your All Items', result });
  } catch (error) {
    return res.status(500).json({ message: 'Error Founded in GetAllItem' });
  }
};

const searchItems = async (req, res) => {
  try {
    const result = await itemService.searchItems(req.query);
    const { statusCode, ...response } = result;
    return res.status(statusCode).json(response);
  } catch (error) {
    return res.status(500).json({ message: 'Error founded in Searching Items' });
  }
};
module.exports = {
  createItem,
  updateItemImages,
  deleteItem,
  getAllItems,
  searchItems,
};
