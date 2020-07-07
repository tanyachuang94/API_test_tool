const fetch = require('node-fetch');

const sendReq = (req, res) => {
  const url = req.body.protocol + '://' + req.body.domain + '/' +req.body.endpoint;
  const method = req.body.method
  // const headers = req.body.headers  
  // const body = req.body.body

  fetch( url ,{
    // body: JSON.stringify(body),
    // headers: {'Content-Type':'application/json'},
    method: method,
  })
  .then((res) => {
    return res.json()
  })
  .then((json) => {
    // localStorage.resData = json
    console.log(json);
  })
  .catch((err) => {
    console.log('錯誤:', err);
  })
  res.redirect('http://localhost:7000/response.html'); //to be fixed
}
module.exports = {
  sendReq
};