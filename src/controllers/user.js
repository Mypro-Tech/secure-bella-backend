const { asyncHandler } = require('../middlewares/asyncHandler');
const UserModal = require('../models/User');
const { profileImg } = require('../utils/defaults');
const ErrorResponse = require('../utils/ErrorResponse');
const sharp = require('sharp');

/**
 * @description Edit user Profile
 * @route PATCH /api/v1/user/edit
 * @access Private
 */
exports.editProfile = asyncHandler(async (req, res, next) => {
  const {
    _doc: { _id },
  } = req.user;

  // eslint-disable-next-line prefer-const
  let { email, password, hash, username, profileImage, ...payload } = req.body;

  const update = await UserModal.findByIdAndUpdate(_id, { ...payload }, { new: true });

  if (!update) return next(new ErrorResponse('Something went wrong!', 500));

  res.status(200).json(update);
});

/**
 * @description get user profile image
 * @route GET /api/v1/user/profile-image/:id
 * @access Private
 */
exports.getProfileImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserModal.findById(id).select('+profileImage.data').exec();

  if (user && user.profileImage && !!user.profileImage) {
    return res.status(200).send(user.profileImage);
  }
  res.send(Buffer.from(profileImg, 'base64'));
});

/**
 * @description get user profile image
 * @route PATCH /api/v1/user/profile-image/:id
 * @access Private
 */
exports.updateProfilePic = asyncHandler(async (req, res, next) => {
  const {
    _doc: { _id },
  } = req.user;
  if (!req.file) return next(new ErrorResponse('file missing', 400));

  const { buffer, mimetype } = req.file;
  let resized = buffer;
  if (mimetype.includes('image')) {
    resized = await sharp(buffer)
      .jpeg({ quality: 30, progressive: true, force: false })
      .png({ quality: 30, progressive: true, force: false })
      .toBuffer();
  }

  const user = await UserModal.findByIdAndUpdate(_id, { profileImage: resized }, { new: true }).exec();

  if (!user) return next(new ErrorResponse('Something went wrong', 500));

  res.send('ok');
});
