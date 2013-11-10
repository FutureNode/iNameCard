exports.create = function(req, res, next) {
    // var user = req.session.passport ? req.session.passport.user : '';
    var programId = req.body.programId;
    var musicId = req.body.musicId;
    if (!programId || !musicId) return res.json({error: 'program Id not found'});

    req.app.db.models.Program.update({_id: programId}, {music: musicId}, { upsert: false, multi: true }, function(err, numAffected) {
        res.json({status: 'ok'});
    });
};
