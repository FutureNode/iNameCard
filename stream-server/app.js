"use strict";

var http = require('http');
var url = require('url');
var fs = require('fs');
var util = require('util');
var path = require('path');

var trackbasePath = path.join(__dirname, '..', 'trackbase');
 
http.createServer(function(req, res) {

	var urlSet = url.parse(req.url);

	var trackID = path.basename(urlSet.pathname);
	var trackPath = path.join(trackbasePath, trackID + '.mp3');

	// Check the specific file
	fs.exists(trackPath, function(exists) {
		if (!exists) {
			res.statusCode = 404;
			res.end('NOT FOUND');
			return;
		}

		// Getting file status
		fs.stat(trackPath, function(err, stats) {

			if (err) {
				res.end('ERROR');
				res.statusCode = 500;
				res.end();
				return;
			}

			if (!stats.size) {
				res.statusCode = 404;
				res.end('NOT FOUND');
				return;
			}

			// Request range of file
			if (req.headers['range']) {

				// Getting range and chunk size
				var range = req.headers.range;
				var parts = range.replace(/bytes=/, "").split("-");
				var start = parseInt(parts[0], 10);

				var end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
				var chunkSize = (end - start) + 1;

				// Ready to go
				res.writeHead(206, {
					'Content-Range': 'bytes ' + start + '-' + end + '/' + stats.size,
					'Accept-Ranges': 'bytes',
					'Content-Length': chunkSize,
					'Content-Type': 'audio/mpeg'
				});

				var source = fs.createReadStream(trackPath, { start: start, end: end });
				source.pipe(res);

				return;
			}

			// Send out whole file
			res.writeHead(200, {
				'Content-Length': stats.size,
				'Content-Type': 'audio/mpeg'
			});

			fs.createReadStream(trackPath).pipe(res);

		});
	});

}).listen(8200);
