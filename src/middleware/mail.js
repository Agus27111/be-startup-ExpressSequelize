const nodemailer = require ("nodemailer");
require ("dotenv").config();
const base_url = process.env.BASE_URL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  port: 587, // For TLS
  secure: false, // Set to true if using SSL
});

const createEmail = (email, token) => {
  return {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Activation Confirmation",
    html:
      "<h3>For Activate Account, click link bellow</h3>" +
      "<a href='" +
      base_url +
      "/api/users/activate/" +
      token +
      "'>Link Activasi</a>",
  };
};

const contentPwd = (email, password) => {
  return {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Forgot Password",
    html:
      "<h3>Your new account password is :</h3>" +
      "<table>" +
      "<tr><td>Email :</td><td>" +
      email +
      "</td></tr>" +
      "<tr><td>Password :</td><td>" +
      password +
      "</td></tr>" +
      "</table>",
  };
};

const sendMail = (email, token) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(createEmail(email, token), (err, info) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("Email sent: " + info.response);
        resolve(true);
      }
    });
  });
};

const sendPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(contentPwd(email, password), (err, info) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("Email sent: " + info.response);
        resolve(true);
      }
    });
  });
};

module.exports = { sendMail, sendPassword };
