require('dotenv').config();

const express = require('express');
const bodyparser = require('body-parser');

const { CronJob } = require('cron');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const compare = require('./server/controllers/test_controller');

const router = express.Router();
const db = require('./mysqlcon.js');

router.use(cookieParser());

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
    require('./server/routes/report_route'),
    require('./server/routes/script_route'),
    require('./server/routes/user_route'),
  ]);

function auto(num) {
  const today = new Date();
  return new Promise((resolve) => {
    db.query('SELECT * FROM script WHERE start_date <= ? AND end_date >= ? AND start_time = ?  ', [today, today, num], (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}
async function trigger(timer) {
  try {
    const spec = await auto(timer);
    for (let i = 0; i < spec.length; i += 1) {
      const req = {};
      req.body = {};
      const data = {};
      const testDetail = await fetch(`http://localhost:7000/api/test_detail?id=${spec[i].spec_id}`) // 同時拿api url和spec test
        .then((res) => res.json())
        .then((json) => {
          data.protocol = json[0].protocol;
          data.domain = json[0].domain;
          data.endpoint = json[0].endpoint;
          data.method = json[0].method;
          data.headers = json[0].req_header;
          data.body = json[0].req_body;
          req.body.apiId = json[0].api_id;
          req.body.specCheck = json[0].res_check;
          req.body.specRes = json[0].res_data;
          req.body.specCode = json[0].res_code;
          req.body.specTime = json[0].res_time;
          return data;
        })
        .catch((err) => {
          console.log(err);
        });
      const resultDetail = await fetch('http://localhost:7000/api/request', {
        body: JSON.stringify(testDetail),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
        .then((res) => res.json())
        .then((json) => json)
        .catch((err) => {
          console.log(err);
        });
      req.body.specId = spec[i].spec_id;
      req.body.response = resultDetail;
      req.body.network = '4g'; // Network status on EC2
      compare.helper(req.body);
    }
  } catch (error) {
    return error;
  }
}

const job = new CronJob({
  cronTime: '00 00 01 * * *',
  onTick() { trigger('01'); },
  timeZone: 'Asia/Taipei',
});
job.start();
const job2 = new CronJob({
  cronTime: '00 00 13 * * *',
  onTick() { trigger('13'); },
  timeZone: 'Asia/Taipei',
});
job2.start();

app.get('/api/load', async (req, res) => {
  const data = {};
  const domain = new Promise((resolve) => {
    db.query('SELECT DISTINCT domain FROM api', (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
  const endpoint = new Promise((resolve) => {
    db.query('SELECT DISTINCT endpoint FROM api', (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
  Promise.all([domain, endpoint]).then((values) => {
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
  return new Promise((resolve) => {
    db.query('SELECT id FROM api WHERE protocol = ? AND domain = ? AND endpoint = ?', [protocol, domain, endpoint], (err, result) => {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}
app.post('/api/readapi', async (req, res) => { // Fix : sort api , cannot find the spec
  const { protocol } = req.body;
  const { domain } = req.body;
  const { endpoint } = req.body;
  async function getSpec() {
    const id = await apiId(protocol, domain, endpoint);
    return new Promise((resolve) => {
      db.query('SELECT id,spec_name FROM spec WHERE api_id = ?', [id.id], (err, result) => {
        if (err) throw err;
        resolve(result);
      });
    });
  }
  getSpec().then((result) => {
    res.send(JSON.stringify(result));
  });
});
app.post('/api/addspec', async (req, res) => {
  const { protocol, domain, endpoint } = req.body;
  const specName = req.body.test;
  let api = '';
  async function addApi() {
    const id = await apiId(protocol, domain, endpoint);
    if (id != undefined) { // if no api found then create new
      api = id.id;
      return api;
    }
    try {
      return new Promise((resolve) => {
        db.query('INSERT INTO api (protocol,domain,endpoint) VALUES (?,?,?) ', [protocol, domain, endpoint], (err, result) => {
          if (err) throw err;
          resolve(api = result.insertId);
        });
      });
    } catch (error) {
      return error;
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
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Internal Server Error');
});
app.listen(port, () => {
  console.log(`Server running at ${hostname}:${port}`);
});

module.exports = app;
