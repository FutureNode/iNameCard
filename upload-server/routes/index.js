
/*
 * GET home page.
 */
var file = require('file');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.addRecord = function(req, res) {
    res.json(req.files);
    // console.log(req.session);
};
