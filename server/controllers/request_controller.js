const fetch = require('node-fetch');

const sendReq = async (req, res) => {
  let endpoint = ''
  if (req.body.endpoint.length > 0){
    endpoint = req.body.endpoint
  }
  const url = req.body.protocol + '://' + req.body.domain + '/' + endpoint;
  const data = {};
  data.method = req.body.method;
  if (req.body.headers != null || req.body.headers != undefined) {
    data.headers = JSON.parse(req.body.headers);  // Fix to check when json parse fail
  }
  if (req.body.body != null || req.body.body != undefined) {
    data.body = req.body.body;
  }
  const detail = {}
  const start = Date.now();
  const result = await fetch(url, data)
    .then((response) => {
      const end = Date.now() - start
      detail.time = end
      detail.status = response.status
      return response.json()
    })
    .catch((err) => {
      const end = Date.now() - start
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