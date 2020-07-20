const moment = require('moment');
const Report = require('../models/report_model');

moment().format();

const getReport = async (req, res) => {
  const sort = req.query.sort;
  const reports = await Report.reportList(sort);
  for (let i = 0; i < reports.length; i += 1) {
    let time = Number(reports[i].test_time);
    reports[i].test_time = moment(time).format('lll');
  }
  res.send(reports);
};

module.exports = {
  getReport,
};
