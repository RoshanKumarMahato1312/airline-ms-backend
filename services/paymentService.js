const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { listDocuments, getDocument } = require('./crudService');

async function createPayment({ bookingId, paymentMethod, amount, paymentStatus = 'Success' }) {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error('Booking not found');
  }

  const transactionId = crypto.randomUUID();
  const invoiceNumber = `INV-${Date.now()}`;

  const payment = await Payment.create({
    booking: bookingId,
    amount: amount || booking.totalAmount,
    paymentMethod,
    paymentStatus,
    transactionId,
    invoiceNumber
  });

  booking.paymentStatus = paymentStatus;
  if (paymentStatus === 'Success') {
    booking.bookingStatus = 'Confirmed';
  }
  await booking.save();

  return payment;
}

async function refundPayment(paymentId) {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new Error('Payment not found');
  }

  payment.paymentStatus = 'Failed';
  return payment.save();
}

async function listPayments(query) {
  const filter = {};

  if (query.booking) {
    filter.booking = query.booking;
  }

  if (query.status) {
    filter.paymentStatus = query.status;
  }

  return listDocuments(Payment, {
    filter,
    page: query.page,
    limit: query.limit,
    sort: query.sort || '-createdAt',
    populate: [{ path: 'booking' }]
  });
}

async function getPayment(id) {
  return getDocument(Payment, id, [{ path: 'booking' }]);
}

module.exports = {
  createPayment,
  refundPayment,
  listPayments,
  getPayment
};
