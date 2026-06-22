const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'API index' });
});

module.exports = router;
