/**
 * @file		slider
 * @author		Joseph Chrzan jchrzan1@gmail.com
 * @version		0.0.1
 * @copyright	Joseph Chrzan 2014
 */

define(['jquery'], function($) {

	var pluginName = 'slider',
		defaults = {
			pagination: 'on',
			autoplay: 'on',
			movetime: 500,
			stoptime: 2000
		};

	function Plugin(element, options) {
		this.container = element;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	Plugin.prototype = {

		init: function() {

			var self = this;

			self.n = 0;
			self._setSlidesSize();
			self._setContainerSize(self.n);
			self._showSlide(self.n);
			self._bindHandlers();

		},

		next: function() {

			var self = this;

			if (self.n === $(self.container).children().length - 1)
				self._moveTo(0);
			else
				self._moveTo(self.n + 1)

			return self;

		},

		prev: function() {

			var self = this;

			if (self.n === 0)
				self._moveTo($(self.container).children().length - 1);
			else
				self._moveTo(self.n - 1)

			return self;

		},

		_bindHandlers: function() {

			var self = this;

			$(window).resize(function() {
				self._redrawSlider(self.n)
			});

			$(self.container).children().click(function() {

				self.next();

			});

			return self;

		},

		_moveTo: function(n) {

			var self = this;

			self.n = n;
			self._setContainerSize(self.n);
			self._showSlide(self.n);

			return self;

		},

		_redrawSlider: function(n) {

			var self = this;

			self._setSlidesSize();
			self._setContainerSize(n);

			return self;

		},

		_setContainerSize: function(n) {

			var self = this;

			$(self.container)
				.height($(self.container)
					.children()
					.eq(n)
					.height()
				);

			return self;

		},

		_setSlidesSize: function() {

			var self = this,
				$slides = $(self.container).children();

			$.each($slides, function(i) {

				$(this).width($(self.container).width());

			});

			return self;

		},

		_showSlide: function(n) {

			var self = this;

			$(self.container)
				.children()
				.eq(n)
				.show()
				.siblings()
				.hide();

			return self;

		}

	};

	$.fn.slider = function(options) {
		return this.each(function() {
			if (!$.data(this, 'plugin_' + pluginName))
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
		});
	};

});