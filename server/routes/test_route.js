const router = require('express').Router();
const { wrapAsync } = require('../../util');

const { getTest, testDetail, compare } = require('../controllers/test_controller');

router.route('/spec_test')
  .get(wrapAsync(getTest));

router.route('/test_detail')
  .get(wrapAsync(testDetail));

router.route('/compare')
  .post(wrapAsync(compare));

module.exports = router;
