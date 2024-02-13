const { json } = require('body-parser');
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const secretKey = process.env.TOKEN_KEY || 'clé_secrète_par_défaut';
const bcrypt = require('bcrypt');


module.exports = (userCollection) => {
  const userController = require('../controllers/userController')(userCollection);
  /* GET users listing. */
  
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.post('/login', traitementConnexionUser = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
      const user = await userController.getUserByEmail(email);
      if(user){
        console.log(user.password);
        console.log(password);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(passwordMatch){
          const token = jwt.sign({ userId: user._id, role: user.role}, secretKey, { expiresIn: '1h' });
          res.json({ success: true, message: 'Connexion réussie', token });
        }
        else{
          res.json({ success: false, message: "mot de passe incorrecte"});
        }
      } 
      else{
        res.json({ success: false, message: "cet email est invalide"});
    }
    } catch(error){
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors du hachage du mot de passe');
    }
  };

  router.post('/inscription', traitementInscription = async(req,res) =>{
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const password = req.body.password;
    const password_verification = req.body.password_verification;
    const role = req.body.role;

    if(password === password_verification){
      try{
        const hashedPassword = await hashPassword(password);
        const user = await userController.createUser(nom,prenom,email, hashedPassword, role); 

        //Connexion de l'user apres inscription
        const userInscrit = await userController.getUserByEmail(email);
        const token = jwt.sign({ userId: userInscrit._id, userInscrit: userInscrit.role}, secretKey, { expiresIn: '1h' });
        res.json({ success: true, message: 'Inscription terminée avec succès', token });
      } catch(error){
        console.error(error);
        throw new Error("Erreur de traitement d'inscription");
      }
    }
    else{
      res.json({ success: false, message: 'mot de passe et vérification du mot de passe non identique' })
    }
  });

  return router;
}


module.exports = (userCollection) => {
  const userController = require('../controllers/userController')(userCollection);
  /* GET users listing. */
  
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.post('/login', traitementConnexionUser = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
      const user = await userController.getUserByEmail(email);
      if(user){
        console.log(user.password);
        console.log(password);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(passwordMatch){
          const token = jwt.sign({ userId: user._id, role: user.role}, secretKey, { expiresIn: '1h' });
          res.json({ success: true, message: 'Connexion réussie', token });
        }
        else{
          res.json({ success: false, message: "mot de passe incorrecte"});
        }
      } 
      else{
        res.json({ success: false, message: "cet email est invalide"});
    }
    } catch(error){
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors du hachage du mot de passe');
    }
  };

  router.post('/inscription', traitementInscription = async(req,res) =>{
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const password = req.body.password;
    const password_verification = req.body.password_verification;
    const role = req.body.role;

    if(password === password_verification){
      try{
        const hashedPassword = await hashPassword(password);
        const user = await userController.createUser(nom,prenom,email, hashedPassword, role); 

        //Connexion de l'user apres inscription
        const userInscrit = await userController.getUserByEmail(email);
        const token = jwt.sign({ userId: userInscrit._id, userInscrit: userInscrit.role}, secretKey, { expiresIn: '1h' });
        res.json({ success: true, message: 'Inscription terminée avec succès', token });
      } catch(error){
        console.error(error);
        throw new Error("Erreur de traitement d'inscription");
      }
    }
    else{
      res.json({ success: false, message: 'mot de passe et vérification du mot de passe non identique' })
    }
  });

  return router;
}


