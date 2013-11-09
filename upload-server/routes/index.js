
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.addRecord = function(req, res) {
    console.log(req.session);
};
