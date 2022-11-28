const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const dotenv = require("dotenv").config();
<<<<<<< HEAD
=======


>>>>>>> 41ae6ef (add reset-password-api helper/sendmail validator/resetpasswordschemavalidator)
const CLIENT_ID = process.env.CLIENT_ID;
const CLEINT_SECRET = process.env.CLEINT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN
<<<<<<< HEAD
=======

>>>>>>> 41ae6ef (add reset-password-api helper/sendmail validator/resetpasswordschemavalidator)
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
<<<<<<< HEAD
async function sendMail(body,subject,recipient) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAUTH2',
=======

async function sendMail(body,subject,recipient) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
>>>>>>> 41ae6ef (add reset-password-api helper/sendmail validator/resetpasswordschemavalidator)
        user: 'raghvendrakhatri121@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
<<<<<<< HEAD
=======

>>>>>>> 41ae6ef (add reset-password-api helper/sendmail validator/resetpasswordschemavalidator)
    const mailOptions = {
      from: 'raghvendrakhatri121@gmail.com',
      to: recipient,
      subject: subject,
      text:body
    };
<<<<<<< HEAD
=======

>>>>>>> 41ae6ef (add reset-password-api helper/sendmail validator/resetpasswordschemavalidator)
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}
<<<<<<< HEAD
=======


>>>>>>> 41ae6ef (add reset-password-api helper/sendmail validator/resetpasswordschemavalidator)
module.exports = {sendMail}