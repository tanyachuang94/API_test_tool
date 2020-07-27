const router = require('express').Router();
const { wrapAsync } = require('../../util');

const { getScript, getScripts, getSpecs, saveScript } = require('../controllers/script_controller');

router.route('/specs')
  .get(wrapAsync(getSpecs));

router.route('/scrpits')
  .get(wrapAsync(getScripts));

router.route('/script')
  .get(wrapAsync(getScript));

router.route('/script')
  .post(wrapAsync(saveScript));

module.exports = router;