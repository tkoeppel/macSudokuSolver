const express = require('express');
const https = require('https');
const fs = require('fs');
const fileupload = require('express-fileupload')
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
app.use(fileupload({
	createParentPath: true
}));

// File handling
app.post('/saveImage', async (req, res) => {
	logger.info(`Receiving file '${{...req.files.sudoku_photo}.name}'`);
	try {
		if (!req.files) {
			logger.warning(`No file uploaded!`)
			res.send({
				status: false,
				message: 'No file uploaded'
			});
		} else {
			let photo = req.files.sudoku_photo;
			//photo.mv('./uploads/' + photo.name);

			//send response
			res.send({
				status: true,
				message: 'File is uploaded',
				data: {
					name: photo.name,
					mimetype: photo.mimetype,
					size: photo.size
				}
			});
			logger.info(`Uploaded file '${photo.name}' successfully`);
		}
	} catch (err) {
		res.status(500).send(err);
	}
});
