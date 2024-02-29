const router = require('express').Router();
const middleware = require('../controllers/middlewares');

const controller = require('../controllers/statistiqueController');

router.get('/rdv_jour', middleware.verifictionToken, middleware.isAdmin, controller.nbRDVParJour);

module.exports = router