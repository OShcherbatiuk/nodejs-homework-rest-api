const sgMail = require('@sendgrid/mail');
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async ({ to, subject, text, html }) => {
  const mail = {
    to,
    from: 'andrey.klm@meta.ua',
    subject,
    text,
    html,
  };

  try {
    const answer = await sgMail.send(mail);
    console.log(answer);
    return answer;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { sendMail };
