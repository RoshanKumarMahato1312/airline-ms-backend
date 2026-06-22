const { asyncHandler } = require('../utils/asyncHandler');
const reportService = require('../services/reportService');

exports.getDashboardReport = asyncHandler(async (_req, res) => {
  const summary = await reportService.getDashboardSummary();
  res.json({ success: true, data: summary });
});
