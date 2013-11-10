
// Define Track
var Track = function(id, type) {
	var self = this;

	self.id = id;
	self.type = type;
	self.ready = false;

	switch(type) {
	case 'video':
	case 'music':
	case 'audio':
		if (type == 'video')  {
			self.$control = $('<video>').attr({
				'controls': true
			});
		} else {
			self.$control = $('<audio>').attr({
			//	'controls': true
			});
		}
		self.$source = $('<source>');

		self.$control.append(self.$source);

		// Initializing volume
		if (type == 'music')
			self.$control[0].volume = 0.85;
		else if (type == 'audio')
			self.$control[0].volume = 0.7;
		else if (type == 'video')
			self.$control[0].volume = 0.5;

		break;

	case 'image':
		self.$control = self.$source = $('<img>').hide();
		self.$control.on('load', function() {
			self.ready = true;
		});
		break;
	}
};

Track.prototype.load = function() {
	var self = this;

	self.$source.attr('src', '/track/' + self.id);
};

Track.prototype.play = function() {
	var self = this;

	switch(self.type) {
	case 'music':
	case 'audio':
	case 'video':
		self.$control[0].play();
		break;

	case 'image':
		self.$control.fadeIn(2000);
		break;
	}
};

Track.prototype.pause = function() {
	var self = this;

	switch(self.type) {
	case 'music':
	case 'audio':
	case 'video':
		self.$control[0].pause();
	}
};

Track.prototype.on = function(e, callback) {
	var self = this;

	self.$control.on(e, callback);
};

Track.prototype.isReady = function() {
	var self = this;

	switch(self.type) {
	case 'music':
	case 'audio':
	case 'video':
		if (self.$control[0].readyState == 4)
			self.ready = true;
	};

	return self.ready;
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

		if (self.tracks[index].isReady())
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

	if (program.video) {
		var track = trackManager.addTrack(program.video, 'video');

		$('#track_wareroom').append(track.$control);

	} else if (program.image) {
		var track = trackManager.addTrack(program.image, 'image');

		$('#track_wareroom').append(track.$control);
	}

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
