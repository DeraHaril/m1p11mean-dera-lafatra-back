const router = require('express').Router();
const middleware = require('../controllers/middlewares');

const controller = require('../controllers/statistiqueController');

router.get('/rdvs', middleware.verifictionToken, middleware.isAdmin, controller.nbRDVParJourParMois);

router.get('/chiffreAffaire', middleware.verifictionToken, middleware.isAdmin, controller.chiffreAffaireParJourParMois);

router.get('/chiffreAffaire/date', middleware.verifictionToken, middleware.isAdmin, controller.getChiffreAffaireMoisPrécis);

module.exports = router