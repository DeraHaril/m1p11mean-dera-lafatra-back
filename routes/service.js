const router = require('express').Router();
const middleware = require('../controllers/middlewares');

const serviceController = require('../controllers/serviceController');

router.get('/', serviceController.listeService);

router.post('/', middleware.verifictionToken, middleware.isAdmin, serviceController.ajoutService);

router.put('/:id', middleware.verifictionToken, middleware.isAdmin, serviceController.majService);


module.exports = router
