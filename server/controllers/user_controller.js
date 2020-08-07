const crypto = require('crypto');
const validator = require('validator');
const nodemailer = require('nodemailer');
const User = require('../models/user_model');

async function sendEmail(email, name, hashToken) {
  try {
    const transporter = nodemailer.createTransport({
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
    const mailOptions = {
      from: 'API Test Tool',
      to: email,
      subject: 'Thanks for your registration.',
      text: `
      Hi ${name}
        Please activate your account by clicking https://api_test.tanyachuang.site/api/verify?token=${hashToken}

      Let's try it!

      Sample data #1
      Method: GET
      Protocol: HTTPS
      Domain: tanyachuang.site
      Endpoint: api/1.0/marketing/campaigns

      Sample data #2
      Method: POST
      Protocol: HTTPS
      Domain: api.appworks-school.tw
      Endpoint: api/1.0/user/signup
      Headers: {"Content-Type":"application/json"}
      Body: {"name":"test","email":"test@test.com","password":"test"}
      `,
    };
    const sendInfo = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw error;
      } else {
        return [info.response];
      }
    });
    return sendInfo;
  } catch (error) {
    return { error };
  }
}

function hashData(data) {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  const hashResult = hash.digest('hex');
  return (hashResult);
}

const signUp = async (req, res) => {
  const { name } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  if (!validator.isEmail(email)) {
    res.status(400).send({ error: 'Request Error: Invalid email format' });
    return;
  }
  const result = await User.findEmail(email);
  if (result.length !== 0) { // Fix resend verify email
    res.status(403).send({ error: 'Email Already Exists. ' });
  } else {
    const token = email + Date();
    const hashToken = hashData(token);
    const hashPW = hashData(password);
    const post = {
      email, password: hashPW, name, token: hashToken, status: 0,
    };
    const newUser = await User.addUser(post);
    if (newUser) {
      const sendResult = sendEmail(email, name, hashToken);
      if (sendResult.error) {
        res.status(403).send({ error: sendResult.error });
      } else {
        res.status(200).send(JSON.stringify('Confirm email sent. Please check your email and activate the account.'));
      }
    } else {
      res.status(403).send({ error: result.error });
    }
  }
};

const verify = async (req, res) => {
  const signupToken = req.query.token;
  const active = await User.setStatus(signupToken);
  if (active.error) {
    res.status(403).send({ error: active.error });
  } else {
    res.redirect('../index.html');
  }
};

const login = async (req, res) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    res.status(400).send({ error: 'Request Error: Invalid email format' });
    return;
  }
  const { password } = req.body;
  const result = await User.findEmail(email);
  const token = email + Date();
  const hashToken = await hashData(token); // Fix check token valid and update token in db
  const hashPW = await hashData(password);
  if (result.length == 0) {
    res.status(400).send({ error: 'Email does not exist.' });
  } else if (result[0].status != 1) {
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
};

module.exports = {
  signUp,
  verify,
  login,
};
