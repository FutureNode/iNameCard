
// Define Track
var Track = function(id, type) {
	var self = this;

	self.id = id;
	self.type = type;

	switch(type) {
	case 'music':
	case 'audio':
		self.$control = $('<audio>').attr({
			'controls': true
		});
		self.$source = $('<source>');

		self.$control.append(self.$source);

		if (type == 'music')
			self.$control[0].volume = 0.5;

		break;

	case 'image':
		self.$control = self.$source = $('<img>');
		break;
	}
};

Track.prototype.load = function() {
	var self = this;

	self.$source.attr('src', '/track/' + self.id);
};

Track.prototype.play = function() {
	var self = this;

	self.$control[0].play();
};

Track.prototype.pause = function() {
	var self = this;

	self.$control[0].pause();
};

Track.prototype.on = function(e, callback) {
	var self = this;

	self.$control.on(e, callback);
};

// Track Manager
var TrackManager = function() {
	var self = this;

	self.tracks = [];
};

TrackManager.prototype.addTrack = function(id, type) {
	var self = this;

	var track = new Track(id, type);
	track.load();

	self.tracks.push(track);

	return track;
};

TrackManager.prototype.play = function() {
	var self = this;

	var checkpoint = self.tracks.length;
	for (var index in self.tracks) {

		if (self.tracks[index].$control[0].readyState == 4)
			checkpoint--;
	}

	if (checkpoint == 0) {
		for (var index in self.tracks) {
			self.tracks[index].play();
		}
	} else {

		setTimeout(self.play.bind(self), 100);
	}
};

// Main
var programID = $('#programID').val();

var trackManager = new TrackManager();

$.get('/program/' + programID, function(data) {
	var program = data.program;

	if (program.music) {
		var track = trackManager.addTrack(program.music, 'music');

		$('#track_wareroom').append(track.$control);
	}

	if (program.audio) {
		var track = trackManager.addTrack(program.audio, 'audio');

		$('#track_wareroom').append(track.$control);
	}

	trackManager.play();
});
