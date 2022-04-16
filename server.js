const express = require('express');
const https = require('https');
const fs = require('fs');
const logger = require('./logger.js');

// parameter
const PORT = 8000;
const PUBLIC_PATH = "dist/";
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
let app = express();

// server creation
https.createServer(options, app).listen(PORT, () => {
  logger.info(`Start of server on localhost:${PORT} ...`);
});
app.use(express.static(PUBLIC_PATH));
