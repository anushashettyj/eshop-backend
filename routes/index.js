const router = require('express').Router();
const root = require('./root');
const auth = require('./auth');
const user = require('./user');
const cart = require('./cart');
const product = require('./product');
const order = require('./order');

router.use('/', root);
router.use('/auth', auth);
router.use('/user', user);
router.use('/cart', cart);
router.use('/product', product);
router.use('/order', order);

module.exports =  router;
