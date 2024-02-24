var express = require('express');
var router = express.Router();
const middleware = require('../controllers/middlewares');

module.exports = () => {
    const {listeRendez_vous, listeRendez_vousEffectue, ajoutRendez_vous} = require('../controllers/rendez_vouController');
    
    router.get('/liste', listeRendez_vous);

    router.get('/listeEffectue', listeRendez_vousEffectue);

    router.post('/ajout', middleware.verifictionToken, middleware.isClient, ajoutRendez_vous);

    return router;
}