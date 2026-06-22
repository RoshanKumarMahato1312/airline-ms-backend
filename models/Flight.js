const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    bookedAt: { type: Date, default: null }
  },
  { _id: false }
);

const flightSchema = new mongoose.Schema(
  {
    flightNumber: { type: String, required: true, unique: true, trim: true },
    airlineName: { type: String, required: true, trim: true },
    source: { type: mongoose.Schema.Types.ObjectId, ref: 'Airport', required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Airport', required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    duration: { type: String, trim: true },
    aircraft: { type: mongoose.Schema.Types.ObjectId, ref: 'Aircraft', required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    ticketPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Scheduled', 'Boarding', 'Delayed', 'Departed', 'Arrived', 'Cancelled'],
      default: 'Scheduled'
    },
    seatMap: { type: [seatSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flight', flightSchema);
