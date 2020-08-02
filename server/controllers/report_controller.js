const moment = require('moment-timezone');
const Report = require('../models/report_model');

moment().format();

const getReport = async (req, res) => {
  const { sort } = req.query;
  const reports = await Report.reportList(sort);
  for (let i = 0; i < reports.length; i += 1) {
    const time = Number(reports[i].test_time);
    reports[i].test_time = moment(time).tz('Asia/Taipei').format('lll');
  }
  res.send(reports);
};

const getReportDetail = async (req, res) => {
  const testId = req.query.id;
  const reportDetail = await Report.reportDetail(testId);
  res.send(reportDetail[0]);
};

module.exports = {
  getReport,
  getReportDetail,
};
