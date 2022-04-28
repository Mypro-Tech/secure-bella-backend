const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const SuperUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'email field cannot be left empty'],
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: [true, 'username field cannot be left empty'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter password'],
      minlength: [6, 'Password must be atleast 6 characters'],
      maxlength: [1024, 'Password cannot excede 1024 characters'],
      select: false,
    },
    userMeta: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'userMetaType',
      required: true,
    },
    userMetaType: {
      type: String,
      enum: ['adminMeta', 'managerMeta'],
      required: true,
    },
    fcm: [String],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    profileImage: { type: Buffer, select: false },
    verificationCode: {
      type: String,
      select: false,
    },
    otpLastSentTime: {
      type: Number,
      select: false,
    },
    createdBy: {
      type: String,
      default: 'self',
    },
  },
  {
    timestamps: true,
  }
);

SuperUserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

SuperUserSchema.methods.setPassword = async function (newPass) {
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(newPass, salt);
  return pass;
};

SuperUserSchema.methods.getHashKey = function () {
  return bcrypt.hash(this.password, salt);
};

SuperUserSchema.methods.getSignedjwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

SuperUserSchema.methods.matchPasswords = async function (enteredPassword, savedPass) {
  const isMatched = await bcrypt.compare(enteredPassword, savedPass);
  return isMatched;
};

SuperUserSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('superUser', SuperUserSchema);
