const Booking = require('../models/Booking');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apiError');
const { generateTicketPdf } = require('../services/ticketService');

exports.downloadTicket = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId).populate([
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
