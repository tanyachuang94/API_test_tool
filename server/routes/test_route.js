const router = require('express').Router();
const {wrapAsync} = require('../../util');

const {getTest} = require('../controllers/test_controller');
const {runTest} = require('../controllers/test_controller');

router.route('/spec_test')
    .get(wrapAsync(getTest));

router.route('/runtest')
    .get(wrapAsync(runTest));

module.exports = router;