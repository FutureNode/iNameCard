"use strict";

exports.getMetadata = function(req, res) {

	if (!req.params.id) {
		res.send(404, 'NOT FOUND');
		return;
	}

	// Getting specific program
	req.app.db.models.Program.findById(req.params.id).exec(function(err, program) {
		res.json(program);
		res.end();
	});
};
