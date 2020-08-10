const isEqual = require('lodash.isequal');
const flatten = require('flat');
const { json } = require('body-parser');
const Test = require('../models/test_model');

const getTest = async (req, res) => {
  const specId = req.query.id;
  const testSpec = await Test.getSpecDetail(specId);
  res.send(testSpec[0]);
};

const testDetail = async (req, res) => {
  const specId = req.query.id;
  const details = await Test.getDetails(specId);
  res.send(details);
};
const saveTest = async (req, res) => {
  const specId = req.query.id;
  const detail = req.body;
  const save = await Test.saveDetail(specId, detail);
  res.send(JSON.stringify(save));
};

const helper = async (req) => {
  // console.log(req.response.body);
  const {
    specId, apiId, specCheck, specTime, specCode, network,
  } = req;
  const spec = JSON.parse(req.specRes);
  const resultTime = req.response.time;
  const resultStatus = req.response.status;
  const resultData = req.response.body;
  const testTime = Date.now();
  let time = '';
  let code = '';
  let data = '';
  let result = '';
  let testResult = '';
  const failList = [];

  function sortObject(obj) { // sort object
    return Object.keys(obj).sort().reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
  }

  if (resultTime > specTime) {
    time = `<font color="red">${resultTime}</font>`;
    failList.push('time');
  } else {
    time = resultTime;
  }
  if (resultStatus != specCode) {
    code = `<font color="red">${resultStatus}</font>`;
    failList.push('code');
  } else {
    code = resultStatus;
  }
  if (specCheck == 'DATA') {
    if (isEqual(spec, resultData)) {
      data = 'pass';
    } else {
      data = 'fail';
      failList.push('data');
    }
  } else {
    const specType = flatten(spec); // json > object
    const resultType = flatten(resultData);
    if (specType.length == resultType.length) { // values type fail
      data = 'pass';
      const specVal = Object.values(sortObject(specType));
      const resultVal = Object.values(sortObject(resultType));

      for (let i = 0; i < specVal.length; i += 1) {
        if (specVal[i] !== typeof resultVal[i]) {
          data = 'fail'; // values fail
          failList.push('data');
          break;
        }
      }
    } else {
      data = 'fail'; // keys fail
      failList.push('data');
    }
  }
  if (resultTime > specTime || resultStatus != specCode || data == 'fail') {
    result = '<font color="red">Fail</font>';
    testResult = 'Fail';
  } else {
    result = '<font color="green">Pass</font>';
    testResult = 'Pass';
  }
  const results = {
    result, time, code, data,
  };
  if (results) {
    const testRes = {
      spec_id: Number(specId),
      api_id: Number(apiId),
      test_result: testResult,
      test_res_body: JSON.stringify(resultData),
      test_res_code: resultStatus,
      test_res_time: resultTime,
      test_time: testTime,
      network,
    };
    if (failList.length > 0) { testRes.test_fails = JSON.stringify(failList); }
    Test.saveRecord(testRes);
    return results;
  }
  return { error: 'Wrong Request' };
};

const compare = async (req, res) => {
  const returnResult = await helper(req.body);
  if (!returnResult.error) {
    res.status(200).send(returnResult);
  } else {
    res.status(400).send({ error: 'Wrong Request' });
  }
};

module.exports = {
  getTest,
  testDetail,
  saveTest,
  compare,
  helper,
};
