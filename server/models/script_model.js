const db = require('../../mysqlcon.js');

const getScriptDetail = async (scriptId) => {
  function detail(scriptId) {
    return new Promise((resolve) => {
      db.query('SELECT * FROM script WHERE id = ?', [scriptId], (err, result) => {
        if (err) throw err;
        resolve(result);
      });
    });
  }
  const details = await detail(scriptId);
  return details;
};

const getSpecs = async () => {
  function spec() {
    return new Promise((resolve) => {
      db.query('SELECT * FROM spec ORDER BY spec_name', (err, result) => {
        if (err) throw err;
        resolve(result);
      });
    });
  }
  const specs = await spec();
  return specs;
};

const getScripts = async () => {
  function script() {
    return new Promise((resolve) => {
      db.query('SELECT * FROM script', (err, result) => {
        if (err) throw err;
        resolve(result);
      });
    });
  }
  const scripts = await script();
  return scripts;
};

const addScript = async (data) => {
  try {
    return new Promise((resolve) => {
      db.query('INSERT INTO script SET ?', data, (err, result) => {
        if (err) throw err;
        resolve(result.insertId);
      });
    });
  } catch (error) {
    return error;
  }
};

const updateScript = async (scriptId, data) => {
  try {
    return new Promise((resolve) => {
      db.query('UPDATE script SET ? WHERE id = ?', [data, scriptId], (err, result) => {
        if (err) throw err;
        resolve(result);
      });
    });
  } catch (error) {
    return error;
  }
};

module.exports = {
  getScriptDetail,
  getSpecs,
  addScript,
  getScripts,
  updateScript,
};
