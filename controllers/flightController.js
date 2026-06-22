const Flight = require('../models/Flight');
const { asyncHandler } = require('../utils/asyncHandler');
const { createCrudController } = require('../services/crudService');

const crud = createCrudController(Flight, { itemName: 'flight' });

exports.createFlight = asyncHandler(crud.create);
exports.getFlights = asyncHandler(crud.getAll);
exports.getFlight = asyncHandler(crud.getOne);
exports.updateFlight = asyncHandler(crud.update);
exports.deleteFlight = asyncHandler(crud.remove);

exports.searchFlights = asyncHandler(async (req, res) => {
	const filter = {};

	if (req.query.source) {
		filter.source = req.query.source;
	}

	if (req.query.destination) {
		filter.destination = req.query.destination;
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
