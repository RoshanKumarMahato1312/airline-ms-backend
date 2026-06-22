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

exports.getBookings = asyncHandler(crud.getAll);
exports.getBooking = asyncHandler(crud.getOne);
exports.updateBooking = asyncHandler(crud.update);
exports.deleteBooking = asyncHandler(crud.remove);

exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  booking.bookingStatus = 'Cancelled';
  await booking.save();

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
