const crypto = require('crypto');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const { listDocuments, getDocument } = require('./crudService');
const { reserveSeat, releaseSeat, getAvailableSeatNumbers } = require('../utils/seatService');

async function createBooking({ passengerId, flightId, seatNumber }) {
  const flight = await Flight.findById(flightId);

  if (!flight) {
    throw new Error('Flight not found');
  }

  const selectedSeat = seatNumber || getAvailableSeatNumbers(flight.seatMap)[0];

  if (!selectedSeat) {
    throw new Error('No seats available');
  }

  reserveSeat(flight.seatMap, selectedSeat, passengerId);
  flight.availableSeats = Math.max(flight.availableSeats - 1, 0);
  await flight.save();

  return Booking.create({
    passenger: passengerId,
    flight: flightId,
    seatNumber: selectedSeat,
    totalAmount: flight.ticketPrice,
    bookingStatus: 'Confirmed',
    paymentStatus: 'Pending',
    ticketCode: crypto.randomUUID()
  });
}

async function cancelBooking(bookingId, passengerId = null) {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (passengerId && String(booking.passenger) !== String(passengerId)) {
    throw new Error('Not authorized to cancel this booking');
  }

  if (booking.bookingStatus === 'Cancelled') {
    return booking;
  }

  const flight = await Flight.findById(booking.flight);

  if (flight) {
    releaseSeat(flight.seatMap, booking.seatNumber);
    flight.availableSeats = Math.min(flight.availableSeats + 1, flight.totalSeats);
    await flight.save();
  }

  booking.bookingStatus = 'Cancelled';
  booking.paymentStatus = 'Failed';
  return booking.save();
}

async function listBookings(query) {
  const filter = {};

  if (query.passenger) {
    filter.passenger = query.passenger;
  }

  if (query.flight) {
    filter.flight = query.flight;
  }

  if (query.status) {
    filter.bookingStatus = query.status;
  }

  return listDocuments(Booking, {
    filter,
    page: query.page,
    limit: query.limit,
    sort: query.sort || '-createdAt',
    populate: [
      { path: 'passenger', select: 'name email role phone profileImage' },
      {
        path: 'flight',
        populate: [
          { path: 'source' },
          { path: 'destination' },
          { path: 'aircraft' }
        ]
      }
    ]
  });
}

async function getBooking(id) {
  return getDocument(Booking, id, [
    { path: 'passenger', select: 'name email role phone profileImage' },
    {
      path: 'flight',
      populate: [
        { path: 'source' },
        { path: 'destination' },
        { path: 'aircraft' }
      ]
    }
  ]);
}

async function getAvailableSeats(flightId) {
  const flight = await Flight.findById(flightId);
  if (!flight) {
    throw new Error('Flight not found');
  }

  return getAvailableSeatNumbers(flight.seatMap);
}

module.exports = {
  createBooking,
  cancelBooking,
  listBookings,
  getBooking,
  getAvailableSeats
};
