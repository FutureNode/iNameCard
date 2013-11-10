exports.create = function(req, res, next) {
    var user = req.session.passport ? req.session.passport.user : '';
    var programId = req.body.programId;
    var text = req.body.text;
    if (!programId || !text) res.json({error: 'program Id not found'});

    var fieldsToSet = {
        user: user,
        type: 'text'
    };

    req.app.db.models.Track.create(fieldsToSet, function(err, track) {
        if (err) return res.json(err);

        var fs = require('fs');
        var path = require('path');
        var ext = '.vtt';

        fs.readFile(req.files.file.path, function (err, data) {
            var newPath = path.join(__dirname, '../../', 'trackbase', track._id + ext);

            fs.writeFile(newPath, "WEBVTT\n\n00:00.000 --> 00:30.000\n\n" + text, function (err) {
                req.app.db.models.Program.update({_id: programId}, {text: track._id}, { upsert: false, multi: true }, function(err, numAffected) {
                    res.json(track);
                });
            });
        });
    });
};


