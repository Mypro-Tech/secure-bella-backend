const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * USER STUFF
 */
// verify jwt and check if user exists
exports.verifyUserToken = async (req, res, next) => {
  const token =
    (req.headers.authorization && req.headers.authorization.split('Bearer')[1]) ||
    (req.signedCookies && req.signedCookies.jwt) ||
    (req.cookies && req.cookies.jwt);

  if (token) {
    let verify;
    try {
      verify = jwt.verify(token.trim(), process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).send('unauthorized');
    }

    let user;
    try {
      user = await UserModel.findOne({ _id: verify._id }).select('+verificationCode +otpLastSentTime');

      if (!user) {
        return res.status(401).send('unauthorized');
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).send('unauthorized');
    }
  } else {
    return res.status(401).send('unauthorized');
  }
};

exports.verifyUserIsApproved = (req, res, next) => {
  if (req.user.isApproved) {
    next();
  } else {
    return next(new ErrorResponse('Cannot access this resource. Reason: account not approved!', 403));
  }
};
