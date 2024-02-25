const router = require('express').Router();
const {list, create, suppr, update, item } = require('../controllers/userController');

router.get('/', list);
router.get('/:id', item);

router.post('/', create);
router.put('/:id', update);
router.delete('/:id', suppr);

module.exports = router




