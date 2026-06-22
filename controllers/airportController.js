const Airport = require('../models/Airport');
const { asyncHandler } = require('../utils/asyncHandler');
const { createCrudController } = require('../services/crudService');

const crud = createCrudController(Airport, { itemName: 'airport' });

exports.createAirport = asyncHandler(crud.create);
exports.getAirports = asyncHandler(crud.getAll);
exports.getAirport = asyncHandler(crud.getOne);
exports.updateAirport = asyncHandler(crud.update);
exports.deleteAirport = asyncHandler(crud.remove);
