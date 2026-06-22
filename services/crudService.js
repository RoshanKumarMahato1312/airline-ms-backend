const { ApiError } = require('../utils/apiError');

function createCrudController(Model, options = {}) {
  const itemName = options.itemName || 'item';

  return {
    create: async (req, res) => {
      const created = await Model.create(req.body);
      res.status(201).json({ success: true, data: created });
    },
    getAll: async (_req, res) => {
      const items = await Model.find().sort({ createdAt: -1 });
      res.json({ success: true, count: items.length, data: items });
    },
    getOne: async (req, res) => {
      const item = await Model.findById(req.params.id);
      if (!item) {
        throw new ApiError(`${itemName} not found`, 404);
      }
      res.json({ success: true, data: item });
    },
    update: async (req, res) => {
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!updated) {
        throw new ApiError(`${itemName} not found`, 404);
      }
      res.json({ success: true, data: updated });
    },
    remove: async (req, res) => {
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) {
        throw new ApiError(`${itemName} not found`, 404);
      }
      res.json({ success: true, message: `${itemName} deleted` });
    }
  };
}

module.exports = { createCrudController };
