require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const db = require('./mysqlcon.js');

const app = express();
const port = process.env.PORT;
const hostname = process.env.HOST;

app.use(express.static('public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/api/',
  [
    require('./server/routes/request_route'),
    require('./server/routes/test_route'),
    // require('./server/controllers/admin_route'),
  ]);

app.get('/api/load', async (req, res) => {
  const data = {};
  const domain = new Promise(resolve => {
    db.query('SELECT DISTINCT domain FROM api', (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
  const endpoint = new Promise(resolve => {
    db.query('SELECT DISTINCT endpoint FROM api', (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
  Promise.all([domain, endpoint]).then(values => {
    const domainList = [];
    for (let i = 0; i < values[0].length; i += 1) {
      domainList.push(values[0][i].domain);
    }
    data.domain = domainList;
    const endpointList = [];
    for (let j = 0; j < values[1].length; j += 1) {
      endpointList.push(values[1][j].endpoint);
    }
    data.endpoint = endpointList;
    res.send(data);
  });
});
function apiId(protocol, domain, endpoint) {
  return new Promise(resolve => {
    db.query('SELECT id FROM api WHERE protocol = ? AND domain = ? AND endpoint = ?', [protocol, domain, endpoint], (err, result) => {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}
app.post('/api/readapi', async (req, res) => { // Fix : sort api , cannot find the spec
  const protocol = req.body.protocol;
  const domain = req.body.domain;
  const endpoint = req.body.endpoint;
  async function getSpec() {
    const id = await apiId(protocol, domain, endpoint);
    return new Promise(resolve => {
      db.query('SELECT id,spec_name FROM spec WHERE api_id = ?', [id.id], (err, result) => {
        if (err) throw err;
        resolve(result);
      });
    });
  }
  getSpec().then(result => {
    res.send(JSON.stringify(result));
  });
});
app.post('/api/addspec', async (req, res) => {
  const protocol = req.body.protocol;
  const domain = req.body.domain;
  const endpoint = req.body.endpoint;
  const specName = req.body.test;
  let api = '';
  async function addApi() {
    const id = await apiId(protocol, domain, endpoint);
    if (id != undefined) {  // if no api found then create new
      api = id.id;
      return api;
    } else {
      try {
        return new Promise(resolve => {
          db.query('INSERT INTO api (protocol,domain,endpoint) VALUES (?,?,?) ', [protocol, domain, endpoint], (err, result) => {
            if (err) throw err;
            resolve(api = result.insertId);
          });
        });
      } catch (error) {
        return error;
      }
    }
  }
  addApi().then(async (api) => {
    await db.query('INSERT INTO spec (spec_name,api_id,method,res_check) VALUES (?,?,?,?)', [specName, api, 'GET', 'DATA'], (err, spec) => {
      if (err) throw err;
      const specId = spec.insertId;
      res.send(JSON.stringify(specId));
    });
  });
});
// Error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});
app.listen(port, () => {
  console.log(`Server running at ${hostname}:${port}`);
});

module.exports = app;
