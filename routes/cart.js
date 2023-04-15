const router = require('express').Router();
const cart = require('../controllers/cart');
const { verifyTokenAndAuth } = require('../utils/verifyToken');

router.get('/test', cart.test);
router.post('/new', verifyTokenAndAuth, cart.create);
router.put('/:id', verifyTokenAndAuth, cart.update);
router.delete('/all', verifyTokenAndAuth, cart.destroyAll);
router.delete('/:id', verifyTokenAndAuth, cart.destroy);
router.get('/find/:id', verifyTokenAndAuth, cart.getCartById);
router.get('/find', verifyTokenAndAuth, cart.getAllCarts);
router.get('/newCartsPerMonth', verifyTokenAndAuth, cart.getNewCartByMonthStats);

module.exports = router;