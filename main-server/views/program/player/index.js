"use strict";

exports.play = function(req, res, next) {

	if (!req.params.id) {
		next();
		return;
	}

	var workflow = req.app.utility.workflow(req, res);

	// Getting specific program
	req.app.db.models.Program.findById(req.params.id).exec(function(err, program) {
		if (err) {
			next();
			return;
		}

		res.render('program/player/index', { programID: program._id });
	});
};
