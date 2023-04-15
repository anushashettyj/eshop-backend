const router = require('express').Router();
const user = require('../controllers/user');
const { verifyTokenAndAuth, verifyTokenAndAdmin } = require('../utils/verifyToken');
// router.get('/test', (req, res) => {
//     res.send('Test sucessfull')
// })

router.get('/test', user.test);

router.post('/new', verifyTokenAndAdmin, user.create);

router.put('/:id', verifyTokenAndAuth, user.update);

router.delete('/:id', verifyTokenAndAdmin, user.destroy);

router.post('/deleteUsers', verifyTokenAndAdmin, user.destroyMany);

router.get('/find/:id', verifyTokenAndAdmin, user.getUserById);

router.get('/find', verifyTokenAndAdmin, user.getAllUsers);

router.get('/newUsersPerMonth', verifyTokenAndAdmin, user.getNewUserByMonthStats);

module.exports = router;