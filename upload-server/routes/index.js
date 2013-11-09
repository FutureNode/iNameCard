
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'Express' });
};

exports.test = function(req, res) {
    req.app.db.models.Track.find({}, function(err, tracks) {
        res.json({tracks: tracks});
    });
};

exports.addRecord = function(req, res) {

    var fieldsToSet = {
        user: req.session.passport.user,
        type: 'audio'
    };

    req.app.db.models.Track.create(fieldsToSet, function(err, track) {
        if (err) return res.json(err);

        var fs = require('fs');
        var path = require('path');
        var filename = track._id + '.mp3'

        // console.log(path.join(__dirname, '..', 'trackbase', filename));
        var exec = require('child_process').exec,
        child;
        var srcAudio = req.files.file.path;
        var targetAudio = path.join(__dirname, '../../', 'trackbase', filename);

        child = exec('lame ' + srcAudio + ' ' + targetAudio, function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
                res.json(error);
            } else {
                res.json(track);
            }
        });
    });
};
