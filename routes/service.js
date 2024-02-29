const router = require('express').Router();
const middleware = require('../controllers/middlewares');

const serviceController = require('../controllers/serviceController');

router.get('/', serviceController.listeService);

router.get('/offre_special', serviceController.listeServicePromotion);

router.post('/', middleware.verifictionToken, middleware.isAdmin, serviceController.ajoutService);

router.put('/:id', middleware.verifictionToken, middleware.isAdmin, serviceController.majService);

router.delete('/:id', middleware.verifictionToken, middleware.isAdmin, serviceController.suppressionService);


module.exports = router
