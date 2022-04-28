const express = require('express');

const authRouter = express.Router();

const {
  login,
  register,
  resendVerificationEmail,
  verifyUser,
  whoami,
  forgetPassword,
  verifyUserToResetPassword,
  resetPassword,
} = require('../controllers/auth');
const { verifyUserToken, verifyUserIsApproved } = require('../middlewares/auth');

// USER ROUTES
authRouter.route('/login').post(login);
authRouter.route('/register').post(register);
authRouter.route('/resend-verification-email').get(verifyUserToken, resendVerificationEmail);
authRouter.route('/whoami').get(verifyUserToken, verifyUserIsApproved, whoami);
authRouter.route('/verify').post(verifyUserToken, verifyUser);
authRouter.route('/forget-password/:email').get(forgetPassword);
authRouter.route('/verify-user-to-resetPassword').post(verifyUserToResetPassword);
authRouter.route('/reset-password').post(verifyUserToken, resetPassword);

module.exports = authRouter;
