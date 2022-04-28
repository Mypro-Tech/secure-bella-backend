const auth = require('../middlewares/auth');
const ErrorResponse = require('../utils/ErrorResponse');
const dayjs = require('dayjs');
const UserModel = require('../models/User');
const bcrypt = require('bcryptjs');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { sendVerificationCodeToEmail } = require('../utils/Mailer');
const { get6DigitCode } = require('../utils/Methods');

/**
 * @description Login a user
 * @route POST /api/v1/auth/login
 * @access Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }
  const user = await UserModel.findOne({ username: email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid Credentials!', 401));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid Credentials!', 401));
  }

  const token = user.getSignedjwtToken();

  res.status(200).send({ token, isApproved: true });
});

/**
 * @description Register a user
 * @route POST /api/v1/auth/register
 * @access Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const user = await UserModel.create({ ...req.body, username: req.body.email });

  if (!user) return next(new ErrorResponse('Something went wrong', 500));

  const otp = get6DigitCode();

  // send email
  sendVerificationCodeToEmail(req.body.email, otp);
  await UserModel.findByIdAndUpdate({ _id: user._id }, { verificationCode: otp, otpLastSentTime: dayjs().valueOf() });

  const token = user.getSignedjwtToken();

  res.status(200).json({ success: true, message: 'Verfication code is sent on email!', token });
});

/**
 * @description Resend Verification
 * @route GET /api/v1/auth/resend-verification-email
 * @access Private
 */
exports.resendVerificationEmail = asyncHandler(async (req, res, next) => {
  const { user } = req;

  if (!user) return next(new ErrorResponse('No user found!', 404));

  const otp = get6DigitCode();
  // nodemailer call here
  sendVerificationCodeToEmail(user.email, otp);
  await UserModel.findByIdAndUpdate({ _id: user._id }, { verificationCode: otp, otpLastSentTime: dayjs().valueOf() });

  res.status(200).json({ success: true, message: 'Verfication email sent!' });
});

/**
 * @description Forget Password
 * @route GET /api/v1/auth/forget-password
 * @access Public
 */
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.params;
  if (!email) return next(new ErrorResponse('Bad Request!', 400));
  const user = await UserModel.findOne({ email });
  if (!user) return next(new ErrorResponse(`No user found with email ${email}`, 404));

  const otp = get6DigitCode();
  // nodemailer call here
  sendVerificationCodeToEmail(user.email, otp);
  await UserModel.findByIdAndUpdate({ _id: user._id }, { verificationCode: otp, otpLastSentTime: dayjs().valueOf() });

  res.status(200).json({ success: true, message: 'Verfication email sent!' });
});

/**
 * @description Reset Password
 * @route POST /api/v1/auth/reset-password
 * @access Private
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  if (!password) return next(new ErrorResponse('field `password` is required', 404));
  const { user } = req;

  await user.setPassword(password);

  res.status(200).json({ success: true, message: 'Password Reset was successful!' });
});

/**
 * @description Verify User with OTP
 * @route GET /api/v1/auth/verify
 * @access Private
 */
exports.verifyUser = asyncHandler(async (req, res, next) => {
  const { _id, verificationCode, otpLastSentTime } = req.user._doc;
  const { code } = req.body;

  if (!code) return next(new ErrorResponse('code is missing in body!', 400));

  if (dayjs().diff(dayjs(otpLastSentTime)) > 300000 || verificationCode == null || otpLastSentTime == null)
    return next(new ErrorResponse('OTP is expired or used already!', 400));

  if (code !== verificationCode) return next(new ErrorResponse('OTP is incorrect!', 400));

  await UserModel.findByIdAndUpdate(_id, { verificationCode: null, otpLastSentTime: null, isApproved: true });

  res.status(200).json({ success: true, message: 'Profile verified!' });
});

/**
 * @description Verify User with OTP for Password Reset
 * @route GET /api/v1/auth/verify-user-to-resetPassword
 * @access Public
 */
exports.verifyUserToResetPassword = asyncHandler(async (req, res, next) => {
  const { code, email } = req.body;

  if (!code) return next(new ErrorResponse('code is missing in body!', 400));

  if (!email) return next(new ErrorResponse('email is missing in body!', 400));

  const user = await UserModel.findOne({ email }).select('+verificationCode +otpLastSentTime');

  if (!user) return next(new ErrorResponse(`Account doesn't exists!`, 400));

  if (dayjs().diff(dayjs(user.otpLastSentTime)) > 300000 || user.verificationCode == null || user.otpLastSentTime == null)
    return next(new ErrorResponse('OTP is expired or used already!', 400));

  if (code !== user.verificationCode) return next(new ErrorResponse('OTP is incorrect!', 400));

  await UserModel.findByIdAndUpdate(user._id, { verificationCode: null, otpLastSentTime: null });

  const token = auth.getToken({ _id: user._id });

  res.status(200).json({ success: true, message: 'Otp Verified!', token });
});

/**
 * @description Decode user JWT
 * @route GET /api/v1/auth/whoami
 * @access Public
 */
exports.whoami = asyncHandler(async (req, res) => {
  const { _id, organizationType } = req.user._doc;

  let user;
  if (organizationType === 'other') {
    user = await UserModel.findById(_id);
  } else user = await UserModel.findById(_id);

  res.status(200).send(user);
});
