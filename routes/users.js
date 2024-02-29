const router = require('express').Router();
const {list, create, suppr, update, item, addPreference } = require('../controllers/userController');

const middleware = require('../controllers/middlewares');

router.get('/', list);

router.get('/:id', item);

router.post('/', create);

router.put('/:id', update);

router.put('/preference/:id', middleware.verifictionToken, middleware.isClient, addPreference);

router.delete('/:id', suppr);

module.exports = router




