const { User } = require('../../models/auth');

const getOne = filter => {
  return User.findOne(filter);
};

const getById = id => User.findById(id);

const add = ({ email, password, avatarURL, verificationToken }) => {
  const newUser = new User({ email, avatarURL, verificationToken });
  newUser.setPassword(password);
  return newUser.save();
};

const updateById = (id, updateInfo) => {
  return User.findByIdAndUpdate(id, updateInfo);
};

module.exports = {
  getOne,
  getById,
  add,
  updateById,
};
