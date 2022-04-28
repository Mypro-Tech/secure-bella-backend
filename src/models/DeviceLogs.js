const mongoose = require('mongoose');

const DeviceLogSchema = new mongoose.Schema(
  {
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'superUser',
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'device',
    },
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'actionByType',
      required: true,
    },
    actionByType: {
      type: String,
      enum: ['user', 'superUser'],
      required: true,
    },
    actionCode: String,
    action: String,
    status: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('deviceLog', DeviceLogSchema);
