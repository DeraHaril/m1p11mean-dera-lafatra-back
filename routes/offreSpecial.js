const router = require('express').Router();
const middleware = require('../controllers/middlewares');

const { getAllOffre, getSpecificOffre, createOffre, updateOffre, getOffreNotExpired } = require('../controllers/offreSpecialController');

router.get('/', getAllOffre);

router.get('/offerNotExpired', getOffreNotExpired);

router.get('/:id', getSpecificOffre);

router.post('/', createOffre);

router.put('/:id', updateOffre);

router.delete('/:id');

module.exports = router