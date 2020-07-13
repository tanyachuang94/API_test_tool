const db = require('../../mysqlcon.js');

const getTestDetail = async (specId) =>{
  function detail(specId){
    return new Promise(resolve => {
      db.query(`SELECT * FROM spec WHERE id = ?`,[specId], (err, result) => {
        if (err) throw err;
      resolve(result);
      }); 
    }); 
  }
  const details = await detail(specId);
  return details
}

const reqDetail = async (specId) =>{
  function detail(specId){
    return new Promise(resolve => {
      db.query(`SELECT * FROM api INNER JOIN spec ON api.id=spec.api_id WHERE spec.id = ?`,[specId], (err, result) => {
        if (err) throw err;
      resolve(result);
      }); 
    }); 
  }
  const details = await detail(specId);
  return details
}

module.exports = {
  getTestDetail,
  reqDetail,
}