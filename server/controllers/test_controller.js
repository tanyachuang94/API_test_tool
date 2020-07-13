const Test = require('../models/test_model');

const getTest = async (req, res) => {
  const testId = req.query.id
  const testDetail = await Test.getTestDetail(testId)
  res.send(testDetail)
}

const runTest = async (req, res) => {
  const testId = req.query.id
  const runDetail = await Test.reqDetail(testId)
  res.send(runDetail)
}

module.exports = {
  getTest,
  runTest 
};