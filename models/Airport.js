const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema(
  {
    airportCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    airportName: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    country: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Airport', airportSchema);
