const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Root.js route');
});

module.exports = router;