const userService = require('../../services/auth');

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const user = await userService.getOne({ verificationToken });
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        code: 404,
        message: 'User not found',
      });
    }

    await userService.updateById(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Verification successful',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = verifyEmail;
