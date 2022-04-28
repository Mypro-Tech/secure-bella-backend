const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ['superadmin', 'admin', 'accountant'],
    },
    username: {
      type: String,
      required: [true, 'Email field cannot be left empty'],
      unique: true,
    },
    pin: {
      type: String,
      required: [true, 'Please enter Pin'],
      minlength: [4, 'Pin must be atleast 6 characters'],
      maxlength: [12, 'Pin cannot excede 1024 characters'],
      select: false,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'superUser',
    },
    // parking/device???
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('user', UserSchema);
