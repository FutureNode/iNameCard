
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


    console.log(req.session);

    // var fieldsToSet = {
    //     username: req.body.username,
    //     email: req.body.email,
    //     password: req.app.db.models.User.encryptPassword(req.body.password),
    //     search: [
    //         req.body.username,
    //         req.body.email
    //     ]
    // };
    // req.app.db.models.User.create(fieldsToSet, function(err, user) {
    //     if (err) return workflow.emit('exception', err);

    //     workflow.user = user;
    //     workflow.emit('createAccount');
    // });
    res.json({status: 'ok'});
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
