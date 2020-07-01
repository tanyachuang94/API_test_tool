require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.static('public'));
app.use(express.json());

const port = process.env.PORT;
const hostname = process.env.HOST;

// Error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server running at ${hostname}:${port}`);
});
