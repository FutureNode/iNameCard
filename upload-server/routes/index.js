
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'Express' });
};

exports.test = function(req, res) {
    // req.app.db.models.Track.find({}, function(err, tracks) {
    //     res.json(tracks);
    // });

    req.app.db.models.Program.find({}, function(err, programs) {
        res.json(programs);
    });
};

exports.addImage = function(req, res) {

    var user = req.session.passport ? req.session.passport.user : '';
    var programId = req.body.programId;
    if (!programId) res.json({error: 'program Id not found'});

    var fieldsToSet = {
        user: user,
        type: 'image'
    };

    // create image
    req.app.db.models.Track.create(fieldsToSet, function(err, track) {
        if (err) return res.json(err);

        var fs = require('fs');
        var path = require('path');
        var ext = path.extname(req.files.file.path);

        fs.readFile(req.files.file.path, function (err, data) {
            var newPath = path.join(__dirname, '../../', 'trackbase', track._id + ext);

            fs.writeFile(newPath, data, function (err) {
                req.app.db.models.Program.update({_id: programId}, {image: track._id}, { upsert: false, multi: true }, function(err, numAffected) {
                    res.json(track);
                });
            });
        });
    });
};

exports.addRecord = function(req, res) {

    var user = req.session.passport ? req.session.passport.user : '';
    var programId = req.body.programId;
    if (!programId) res.json({error: 'program Id not found'});

    var fieldsToSet = {
        user: user,
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
                req.app.db.models.Program.update({_id: programId}, {audio: track._id}, { upsert: false, multi: true }, function(err, numAffected) {
                    res.json(track);
                });
            }
        });
    });
};

exports.addMusic = function(req, res) {
    // var user = req.session.passport ? req.session.passport.user : '';
    var programId = req.body.programId;
    var musicId = req.body.musicId;
    if (!programId || !musicId) return res.json({error: 'program Id not found'});


    console.log(programId);
    console.log(musicId);

    req.app.db.models.Program.update({_id: programId}, {music: musicId}, { upsert: false, multi: true }, function(err, numAffected) {
        console.log(ok);
        res.json({status: 'ok'});
    });
};
