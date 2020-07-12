require('dotenv').config();
const db = require('./mysqlcon.js');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const port = process.env.PORT;
const hostname = process.env.HOST;

app.use(express.static('public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.use('/api/',
  [
    require('./server/routes/request_route'),
    require('./server/routes/test_route'),
    // require('./server/controllers/admin_route'),
  ]
);

app.get('/api/load', async (req, res) => {
  const data ={}
  const domain = new Promise(resolve =>  {
    db.query(`SELECT DISTINCT domain FROM api`, (err, result) => {
      if (err) throw err;
      resolve(result);
    }); 
  }); 
  const endpoint = new Promise(resolve =>  {
    db.query(`SELECT DISTINCT endpoint FROM api`, (err, result) => {
      if (err) throw err;
      resolve(result);
    }); 
  }); 
  
  Promise.all([domain,endpoint]).then(values => {
    domainList = []
    for (let i=0;i<values[0].length;i++){
      domainList.push(values[0][i].domain)
    }
    data.domain = domainList
    endpointList = []
    for (let j=0;j<values[1].length;j++){
      endpointList.push(values[1][j].endpoint)
    }
    data.endpoint = endpointList
    res.send(data)
    })  
})

// Error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server running at ${hostname}:${port}`);
});

module.exports = app;
