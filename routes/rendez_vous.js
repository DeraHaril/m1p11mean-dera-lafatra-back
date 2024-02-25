const router = require('express').Router();
const middleware = require('../controllers/middlewares');

const {listeRendez_vous, listeRendez_vousEffectue, ajoutRendez_vous} = require('../controllers/rendez_vouController');

router.get('/', listeRendez_vous);

router.get('/listeEffectue', listeRendez_vousEffectue);

router.post('/', middleware.verifictionToken, middleware.isClient, ajoutRendez_vous);

module.exports = router
