const path = require('path');
const fs = require('fs').promises;
const storeImage = path.join(process.cwd(), 'public/avatars');
const Jimp = require('jimp');
const authService = require('../../services/auth');

const updateAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.status(404).json({
      status: 'error',
      code: 404,
      message: 'file not found',
    });
  }
  const { path: tempName } = req.file;
  const { _id } = req.user;
  try {
    const fileName = path.join(storeImage, `${_id.toString()}.jpg`);

    Jimp.read(`${tempName}`, (err, image) => {
      if (err) throw err;
      image.resize(250, 250).write(`${fileName}`);
    });

    const updUser = {
      avatarURL: fileName,
    };

    await authService.updateById(_id, { avatarURL: updUser.avatarURL });
    await fs.rename(tempName, fileName);

    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        result: updUser,
      },
    });
  } catch (error) {
    fs.unlink(tempName);
  }
};

module.exports = updateAvatar;

// Create dir `${ID}` in "public/avatars/ and write file to this path "public/avatars/ID/filename"
// It works, but: if send second request with same id - Node doesn`t
// create new folder and cannot rewrite this folder. Request freezes.
// Need a tool which can check direction and if folder /ID is exist, it rewrites only file and delete
// content in tmp folder

// Code sample:
// const path = require('path');
// const fs = require('fs').promises;
// const tempDir = path.join(process.cwd(), 'tmp');
// const storeImage = path.join(process.cwd(), 'public/avatars');
// const Jimp = require('jimp');
// const moment = require('moment');
// const authService = require('../../services/auth');

// const updateAvatar = async (req, res, next) => {
//   if (!req.file) {
//     return res.status(404).json({
//       status: 'error',
//       code: 404,
//       message: 'file not found',
//     });
//   }

//   const { path: tempName, originalname } = req.file;
//   const { _id } = req.user;

//   const useDirectory = path.join(tempDir, _id.toString());
//   const publicDirectory = path.join(storeImage, _id.toString());
//   const uniqueName = moment().format('YYYY-MM-DD-HH-mm-ss');
//   try {
//     // Write to tmp
//     await fs.mkdir(useDirectory);
//     const fileName = path.join(useDirectory, originalname);
//     fs.rename(tempName, fileName);

//     // Write to public
//     await fs.mkdir(publicDirectory);
//     const newFileURL = path.join(
//       publicDirectory,
//       'avatar' + uniqueName + '.jpg',
//     );

//     Jimp.read(`${useDirectory}/${originalname}`, (err, image) => {
//       if (err) throw err;
//       image.resize(250, 250).write(newFileURL);
//     });

//     const updUser = {
//       avatarURL: newFileURL,
//     };

//     await authService.updateById(_id, { avatarURL: updUser.avatarURL });

//     res.status(201).json({
//       status: 'success',
//       code: 201,
//       data: {
//         result: updUser,
//       },
//     });
//   } catch (error) {
//     fs.unlink(tempName);
//   }
// };
