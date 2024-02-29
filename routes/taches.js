const router = require('express').Router();
const middleware = require('../controllers/middlewares');

const controller = require('../controllers/tachesController');

router.get('/', controller.listeTache);

router.post('/', middleware.verifictionToken, middleware.isAdmin, controller.ajoutTache);

router.put('/');

router.delete('/');

module.exports = router