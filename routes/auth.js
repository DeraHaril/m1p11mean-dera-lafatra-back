const router = require('express').Router();
const middleware = require("../controllers/middlewares");
const { getUserByToken, login, test} = require('../controllers/authController');


router.get('/me', middleware.verifictionToken, getUserByToken);
router.post('/login', login);

module.exports = router



