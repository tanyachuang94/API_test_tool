const db = require('../../mysqlcon.js');

function findEmail(email) {
  return new Promise((resolve) => {
    db.query('SELECT * FROM user WHERE email = ?', [email], (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}
function addUser(post) {
  return new Promise((resolve) => {
    db.query('INSERT INTO user SET ?', post, (err, result) => {
      if (err) throw err;
      resolve(result.insertId);
    });
  });
}

const setStatus = async function (signupToken) {
  try {
    await db.query('UPDATE user SET status = 1 WHERE token = ?', signupToken);
    return true;
  } catch (error) {
    return { error };
  }
};

module.exports = {
  findEmail,
  addUser,
  setStatus,
};
