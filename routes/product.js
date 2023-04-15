const router = require('express').Router();
const product = require('../controllers/product');
const { verifyTokenAndAuth, verifyTokenAndAdmin } = require('../utils/verifyToken');

router.get('/test', product.test);
router.post('/new', verifyTokenAndAdmin, product.create);
router.post('/deleteProducts', verifyTokenAndAdmin, product.destroyMany);
router.put('/:id', verifyTokenAndAdmin, product.update);
router.delete('/:id', verifyTokenAndAdmin, product.destroy);
router.get('/find/:id', product.getProductById);
router.get('/find', product.getAllProducts);
router.get('/newProductsPerMonth', verifyTokenAndAdmin, product.getNewProductByMonthStats);
module.exports = router;