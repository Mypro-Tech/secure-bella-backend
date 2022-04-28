const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema(
  {
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'superUser',
    },
    mac: {
      type: String,
      required: true,
      unique: true,
    },
    lanIp: {
      type: String,
    },
    wlanIp: {
      type: String,
    },
    location: { type: { type: String }, coordinates: [Number] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('device', DeviceSchema);
