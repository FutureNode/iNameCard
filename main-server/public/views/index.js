function appendItem(program) {

	if (!program.image)
		return;

	var $item = $('<div>').addClass('col-md-3');
	var $thumbnail = $('<div>').addClass('thumbnail');
	var $img = $('<img>')
		.addClass('img-rounded')
		.attr('src', '/track/' + program.image);
	var $caption = $('<div>').addClass('caption');

	$thumbnail.append($img);
	$item.append($thumbnail);

	$('#album').append($item);

}

$.get('/program', function(data) {
	console.log(programs);

	var programs = data.programs;

	for (var index in programs) {
		appendItem(programs[index]);
	}
});
