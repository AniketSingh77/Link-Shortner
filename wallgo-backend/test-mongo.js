const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Testing MongoDB connection...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connection Successful!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
  });
