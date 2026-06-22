const Flight = require('../models/Flight');
const Airport = require('../models/Airport');
const Aircraft = require('../models/Aircraft');
const { listDocuments, getDocument } = require('./crudService');
const { createSeatMap } = require('../utils/seatService');

async function createFlight(payload) {
  if (payload.source === payload.destination) {
    throw new Error('Source and destination cannot be the same');
  }

  const [sourceAirport, destinationAirport, aircraft] = await Promise.all([
    Airport.findById(payload.source),
    Airport.findById(payload.destination),
    Aircraft.findById(payload.aircraft)
  ]);

  if (!sourceAirport || !destinationAirport || !aircraft) {
    throw new Error('Referenced airport or aircraft not found');
  }

  const totalSeats = Number(payload.totalSeats || aircraft.seatCapacity);
  const seatMap = createSeatMap(totalSeats);

  return Flight.create({
    ...payload,
    totalSeats,
    availableSeats: totalSeats,
    seatMap
  });
}

async function updateFlight(id, payload) {
  const flight = await Flight.findById(id);
  if (!flight) {
    throw new Error('Flight not found');
  }

  Object.assign(flight, payload);

  if (payload.totalSeats && Number(payload.totalSeats) !== flight.seatMap.length) {
    const totalSeats = Number(payload.totalSeats);
    flight.totalSeats = totalSeats;
    flight.availableSeats = Math.min(flight.availableSeats, totalSeats);
  }

  return flight.save();
}

async function deleteFlight(id) {
  return Flight.findByIdAndDelete(id);
}

async function getFlight(id) {
  return getDocument(Flight, id, [
    { path: 'source' },
    { path: 'destination' },
    { path: 'aircraft' }
  ]);
}

async function listFlights(query) {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.airlineName) {
    filter.airlineName = new RegExp(query.airlineName, 'i');
  }

  if (query.flightNumber) {
    filter.flightNumber = new RegExp(query.flightNumber, 'i');
  }

  if (query.source) {
    filter.source = query.source;
  }

  if (query.destination) {
    filter.destination = query.destination;
  }

  if (query.departureDate) {
    const dayStart = new Date(query.departureDate);
    const dayEnd = new Date(query.departureDate);
    dayEnd.setHours(23, 59, 59, 999);
    filter.departureTime = { $gte: dayStart, $lte: dayEnd };
  }

  return listDocuments(Flight, {
    filter,
    page: query.page,
    limit: query.limit,
    sort: query.sort || 'departureTime',
    populate: [
      { path: 'source' },
      { path: 'destination' },
      { path: 'aircraft' }
    ]
  });
}

async function updateFlightStatus(id, status) {
  return Flight.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
}

async function getSearchResults(query) {
  return listFlights(query);
}

module.exports = {
  createFlight,
  updateFlight,
  deleteFlight,
  getFlight,
  listFlights,
  updateFlightStatus,
  getSearchResults
};
