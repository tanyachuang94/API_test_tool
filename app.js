require('dotenv').config();
var nodemailer = require('nodemailer');

const express = require('express');
const bodyparser = require('body-parser');
const db = require('./mysqlcon.js');
const crypto = require('crypto');
const hash = crypto.createHash('sha256');
const router = express.Router();
const cookieParser = require('cookie-parser');
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

function hashData (data) { //加密
  const hash = crypto.createHash('sha256');
  hash.update(data);
  hashResult = hash.digest('hex');
  return (hashResult);
}

function findEmail(email){
  return new Promise(resolve => {
  db.query('SELECT * FROM user WHERE email = ?', [email], (err,result) => {
    if (err) throw err
    resolve(result)
  })
  })
}
function sendEmail(email, hashToken) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    secureConnection: false, // SSL方式,防止竊取訊息
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASS,
    },
  });
  let mailOptions = {
    from: 'API Test Tool',
    to: email,
    subject: 'Thanks for your registration.',
    text: 'Please activate your account to login by clicking http://localhost:7000/api/verify?token='+hashToken ,
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

app.post('/api/signup', async (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  let expired = 3600;    // Fix compare token
  try {
    let result = await findEmail(email);
    if (result.length !== 0) {    // Resend verify email
      res.status(403).send({ error: 'Email Already Exists. ' });
    } else {
      let token = email + Date();
      let hashToken = hashData (token);
      let hashPW = hashData (password);
      let post = {
        email: email, password: hashPW, name: name, token: hashToken, status: 0,
      };
      db.query('INSERT INTO user SET ?', post, (err, result) => {
        if (err) throw err;
        // id = result.insertId;
        // res.send({
        //   id: result.insertId,
        //   name: name,
        //   token: hashToken,
        // });
      });
      sendEmail(email, hashToken);
    }
  } catch (error) {
    return error;
  }
});

app.get('/api/verify', async (req, res) => {
  const signupToken = req.query.token;
  db.query('UPDATE user SET status = 1 WHERE token = ?', signupToken, (err, result) => {
    if (err) throw err;
    res.redirect('../request.html');
  });
});

app.post('/api/login', async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  try {
    let result = await findEmail(email);
    const status = result[0].status
    let token = email + Date();
    let hashToken = await hashData (token);    // Fix check token valid and update token in db
    let hashPW = await hashData (password);
    if (result.length == 0) {
      res.status(400).send({ error: 'Email does not exist.' });
    } else if (status != 1) {
      res.status(400).send({ error: 'Account is inactive.' });
    } else if (hashPW != result[0].password) {
      res.status(400).send({ error: 'Incorrect password.' });
    } else {
      res.send({
        id: result[0].id,
        name: result[0].name,
        token: hashToken,
      });
    }
  } catch (error) {
    return error;
  }
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
