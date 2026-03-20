require('dotenv').config();
console.log('Dotenv injected');
const express = require('express');
console.log('Express loaded');
const mongoose = require('mongoose');
console.log('Mongoose loaded');
console.log('URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected'))
  .catch(err => console.log('Error:', err));
setTimeout(() => process.exit(0), 10000);
