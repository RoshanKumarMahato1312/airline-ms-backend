const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { asyncHandler } = require('../utils/asyncHandler');
const { createCrudController } = require('../services/crudService');

const crud = createCrudController(Payment, { itemName: 'payment' });

exports.createPayment = asyncHandler(async (req, res) => {
  // If payment status is Success, update booking paymentStatus to Success
  const { bookingId, amount, method } = req.body;
  const payment = await Payment.create({
    booking: bookingId,
    amount,
    paymentMethod: method,
    paymentStatus: 'Success',
    transactionId: `TXN-${Date.now()}`
  });

  const booking = await Booking.findById(bookingId);
  if (booking) {
    booking.paymentStatus = 'Success';
    await booking.save();
  }

  res.status(201).json({ success: true, data: payment });
});

exports.getPayments = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user.role === 'passenger') {
    const userBookings = await Booking.find({ passenger: req.user._id }).select('_id');
    const bookingIds = userBookings.map(b => b._id);
    filter = { booking: { $in: bookingIds } };
  }

  const payments = await Payment.find(filter)
    .populate({
      path: 'booking',
      populate: [
        'passenger',
        { path: 'flight', populate: ['source', 'destination', 'aircraft'] }
      ]
    })
    .sort({ createdAt: -1 });

  res.json({ success: true, count: payments.length, data: payments });
});

exports.getPayment = asyncHandler(crud.getOne);
exports.updatePayment = asyncHandler(crud.update);
exports.deletePayment = asyncHandler(crud.remove);
