const router = require('express').Router();
const { wrapAsync } = require('../../util');

const { sendReq } = require('../controllers/request_controller');

router.route('/request')
  .post(wrapAsync(sendReq));

module.exports = router;
