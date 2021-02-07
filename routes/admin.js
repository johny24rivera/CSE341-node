const path = require('path');
const express = require('express');

const adminController = require('../controllers/admin');
const authorized = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', authorized, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', authorized, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', authorized, adminController.postAddProduct);

router.get('/edit-product/:productId', authorized, adminController.getEditProduct);

router.post('/edit-product', authorized, adminController.postEditProduct);

router.post('/delete-product', authorized, adminController.postDeleteProduct);

module.exports = router;