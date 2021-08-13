const userService = require('../../services/auth');
const { validateEmail } = require('../../utils/schema');
const { sendMail } = require('../../utils/sendMail');

const resendEmail = async (req, res, next) => {
  const { email } = req.body;
  const { error } = validateEmail.validate(req.body);

  if (!email) {
    return res.status(400).json({
      status: 'Bad request',
      code: 400,
      message: 'missing required field email',
    });
  }

  if (error) {
    return res.status(400).json({
      status: 'Bad request',
      code: 400,
      message: error.message,
    });
  }
  const user = await userService.getOne({ email });

  try {
    if (user.verify) {
      return res.status(400).json({
        status: 'Bad request',
        code: 400,
        message: 'Verification has already been passed',
      });
    }

    const mail = {
      to: 'web.klemenko@gmail.com',
      subject: 'test verification[2]',
      text: 'Need to verify[second message]',
      html: `<a href="http://localhost:3000/api/auth/users/verify/${user.verificationToken}">
          Нажмите для подтверждения email
        </a>`,
    };

    await sendMail(mail);

    res.status(200).json({
      status: 'Success',
      code: 200,
      message: 'Verification email sent',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = resendEmail;
