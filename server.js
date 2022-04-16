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
app.post('/nn', async (req, res) => {
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
            // TODO nn stuff
            const dummy = [
                [0, 0, 3, 0, 2, 0, 6, 0, 0],
                [9, 0, 0, 3, 0, 0, 0, 0, 1],
                [0, 0, 1, 8, 0, 0, 4, 0, 0],
                [0, 0, 8, 1, 0, 2, 9, 0, 0],
                [7, 0, 0, 0, 0, 0, 0, 0, 8],
                [0, 0, 6, 7, 0, 8, 2, 0, 0],
                [0, 0, 2, 6, 0, 9, 5, 0, 0],
                [8, 0, 0, 2, 0, 3, 0, 0, 9],
                [0, 0, 5, 0, 1, 0, 3, 0, 0]
            ];

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size,
                    matrix: dummy,
                }
            });
            logger.info(`Uploaded file '${photo.name}' successfully`);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});
