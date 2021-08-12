const userService = require('../../services/auth');
const { authValidateSchema } = require('../../utils/schema');
const gravatar = require('gravatar');
const { v4: uuidv4 } = require('uuid');
const { sendMail } = require('../../utils/sendMail');

const registr = async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = authValidateSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      status: 'Bad request',
      code: 400,
      data: error.message,
    });
    console.log(error);
    return;
  }

  const result = await userService.getOne({ email });

  if (result) {
    res.status(409).json({
      status: 'Conflict',
      code: 409,
      message: 'Email in use',
    });
    return;
  }
  try {
    const verificationToken = uuidv4();
    const avatarURL = gravatar.url(email);

    await userService.add({ email, password, avatarURL, verificationToken });

    const mail = {
      to: 'web.klemenko@gmail.com',
      subject: 'test verification',
      text: 'Need to verify your email',
      html: `<a href="http://localhost:3000/api/auth/users/verify/${verificationToken}">
          Нажмите для подтверждения email
        </a>`,
    };
    await sendMail(mail);

    res.status(201).json({
      status: 'Success',
      code: 201,
      message: 'Registrtion success, need to verify email',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = registr;
