const mongoose = require('mongoose');

const NotificationsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'superUser',
    },
    incorrectPass: {
      type: Boolean,
      required: true,
    },
    allLogs: {
      type: Boolean,
      required: true,
    },
    editProfile: {
      type: Boolean,
      required: true,
    },
    // parking/device???
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('notification', NotificationsSchema);
