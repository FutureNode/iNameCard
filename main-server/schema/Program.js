'use strict';

exports = module.exports = function(app, mongoose) {

  var programSchema = new mongoose.Schema({
    user: { type: String },
	audio: [],
    image: [],
    music: [],
    video: [],
    date: { type: Date, default: Date.now }
  });

  programSchema.index({ user: 1 });
  programSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Program', programSchema);
};
