const mongoose = require('mongoose');

const aircraftSchema = new mongoose.Schema(
  {
    aircraftNumber: { type: String, required: true, unique: true, trim: true },
    model: { type: String, required: true, trim: true },
    manufacturer: { type: String, required: true, trim: true },
    seatCapacity: { type: Number, required: true, min: 1 },
    maintenanceStatus: {
      type: String,
      enum: ['Available', 'Maintenance', 'Out of Service'],
      default: 'Available'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Aircraft', aircraftSchema);
