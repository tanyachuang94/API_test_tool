const router = require('express').Router();

const {sendReq} = require('../controllers/request_controller');

router.route('/request')
    .post(sendReq);

module.exports = router;