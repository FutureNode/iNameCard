function appendItem(program) {

	if (!program.image && !program.video)
		return;

	var $item = $('<div>').addClass('col-md-3');
	var $thumbnail = $('<div>').addClass('thumbnail');
	var $link = $('<a>').attr('href', '/play/' + program._id);
	var $img = $('<img>')
		.addClass('img-rounded col-md-12');

	if (program.video)
		$img.attr('src', '/img/video-icon.png');
	else
		$img.attr('src', '/track/' + program.image);

	var $caption = $('<div>').addClass('caption');

	$link.append($img);
	$thumbnail.append($link);
	$item.append($thumbnail);

	$('#album').append($item);

}

$.get('/program', function(data) {
	var programs = data.programs;

	for (var index in programs) {
		appendItem(programs[index]);
	}
});
