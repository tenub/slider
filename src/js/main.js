require.config({
	baseUrl: 'assets/js/',
	paths: {
		jquery: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
		knockout: 'http://cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-min',
		text: 'http://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text'
	}
});

require(['jquery', 'plugin.min'], function($, plugin) {
	$('#slider').slider({
		pagination: 'on',
		autoplay: 'on',
		movetime: 500
	});
});