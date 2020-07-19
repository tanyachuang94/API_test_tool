const isEqual = require('lodash.isequal');
const flatten = require('flat');
const Test = require('../models/test_model');
const { json } = require('body-parser');

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
const compare = async (req, res) => {
  const specId = req.body.specId;
  const apiId = req.body.apiId;
  const specCheck = req.body.specCheck;
  const spec = JSON.parse(req.body.spec_res);
  const specTime = req.body.specTime;
  const specCode = req.body.specCode;
  const resultTime = req.body.response.time;
  const resultStatus = req.body.response.status;
  let resultData = req.body.response.body;
  const network = req.body.network;
  const testTime = Date.now();
  let time = '';
  let code = '';
  let data = '';
  let result = '';
  let testResult = '';
  let failList = [];

  function sortObject(obj) {  // sort object
    return Object.keys(obj).sort().reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, {});
  }

  if (resultTime > specTime) {
    time = '<font color="red">' + resultTime + '</font>'
    failList.push('time');
  } else {
    time = resultTime;
  }
  if (resultStatus != specCode) {
    code = '<font color="red">' + resultStatus + '</font>'
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
    const specType = flatten(spec);  // json > object
    const resultType = flatten(resultData);
    if (specType.length == resultType.length) {  // values type fail
      data = 'pass';
      const specVal = Object.values(sortObject(specType));
      const resultVal = Object.values(sortObject(resultType));

      for (let i = 0; i < specVal.length; i += 1) {
        if (specVal[i] != typeof resultVal[i]) {
          data = 'fail';  // values fail
          failList.push('data');
          break;
        }
      }
    } else {
      data = 'fail';  // keys fail
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
      network: network,
    };
    if (failList.length > 0) { testRes.test_fails = JSON.stringify(failList); }
    Test.saveRecord(testRes);
    res.status(200).send(results);
  } else {
    res.status(400).send({ error: 'Wrong Request' });
  }
};

module.exports = {
  getTest,
  testDetail,
  saveTest,
  compare,
};
