
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'Express' });
};

exports.test = function(req, res) {

    // req.app.db.models.Track.find({}, function(tracks) {
    //     res.json({tracks: tracks});
    // });

    var fieldsToSet = {
        user: req.session.passport.user,
        type: 'audio'
    }

    req.app.db.models.Track.create(fieldsToSet, function(err, track) {
        if (err) return res.json(err);
        res.json({status: 'ok', data: track});
    });
};

exports.addRecord = function(req, res) {

    var fs = require('fs');
    var path = require('path');
    var filename = 'test.wav'

    // console.log(path.join(__dirname, '..', 'trackbase', filename));
    var exec = require('child_process').exec,
    child;
    var srcAudio = req.files.file.path;
    var targetAudio = path.join(__dirname, '../../', 'trackbase', 'test.mp3');

    child = exec('lame ' + srcAudio + ' ' + targetAudio, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });


    // fs.rename(req.files.file.path, path.join(__dirname, '../../', 'trackbase', filename), function(err) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log('ok');
    //         // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
    //         // fs.unlink(tmp_path, function() {
    //         //     if (err) throw err;
    //         //     res.send('File uploaded');
    //         // });
    //     }
    // });

  //   mv(req.files.file.path, '../trackbase', function(err) {
  //       if (err) console.log(err);
  // // done. it tried fs.rename first, and then falls back to
  // // piping the source file to the dest file and then unlinking
  // // the source file.
  //   });

    console.log(req.body);
    console.log(req.files.file.path);
    console.log(req.session);
    res.json({status: 'ok'});
};
