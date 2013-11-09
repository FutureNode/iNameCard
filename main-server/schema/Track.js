'use strict';

exports = module.exports = function(app, mongoose) {

  var trackSchema = new mongoose.Schema({
    user: { type: String },
    duration: { type: Number },
    type: { type: String },
    date: { type: Date, default: Date.now }
  });

  trackSchema.index({ user: 1 });
  trackSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Track', trackSchema);
};
