var express = require('express');
var router = express.Router();
const middleware = require('../controllers/middlewares');

module.exports = (serviceCollection) => {
    const serviceController = require('../controllers/serviceController')(serviceCollection);

    router.get('/liste', serviceController.listeService);

    router.post('/ajout', middleware.verifictionToken, middleware.isAdmin, serviceController.ajoutService);

    router.post('/update', middleware.verifictionToken, middleware.isAdmin, serviceController.majService);

    return router;
}