const router = require('express').Router();
const order = require('../controllers/order');
const { verifyTokenAndAuth, verifyTokenAndAdmin } = require('../utils/verifyToken');

router.get('/test', order.test);
router.post('/new', verifyTokenAndAuth, order.create);
router.put('/:id', verifyTokenAndAdmin, order.update);
router.delete('/all', verifyTokenAndAdmin, order.destroyAll);
router.delete('/:id', verifyTokenAndAdmin, order.destroy);
router.get('/find/:id', verifyTokenAndAuth, order.getOrderById);
router.get('/find/user/:id', verifyTokenAndAuth, order.getOrdersByUserId);
router.get('/find', verifyTokenAndAdmin, order.getAllOrders);
router.get('/newOrdersPerMonth', verifyTokenAndAuth, order.getNewOrdersByMonthStats);
router.get('/monthlyIncome', verifyTokenAndAdmin, order.getMonthlyIncome);

module.exports = router;
