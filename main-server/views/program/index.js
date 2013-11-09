"use strict";

exports.getMetadata = function(req, res) {

	if (!req.params.id) {
		res.send(404, 'NOT FOUND');
		return;
	}

	var workflow = req.app.utility.workflow(req, res);

	// Getting specific program
	req.app.db.models.Program.findById(req.params.id).exec(function(err, program) {
		if (err) {
			return workflow.emit('exception', err);
		}

		workflow.outcome.program = program;
		return workflow.emit('response');
	});
};

exports.createMetadata = function(req, res) {

	var workflow = req.app.utility.workflow(req, res);

	// Create a new program
	req.app.db.models.Program.create({ user: req.user }, function(err, program) {
		if (err) {
			return workflow.emit('exception', err);
		}
	  
		workflow.outcome.program = program;
		return workflow.emit('response');
	});
};
