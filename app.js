require('dotenv').config();
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
    // require('./server/controllers/admin_route'),
  ]
);

// Error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server running at ${hostname}:${port}`);
});

module.exports = app;
