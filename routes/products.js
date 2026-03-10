const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

router.get('/', productController.getAllProducts);
router.post('/ai-search', productController.aiSearch); // AI-powered semantic search
router.get('/:id', productController.getProductById);
router.post('/', auth, productController.createProduct); // Requires auth to create
router.put('/:id', auth, productController.updateProduct); // Requires auth to update
router.delete('/:id', auth, productController.deleteProduct); // Requires auth to delete

module.exports = router;
