// Item API endpoints.
const express = require('express');
const authmiddleware = require('../middleware/authMiddleware');
const uploadItemImages = require('../middleware/uploadMiddleware');
const itemController = require('../controllers/itemController');
const router = express.Router();

router.post('/', authmiddleware, uploadItemImages, itemController.createItem);
router.get('/', itemController.getAllItems);
router.get('/search', itemController.searchItems);
router.patch('/:itemId/images', authmiddleware, uploadItemImages, itemController.updateItemImages);
router.delete('/:itemId', authmiddleware, itemController.deleteItem);
module.exports = router;
