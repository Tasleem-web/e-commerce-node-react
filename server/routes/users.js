var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');

/* GET users listing. */
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/logout', userCtrl.logout);

router.get('/', auth, userCtrl.getUsers);

router.get('/refresh_token', userCtrl.refreshToken);

module.exports = router;
