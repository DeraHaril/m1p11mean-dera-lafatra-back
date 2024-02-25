var express = require('express');
var router = express.Router();
const middleware = require('../controllers/middlewares');

module.exports = () => {
    const serviceController = require('../controllers/serviceController')();

    router.get('/', serviceController.listeService);

    router.post('/', middleware.verifictionToken, middleware.isAdmin, serviceController.ajoutService);

    router.put('/:id', middleware.verifictionToken, middleware.isAdmin, serviceController.majService);

    return router;
}