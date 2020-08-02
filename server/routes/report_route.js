const router = require('express').Router();
const { wrapAsync } = require('../../util');

const { getReport, getReportDetail } = require('../controllers/report_controller');

router.route('/report')
  .get(wrapAsync(getReport));

router.route('/report_detail')
  .get(wrapAsync(getReportDetail));

module.exports = router;
