const Payment = require('../models/Payment');
const { asyncHandler } = require('../utils/asyncHandler');
const { createCrudController } = require('../services/crudService');

const crud = createCrudController(Payment, { itemName: 'payment' });

exports.createPayment = asyncHandler(crud.create);
exports.getPayments = asyncHandler(crud.getAll);
exports.getPayment = asyncHandler(crud.getOne);
exports.updatePayment = asyncHandler(crud.update);
exports.deletePayment = asyncHandler(crud.remove);
