const nodemailer = require('nodemailer');

const sendEmail = (email, html, subject) => {
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `noreply ${process.env.SMTP_EMAIL}`,
    to: email,
    html,
    subject,
  };

  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (response) {
      return true;
    }
    return false;
  });
};

/**
 * Send Email when user is created
 * @param {string} email
 * @param {any} code
 */
exports.sendVerificationCodeToEmail = (email, code) => {
  let html = '<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">';
  html += '<div style="margin:50px auto;width:70%;padding:20px 0">';
  html += `<div style="border-bottom:1px solid ${process.env.SECONDARY_COLOR}">`;
  html += `<a href="" style="font-size:1.4em;color: ${process.env.PRIMARY_COLOR};text-decoration:none;font-weight:600">${process.env.APP_NAME}</a>`;
  html += '</div>';
  html += '<p style="font-size:1.1em">Hi,</p>';
  html += `<p>Thank you for choosing ${process.env.APP_NAME}. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>`;
  html += `<h2 style="background: ${process.env.PRIMARY_COLOR};margin: 0 auto;width: max-content;padding: 0 10px;color: ${process.env.SECONDARY_COLOR};border-radius: 4px;">`;
  html += code;
  html += '</h2>';
  html += `<p style="font-size:0.9em;">Regards,<br />Admin ${process.env.APP_NAME}</p>`;
  html += `<hr style="border:none;border-top:1px solid ${process.env.SECONDARY_COLOR}" />`;
  html += '</div>';
  html += '</div>';

  sendEmail(email, html, 'Verify Your Account');
};
/**
 * Send Password Reset Email
 * @param {String} email
 * @param {String} verificationCode
 */
exports.sendResetPasswordEmail = (email, verificationCode) => {
  let html = '<div>\n';
  html += '<p>Click the link below to reset your password.</p>\n';
  html += `<p>${process.env.BASE_URL}/reset-password?email=${email}&code=${verificationCode}</p>\n`;
  html += '</div>';

  sendEmail(email, html, 'Password Reset Request');
};

/**
 * Send Email when password is changed
 * @param {String} email
 */
exports.sendPasswordChangeEmail = (email) => {
  let html = '<div>\n';
  html += '<p>Your password is changed successfuly</p>\n';
  html += '</div>';

  sendEmail(email, html, 'Password Chnaged Successfuly');
};
