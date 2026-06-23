const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apiError');
const { createCrudController } = require('../services/crudService');
const { generateTicketPdf } = require('../services/ticketService');

const crud = createCrudController(Booking, { itemName: 'booking' });

exports.createBooking = asyncHandler(async (req, res) => {
  const { flight: flightId, seatNumber } = req.body;
  const flight = await Flight.findById(flightId);

  if (!flight) {
    throw new ApiError('Flight not found', 404);
  }

  if (flight.availableSeats <= 0) {
    throw new ApiError('No seats available', 400);
  }

  // Update seatMap of the flight
  if (flight.seatMap && flight.seatMap.length > 0) {
    const seat = flight.seatMap.find(s => s.seatNumber === seatNumber);
    if (seat) {
      if (seat.isBooked) {
        throw new ApiError('Seat is already booked', 400);
      }
      seat.isBooked = true;
      seat.bookedBy = req.user._id;
      seat.bookedAt = new Date();
    } else {
      flight.seatMap.push({
        seatNumber,
        isBooked: true,
        bookedBy: req.user._id,
        bookedAt: new Date()
      });
    }
    flight.markModified('seatMap');
  } else {
    flight.seatMap = [{
      seatNumber,
      isBooked: true,
      bookedBy: req.user._id,
      bookedAt: new Date()
    }];
  }

  const booking = await Booking.create({
    passenger: req.user._id,
    flight: flightId,
    seatNumber,
    totalAmount: flight.ticketPrice,
    bookingStatus: 'Confirmed',
    paymentStatus: 'Pending',
    ticketId: `TKT-${Date.now()}`
  });

  flight.availableSeats -= 1;
  await flight.save();

  res.status(201).json({ success: true, data: booking });
});

exports.getBookings = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user.role === 'passenger') {
    filter = { passenger: req.user._id };
  }
  const bookings = await Booking.find(filter)
    .populate([
      'passenger',
      { path: 'flight', populate: ['source', 'destination', 'aircraft'] }
    ])
    .sort({ createdAt: -1 });

  res.json({ success: true, count: bookings.length, data: bookings });
});

exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate([
      'passenger',
      { path: 'flight', populate: ['source', 'destination', 'aircraft'] }
    ]);

  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  res.json({ success: true, data: booking });
});

exports.updateBooking = asyncHandler(crud.update);
exports.deleteBooking = asyncHandler(crud.remove);

exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  if (booking.bookingStatus === 'Cancelled') {
    throw new ApiError('Booking is already cancelled', 400);
  }

  booking.bookingStatus = 'Cancelled';
  await booking.save();

  const flight = await Flight.findById(booking.flight);
  if (flight) {
    flight.availableSeats += 1;
    if (flight.seatMap && flight.seatMap.length > 0) {
      const seat = flight.seatMap.find(s => s.seatNumber === booking.seatNumber);
      if (seat) {
        seat.isBooked = false;
        seat.bookedBy = null;
        seat.bookedAt = null;
      }
      flight.markModified('seatMap');
    }
    await flight.save();
  }

  res.json({ success: true, data: booking });
});

exports.downloadTicket = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate([
    'passenger',
    { path: 'flight', populate: ['source', 'destination', 'aircraft'] }
  ]);

  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  const pdfBuffer = await generateTicketPdf(booking);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=ticket-${booking.ticketId}.pdf`);
  res.send(pdfBuffer);
});

// Get bookings for a specific flight (staff/admin)
exports.getBookingsByFlight = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ flight: req.params.flightId, bookingStatus: { $ne: 'Cancelled' } })
    .populate('passenger')
    .sort({ seatNumber: 1 });

  res.json({ success: true, count: bookings.length, data: bookings });
});

// Update boarding status for a passenger (staff/admin)
exports.updateBoardingStatus = asyncHandler(async (req, res) => {
  const { boardingStatus } = req.body;
  if (!['not-boarded', 'checked-in', 'boarded'].includes(boardingStatus)) {
    throw new ApiError('Invalid boarding status', 400);
  }

  const booking = await Booking.findById(req.params.id).populate('passenger');
  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  booking.boardingStatus = boardingStatus;
  await booking.save();

  res.json({ success: true, data: booking });
});

// Bulk update boarding status for all passengers on a flight
exports.bulkUpdateBoardingStatus = asyncHandler(async (req, res) => {
  const { boardingStatus } = req.body;
  if (!['not-boarded', 'checked-in', 'boarded'].includes(boardingStatus)) {
    throw new ApiError('Invalid boarding status', 400);
  }

  await Booking.updateMany(
    { flight: req.params.flightId, bookingStatus: { $ne: 'Cancelled' } },
    { boardingStatus }
  );

  const bookings = await Booking.find({ flight: req.params.flightId, bookingStatus: { $ne: 'Cancelled' } })
    .populate('passenger')
    .sort({ seatNumber: 1 });

  res.json({ success: true, count: bookings.length, data: bookings });
});

