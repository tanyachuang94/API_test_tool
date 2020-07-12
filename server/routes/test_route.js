const router = require('express').Router();
const {wrapAsync} = require('../../util');

const {getTest} = require('../controllers/test_controller');

router.route('/test')
    .get(wrapAsync(getTest));

module.exports = router;