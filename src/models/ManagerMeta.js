const mongoose = require('mongoose');

const ManagerMetaSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: String,
    company: String,
    mailingAddr: String,
    phone: String,
    city: String,
    country: String,
    state: String,
    zip: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('managerMeta', ManagerMetaSchema);
