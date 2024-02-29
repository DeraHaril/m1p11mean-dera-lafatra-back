const router = require('express').Router();
const middleware = require('../controllers/middlewares');

const controller = require('../controllers/statistiqueController');

router.get('/rdvs', middleware.verifictionToken, middleware.isAdmin, controller.nbRDVParJour);

module.exports = router