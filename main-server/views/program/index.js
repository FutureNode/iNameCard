"use strict";

exports.getMetadata = function(req, res, next) {

	if (!req.params.id) {
		next();
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

exports.createMetadata = function(req, res, next) {

	var workflow = req.app.utility.workflow(req, res);

	// Create a new program
	req.app.db.models.Program.create({ user: req.user._id }, function(err, program) {
		if (err) {
			return workflow.emit('exception', err);
		}

		workflow.outcome.program = program;
		return workflow.emit('response');
	});
};


exports.listMetadata = function(req, res, next) {

	var workflow = req.app.utility.workflow(req, res);

	// Getting specific program
	req.app.db.models.Program.find().exec(function(err, programs) {
		if (err) {
			return workflow.emit('exception', err);
		}

		workflow.outcome.programs = programs;
		return workflow.emit('response');
	});
};

// program - create new one page
exports.create = function(req, res, next) {
    res.render('program/index');
};
