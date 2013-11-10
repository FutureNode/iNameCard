"use strict";

var http = require('http');
var url = require('url');
var fs = require('fs');
var util = require('util');
var path = require('path');
var async = require('async');
var mime = require('mime');

var trackbasePath = path.join(__dirname, '..', 'trackbase');
 
http.createServer(function(req, res) {

	var urlSet = url.parse(req.url);

	var trackID = path.basename(urlSet.pathname);

	var list = [
		path.join(trackbasePath, trackID + '.jpg'),
		path.join(trackbasePath, trackID + '.png'),
		path.join(trackbasePath, trackID + '.mp3')
	];

	var trackPath = null

	async.series([
		function(next) {
			async.eachSeries(list, function(item, _next) {

				// Check the specific file
				fs.exists(item, function(exists) {
					if (exists) {
						_next(item);
						return;
					}

					_next();
				});
			}, function(item) {
				trackPath = item;

				next();
			});
		},
		function(next) {
			if (!trackPath) {
				next(false);
			}

			next();
		},
		function(next) {
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
						'Content-Type': mime.lookup(trackPath)
					});

					var source = fs.createReadStream(trackPath, { start: start, end: end });
					source.pipe(res);

					return;
				}

				// Send out whole file
				res.writeHead(200, {
					'Content-Length': stats.size,
					'Content-Type': mime.lookup(trackPath)
				});

				fs.createReadStream(trackPath).pipe(res);

			});

			next(true);

		}
	], function(found) {

		if (!found) {
			res.statusCode = 404;
			res.end('NOT FOUND');
		}
	});


}).listen(8200);
