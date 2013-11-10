
/**
 * Module dependencies.
 */

var config = require('../config');
var express = require('express');
var mongoStore = require('connect-mongo')(express);
var routes = require('./routes');
// var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

// Session
app.sessionStore = new mongoStore({ url: config.mongodb.uri });

//setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  //and... we have a data store
});

//config data models
require('../main-server/models')(app, mongoose);

// all environments
app.set('port', process.env.PORT || 8100);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));

// app.use(express.json());
// app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.multipart());
app.use(express.cookieParser());
app.use(express.session({
	secret: config.cryptoKey,
	store: app.sessionStore
}));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/test', routes.test);
app.post('/image', routes.addImage);
app.post('/record', routes.addRecord);
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
