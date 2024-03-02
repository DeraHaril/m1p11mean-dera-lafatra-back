const router = require('express').Router();
const middleware = require('../controllers/middlewares');

const {item, list, ajout, maj, suppression} = require('../controllers/depenseController');

router.get('/', middleware.verifictionToken, middleware.isAdmin, list);

router.get('/:id', middleware.verifictionToken, middleware.isAdmin, item);

router.post('/', middleware.verifictionToken, middleware.isAdmin, ajout);

router.put('/:id', middleware.verifictionToken, middleware.isAdmin, maj);

router.delete('/:id', middleware.verifictionToken, middleware.isAdmin, suppression);


module.exports = router
