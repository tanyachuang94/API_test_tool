const isEqual = require('lodash.isequal');
const flatten = require('flat');
const Test = require('../models/test_model');

const getTest = async (req, res) => {
  const testId = req.query.id;
  const testSpec = await Test.getSpecDetail(testId);
  res.send(testSpec[0]);
};

const testDetail = async (req, res) => {
  const testId = req.query.id;
  const details = await Test.getDetails(testId);
  res.send(details);
};

const compare = async (req, res) => {
  const id = req.body.id;
  const specCheck = req.body.specCheck;
  const spec = JSON.parse(req.body.spec_res);
  const specTime = req.body.specTime;
  const specCode = req.body.specCode;
  const resultTime = req.body.response.time;
  const resultStatus = req.body.response.status;
  const resultData = req.body.response.body;
  let time = '';
  let code = '';
  let data = '';
  let result = '';

  function sortObject(obj) {  // sort object
    return Object.keys(obj).sort().reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, {});
  }

  if (resultTime > specTime) { time = '<font color="red">'+ resultTime + '</font>'} else { time = resultTime }
  if (resultStatus != specCode) { code = '<font color="red">'+resultStatus+ '</font>'} else { code = resultStatus }
  if (specCheck == 'DATA') {
    if (isEqual(spec, resultData)) {
      data = 'pass';
    } else { data = 'fail'; }
  } else {
    const specType = flatten(spec);  // json > object
    const resultType = flatten(resultData);
    if (specType.length == resultType.length) {  // values type fail
      data = 'pass';
      const specVal = Object.values(sortObject(specType));
      const resultVal = Object.values(sortObject(resultType));

      for (let i = 0; i < specVal.length; i += 1) {
        if (specVal[i] != typeof resultVal[i]) {
          data = 'fail';
          break;
        }
      }
    } else {
      data = 'fail';  // keys fail
    }
  }
  if (resultTime > specTime || resultStatus != specCode || data == 'fail') {
    result = '<font color="red">Fail</font>';
  } else {
    result = '<font color="green">Pass</font>';
  }
  const results = { result, time, code, data }
  res.send(results);
};

module.exports = {
  getTest,
  testDetail,
  compare,
};
