const Aircraft = require('../models/Aircraft');
const { listDocuments, getDocument } = require('./crudService');

async function createAircraft(payload) {
  return Aircraft.create(payload);
}

async function updateAircraft(id, payload) {
  return Aircraft.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
}

async function deleteAircraft(id) {
  return Aircraft.findByIdAndDelete(id);
}

async function listAircraft(query) {
  const filter = {};

  if (query.search) {
    filter.$or = [
      { aircraftNumber: new RegExp(query.search, 'i') },
      { model: new RegExp(query.search, 'i') },
      { manufacturer: new RegExp(query.search, 'i') }
    ];
  }

  return listDocuments(Aircraft, {
    filter,
    page: query.page,
    limit: query.limit,
    sort: query.sort || '-createdAt'
  });
}

async function getAircraft(id) {
  return getDocument(Aircraft, id);
}

module.exports = {
  createAircraft,
  updateAircraft,
  deleteAircraft,
  listAircraft,
  getAircraft
};
