const router = require('express').Router();
const middleware = require('../controllers/middlewares');

const { getAllOffre, getSpecificOffre, createOffre, updateOffre, getOffreNotExpired } = require('../controllers/offreSpecialController');

router.get('/', getAllOffre);

router.get('/offerNotExpired', getOffreNotExpired);

router.get('/:id', getSpecificOffre);

router.post('/', middleware.verifictionToken, middleware.isAdmin, createOffre);

router.put('/:id', middleware.verifictionToken, middleware.isAdmin, updateOffre);

router.delete('/:id');

module.exports = router