const db = require('../../mysqlcon.js');

const getSpecDetail = async (specId) => {
  function detail(specId) {
    return new Promise((resolve) => {
      db.query('SELECT * FROM spec WHERE id = ?', [specId], (err, result) => {
        if (err) throw err;
        resolve(result);
      });
    });
  }
  const details = await detail(specId);
  return details;
};
const getDetails = async (specId) => {
  function detail(specId) {
    return new Promise((resolve) => {
      db.query('SELECT * FROM api INNER JOIN spec ON api.id = spec.api_id WHERE spec.id = ?', [specId], (err, result) => {
        if (err) throw err;
        resolve(result);
      });
    });
  }
  const details = await detail(specId);
  return details;
};
const saveRecord = async (testRes) => {
  try {
    await db.query('INSERT INTO test SET ?', testRes, (err, result) => {
      if (err) throw err;
    });
  } catch (error) {
    return error;
  }
};
const saveDetail = async (specId, detail) => {
  for (const key in detail) {
    if (detail[key] == '') {
      detail[key] = null;
    }
  }
  try {
    JSON.parse(detail.res_data);
    await db.query('UPDATE spec SET ? WHERE spec.id = ?', [detail, specId]);
    return { result: 'save' };
  } catch (err) {
    let error = '';
    if (err instanceof SyntaxError) { // test spec should be json
      error = { result: 'Expected Response is not JSON' };
    } else {
      error = err;
    }
    return error;
  }
};

module.exports = {
  getSpecDetail,
  getDetails,
  saveRecord,
  saveDetail,
};
