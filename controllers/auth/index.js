const registr = require('./registration');
const login = require('./login');
const logout = require('./logout');
const getCurrent = require('./current');
const updateAvatar = require('./updateAvatar');
const verifyEmail = require('./verifyEmail');
const resendEmail = require('./resendEmail');

module.exports = {
  registr,
  login,
  logout,
  getCurrent,
  updateAvatar,
  verifyEmail,
  resendEmail,
};
