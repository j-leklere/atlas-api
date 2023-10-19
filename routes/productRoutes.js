// const express = require('express');
// const productController = require('../controllers/productController');
import express from 'express';
import {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

router
  .route('/')
  .get(
    // authController.protect,
    getAllProducts
  )
  .post(createProduct);

router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct);

// module.exports = router;
export default router;
