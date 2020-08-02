const db = require('../../mysqlcon.js');

const reportList = async (sort) => {
  function list(sort) {
    return new Promise((resolve) => {
      if (sort == 'test_time') {
        db.query('SELECT test.id,spec_name,test_result,test_time FROM test JOIN spec WHERE test.spec_id = spec.id ORDER BY test_time DESC', (err, result) => {
          if (err) throw err;
          resolve(result);
        });
      } else if (sort == 'spec_name') {
        db.query('SELECT test.id,spec_name,test_result,test_time FROM test JOIN spec WHERE test.spec_id = spec.id ORDER BY spec_name', (err, result) => {
          if (err) throw err;
          resolve(result);
        });
      } else if (sort == 'test_result') {
        db.query('SELECT test.id,spec_name,test_result,test_time FROM test JOIN spec WHERE test.spec_id = spec.id ORDER BY test_result', (err, result) => {
          if (err) throw err;
          resolve(result);
        });
      }
    });
  }
  const reports = await list(sort);
  return reports;
};

const reportDetail = async (testId) => new Promise((resolve) => {
  db.query('SELECT * FROM test JOIN spec WHERE test.spec_id = spec.id and test.id =?', [testId], (err, result) => {
    if (err) throw err;
    resolve(result);
  });
});

module.exports = {
  reportList,
  reportDetail,
};
