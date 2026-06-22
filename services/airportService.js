const Airport = require('../models/Airport');
const { listDocuments, getDocument } = require('./crudService');

async function createAirport(payload) {
  return Airport.create(payload);
}

async function updateAirport(id, payload) {
  return Airport.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
}

async function deleteAirport(id) {
  return Airport.findByIdAndDelete(id);
}

async function listAirports(query) {
  const filter = {};

  if (query.search) {
    filter.$or = [
      { airportCode: new RegExp(query.search, 'i') },
      { airportName: new RegExp(query.search, 'i') },
      { city: new RegExp(query.search, 'i') },
      { country: new RegExp(query.search, 'i') }
    ];
  }

  return listDocuments(Airport, {
    filter,
    page: query.page,
    limit: query.limit,
    sort: query.sort || 'airportCode'
  });
}

async function getAirport(id) {
  return getDocument(Airport, id);
}

module.exports = {
  createAirport,
  updateAirport,
  deleteAirport,
  listAirports,
  getAirport
};
