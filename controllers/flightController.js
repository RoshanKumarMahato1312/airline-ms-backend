const mongoose = require('mongoose');
const Flight = require('../models/Flight');
const Airport = require('../models/Airport');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apiError');
const { createCrudController } = require('../services/crudService');

const crud = createCrudController(Flight, { itemName: 'flight' });

exports.createFlight = asyncHandler(crud.create);

exports.getFlights = asyncHandler(async (req, res) => {
  const flights = await Flight.find().populate(['source', 'destination', 'aircraft']).sort({ createdAt: -1 });
  res.json({ success: true, count: flights.length, data: flights });
});

exports.getFlight = asyncHandler(async (req, res) => {
  const flight = await Flight.findById(req.params.id).populate(['source', 'destination', 'aircraft']);
  if (!flight) {
    throw new ApiError('Flight not found', 404);
  }
  res.json({ success: true, data: flight });
});

exports.updateFlight = asyncHandler(crud.update);
exports.deleteFlight = asyncHandler(crud.remove);

exports.searchFlights = asyncHandler(async (req, res) => {
	const filter = {};

	if (req.query.source) {
		const sourceCode = req.query.source.trim().toUpperCase();
		const airport = await Airport.findOne({ airportCode: sourceCode });
		if (airport) {
			filter.source = airport._id;
		} else if (mongoose.Types.ObjectId.isValid(req.query.source)) {
			filter.source = req.query.source;
		} else {
			filter.source = new mongoose.Types.ObjectId(); // force no results for invalid code
		}
	}

	if (req.query.destination) {
		const destCode = req.query.destination.trim().toUpperCase();
		const airport = await Airport.findOne({ airportCode: destCode });
		if (airport) {
			filter.destination = airport._id;
		} else if (mongoose.Types.ObjectId.isValid(req.query.destination)) {
			filter.destination = req.query.destination;
		} else {
			filter.destination = new mongoose.Types.ObjectId(); // force no results for invalid code
		}
	}

	if (req.query.airlineName) {
		filter.airlineName = new RegExp(req.query.airlineName, 'i');
	}

	if (req.query.departureDate) {
		const start = new Date(req.query.departureDate);
		const end = new Date(req.query.departureDate);
		end.setHours(23, 59, 59, 999);
		filter.departureTime = { $gte: start, $lte: end };
	}

	const flights = await Flight.find(filter).populate(['source', 'destination', 'aircraft']).sort({ departureTime: 1 });
	res.json({ success: true, count: flights.length, data: flights });
});

exports.getFlightSeats = asyncHandler(async (req, res) => {
	const flight = await Flight.findById(req.params.id);

	if (!flight) {
		res.status(404);
		throw new Error('Flight not found');
	}

	res.json({ success: true, data: flight.seatMap });
});
