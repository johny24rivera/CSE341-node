const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const authorized = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', authorized, shopController.getCart);

router.post('/cart', authorized, shopController.postCart);

router.post('/cart-delete-item', authorized, shopController.postCartDeleteProduct);

router.post('/create-order', authorized, shopController.postOrder);

router.get('/orders', authorized, shopController.getOrders);

module.exports = router;