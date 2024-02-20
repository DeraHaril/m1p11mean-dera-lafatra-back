var express = require('express');
var router = express.Router();
const middleware = require('../controllers/middlewares');

module.exports = (serviceCollection) => {
    const serviceController = require('../controllers/serviceController')(serviceCollection);

    router.get('/', serviceController.listeService);

    router.post('/', middleware.verifictionToken, middleware.isAdmin, serviceController.ajoutService);

    router.put('/', middleware.verifictionToken, middleware.isAdmin, serviceController.majService);

    return router;
}