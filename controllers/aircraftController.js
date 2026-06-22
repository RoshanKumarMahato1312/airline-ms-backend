const Aircraft = require('../models/Aircraft');
const { asyncHandler } = require('../utils/asyncHandler');
const { createCrudController } = require('../services/crudService');

const crud = createCrudController(Aircraft, { itemName: 'aircraft' });

exports.createAircraft = asyncHandler(crud.create);
exports.getAircrafts = asyncHandler(crud.getAll);
exports.getAircraft = asyncHandler(crud.getOne);
exports.updateAircraft = asyncHandler(crud.update);
exports.deleteAircraft = asyncHandler(crud.remove);
