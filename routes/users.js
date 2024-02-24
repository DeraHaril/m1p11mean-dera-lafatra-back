const router = require('express').Router();
const {list, create } = require('../controllers/userController');

router.get('/', list);

router.post('/', create);

module.exports = router




