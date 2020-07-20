const db = require('../../mysqlcon.js');

const reportList = async (sort) => {
  function list(sort) {
    return new Promise(resolve => {
      if (sort == 'test_time') {
        db.query('SELECT spec_name,test_result,test_time FROM test JOIN spec WHERE test.spec_id = spec.id ORDER BY test_time DESC', (err, result) => {
          if (err) throw err;
          resolve(result);
        });
      } else if (sort == 'spec_name') {
        db.query('SELECT spec_name,test_result,test_time FROM test JOIN spec WHERE test.spec_id = spec.id ORDER BY spec_name', (err, result) => {
          if (err) throw err;
          resolve(result);
        });
      } else if (sort == 'test_result') {
        db.query('SELECT spec_name,test_result,test_time FROM test JOIN spec WHERE test.spec_id = spec.id ORDER BY test_result', (err, result) => {
          if (err) throw err;
          resolve(result);
        });
      }
    });
  }
  const reports = await list(sort);
  return reports;
};

module.exports = {
  reportList,
};
