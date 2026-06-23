const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const airportRoutes = require('./routes/airportRoutes');
const aircraftRoutes = require('./routes/aircraftRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

app.use(helmet());
app.use(cors({ 
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true 
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// Express 5 compatible Mongo NoSQL injection sanitizer
// (express-mongo-sanitize, xss-clean, and hpp all crash on Express 5
//  because they try to reassign the read-only req.query / req.params)
app.use((req, _res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };
  try { if (req.body) sanitize(req.body); } catch (_) {}
  try { if (req.query) sanitize(req.query); } catch (_) {}
  try { if (req.params) sanitize(req.params); } catch (_) {}
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Airline API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/airports', airportRoutes);
app.use('/api/aircraft', aircraftRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/tickets', ticketRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
