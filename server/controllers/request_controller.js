const fetch = require('node-fetch');

const sendReq = async (req, res) => {
  const url = req.body.protocol + '://' + req.body.domain + '/' +req.body.endpoint;
  const data = {}
  data.method = req.body.method
  if (req.body.headers != undefined){
    data.headers = JSON.parse(req.body.headers);
  } if (req.body.body != undefined){
    data.body = req.body.body;
  } 

  const result = await fetch(url, data)
    .then((response) => {
      return response.json()
    })
    .catch((err) => {
      res.send(err)
    })
  res.json(result)
}

module.exports = {
  sendReq
};