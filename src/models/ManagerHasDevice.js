const mongoose = require('mongoose');

const ManagerDeviceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'superUser',
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'superUser',
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'device',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('managerHasDevice', ManagerDeviceSchema);
