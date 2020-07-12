const fetch = require('node-fetch');

const sendReq = async (req, res) => {
  let endpoint = ''
  console.log(endpoint)
  if (req.body.endpoint.length > 0){
    endpoint = req.body.endpoint
  }

  const url = req.body.protocol + '://' + req.body.domain + '/' + endpoint;

  const data = {}
  data.method = req.body.method
  if (req.body.headers != undefined){
    data.headers = JSON.parse(req.body.headers);
  } if (req.body.body != undefined){
    data.body = req.body.body;
  } 
  const detail = {}
  const start = new Date();
  const result = await fetch(url, data)
    .then((response) => {
      const end = new Date() - start
      detail.time = end
      detail.status = response.status
      return response.json()
    })
    .catch((err) => {
      const end = new Date() - start
      detail.time = end
      detail.body = err
      console.log(err)
      res.send(detail) // fix server 404 error, restart app.js (wrong method or url)
    })
  detail.body = result
  res.json(detail)
}

module.exports = {
  sendReq
};