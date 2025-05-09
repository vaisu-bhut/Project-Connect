const serverless = require('serverless-http');
const app = require('./app');

// Export Lambda handler
module.exports.handler = serverless(app, {
  binary: ['image/*', 'application/pdf'] // Add binary MIME types if needed
});