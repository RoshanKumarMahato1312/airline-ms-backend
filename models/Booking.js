const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
    bookingDate: { type: Date, default: Date.now },
    seatNumber: { type: String, required: true, trim: true },
    totalAmount: { type: Number, required: true, min: 0 },
    bookingStatus: { type: String, enum: ['Confirmed', 'Pending', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Success', 'Pending', 'Failed'], default: 'Pending' },
    boardingStatus: { type: String, enum: ['not-boarded', 'checked-in', 'boarded'], default: 'not-boarded' },
    ticketId: { type: String, unique: true, sparse: true },
    qrCode: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
