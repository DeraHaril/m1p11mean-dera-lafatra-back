var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const secretKey = process.env.TOKEN_KEY || 'clé_secrète_par_défaut';
const bcrypt = require('bcrypt');


module.exports = (userCollection) => {
  const userController = require('../controllers/userController')(userCollection);
  
  router.get('/', userController.list);

  router.post('/login', userController.traitementConnexionUser);

  router.post('/', userController.traitementInscription);

  return router;
}





