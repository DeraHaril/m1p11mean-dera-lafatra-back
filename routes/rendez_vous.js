var express = require('express');
var router = express.Router();
const middleware = require('../controllers/middlewares');

module.exports = (render_vousCollection) => {
    const rendez_vousController = require('../controllers/rendez_vouController')(render_vousCollection);
    
    router.get('/liste', rendez_vousController.listeRendez_vous);

    router.get('/listeEffectue', rendez_vousController.listeRendez_vousEffectue);

    router.post('/ajout', middleware.verifictionToken, middleware.isClient, rendez_vousController.ajoutRendez_vous);

    return router;
}