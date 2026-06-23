// This script calls the RUNNING backend API to create the admin user.
// No direct MongoDB connection needed — just uses HTTP.

const http = require('http');

const data = JSON.stringify({
  name: 'System Admin',
  email: 'admin@airlinex.com',
  password: 'Admin@123',
  phone: '+1234567890',
  role: 'admin'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const parsed = JSON.parse(body);
      console.log('Response:', JSON.stringify(parsed, null, 2));
      if (parsed.success) {
        console.log('\n✅ Admin user created successfully!');
        console.log('   Email:    admin@airlinex.com');
        console.log('   Password: Admin@123');
      } else {
        console.log('\n❌ Failed:', parsed.message || 'Unknown error');
      }
    } catch (e) {
      console.log('Raw response:', body);
    }
  });
});

req.on('error', (e) => {
  console.error('Error: Could not connect to backend at localhost:5000');
  console.error('Make sure the backend is running with: npm run dev');
  console.error(e.message);
});

req.write(data);
req.end();
