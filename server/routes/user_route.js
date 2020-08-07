const router = require('express').Router();
const { wrapAsync } = require('../../util');

const { signUp, login, verify } = require('../controllers/user_controller');

router.route('/signup')
  .post(wrapAsync(signUp));

router.route('/login')
  .post(wrapAsync(login));

router.route('/verify')
  .get(wrapAsync(verify));

module.exports = router;
