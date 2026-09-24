const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { getReviews, addReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

router.get('/categories', getCategories);
router.get('/', getProducts);
router.post('/', protect, admin, createProduct);
router.get('/:id', getProductById);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

// Reviews nested under a product
router.get('/:productId/reviews', getReviews);
router.post('/:productId/reviews', protect, addReview);

module.exports = router;
