require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const seedAdmin = require('./utils/seedAdmin');

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`Airline backend running on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
