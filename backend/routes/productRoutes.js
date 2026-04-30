import express from 'express';
import { getProducts, createProduct, deleteProduct, updateProduct } from '../controllers/productController.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(createProduct);

router.route('/:id')
    .put(updateProduct)
    .delete(deleteProduct);

export default router;
