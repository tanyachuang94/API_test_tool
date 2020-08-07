const fetch = require('node-fetch');

const sendReq = async (req, res) => {
  let endpoint = '';
  if (req.body.endpoint != undefined) {
    endpoint = req.body.endpoint;
  }
  const url = `${req.body.protocol}://${req.body.domain}/${endpoint}`;
  const data = {};
  data.method = req.body.method;
  if (req.body.headers != null || req.body.headers != undefined) {
    const Str = req.body.headers.replace(/'/g, '"'); // replace '
    data.headers = JSON.parse(Str);
  }
  if (req.body.body != null || req.body.body != undefined) {
    data.body = req.body.body;
  }
  const detail = {};
  const start = Date.now();
  const result = await fetch(url, data)
    .then((response) => {
      if (response.status == 404) {
        detail.time = response.timeout;
        detail.status = response.status;
        return `${response.url}  ${response.statusText}`;
      }
      const end = Date.now() - start;
      detail.time = end;
      detail.status = response.status;
      return response.json();
    })
    .catch((err) => {
      const end = Date.now() - start;
      detail.time = end;
      detail.body = err;
      res.send(detail);
    });
  detail.body = result;
  res.send(detail);
};

module.exports = {
  sendReq,
};
