const router = require('express').Router();
const {wrapAsync} = require('../../util');

const {getReport} = require('../controllers/report_controller');

router.route('/report')
    .get(wrapAsync(getReport));

module.exports = router;