const mongoose = require('mongoose');

const PermissionsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'superUser',
    },
    access: {
      type: String,
      enum: ['hardware', 'user'],
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
    },
    write: {
      type: Boolean,
      required: true,
    },
    delete: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('permission', PermissionsSchema);
