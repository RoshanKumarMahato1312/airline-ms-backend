const Flight = require('../models/Flight');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Payment = require('../models/Payment');

async function getDashboardSummary() {
  const [totalFlights, totalBookings, totalPassengers, activeFlights, revenueResult, bookingStats, paymentStats] = await Promise.all([
    Flight.countDocuments(),
    Booking.countDocuments(),
    User.countDocuments({ role: 'passenger' }),
    Flight.countDocuments({ status: { $in: ['Scheduled', 'Boarding', 'Delayed'] } }),
    Payment.aggregate([{ $match: { paymentStatus: 'Success' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Booking.aggregate([{ $group: { _id: '$bookingStatus', count: { $sum: 1 } } }]),
    Payment.aggregate([{ $group: { _id: '$paymentStatus', count: { $sum: 1 } } }])
  ]);

  return {
    totalFlights,
    totalBookings,
    totalPassengers,
    activeFlights,
    revenueGenerated: revenueResult[0]?.total || 0,
    charts: {
      bookingStats,
      paymentStats
    }
  };
}

module.exports = { getDashboardSummary };