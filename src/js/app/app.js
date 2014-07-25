/**
 * @file		slider
 * @author		Joseph Chrzan jchrzan1@gmail.com
 * @version		0.0.1
 * @copyright	Joseph Chrzan 2014
 */

define(['jquery'], function($) {

	var pluginName = 'slider';

	/**
	 * @namespace
	 * @property {mixed} start - integer or string representation of initial slide index
	 * @property {string} pagination - 'on' / 'off' - enable or disable pagination module
	 * @property {string} autoplay - 'on' / 'off' - enable or disable slider autoplay
	 * @property {integer} movetime - time in milliseconds for any transition
	 * @property {integer} stoptime - time in milliseconds to pause on each slide if autoplay is enabled
	 */
	var defaults = {
		pagination: 'on',
		autoplay: 'on',
		movetime: 500,
		stoptime: 2000
	};

	/**
	 * Creates a new Slider
	 * @class
	 */
	function Slider(element, options) {

		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();

	}

	Slider.prototype = {

		init: function() {

			var self = this;

			// wrap slides in a viewport and container
			$(self.element)
				.wrap('<div class="sViewport"/>')
				.wrap('<div class="sContainer"/>');

			// cache slides as direct descendants of container
			self.slides = $(self.element).children();
			// cache number of slides
			self.size = self.slides.length;
			// cache container
			self.container = $(self.element).parent();

			// set initial slide
			self.n = self._setStart(self.options.start);
			// show initial slide
			self.goTo(self.n);
			// bind all event handlers
			self._bindHandlers();

		},

		/**
		 * Public method to move slider to previous index
		 * Wrapper for special case of private method {@link _moveTo}
		 */
		next: function() {

			var self = this;

			if (self.n === self.size - 1)
				self._moveTo(0);
			else
				self._moveTo(self.n + 1)

			return self;

		},

		/**
		 * Public method to move slider to next index
		 * Wrapper for special case of private method {@link _moveTo}
		 */
		prev: function() {

			var self = this;

			if (self.n === 0)
				self._moveTo(self.size - 1);
			else
				self._moveTo(self.n - 1)

			return self;

		},

		/**
		 * Public method to move slider to specified index
		 * Wrapper for private method {@link _moveTo}
		 * @param {integer} n - Ending zero-based slide index
		 */
		goTo: function(n) {

			var self = this;

			self._moveTo(n);

			return self;

		},

		/**
		 * Bind slider event handlers
		 * @private
		 */
		_bindHandlers: function() {

			var self = this;

			$(window).resize(function() {
				self._redrawSlider(self.n)
			});

			self.slides.click(function() {

				self.next();

			});

			return self;

		},

		/**
		 * Move slider to a specified slide index
		 * @private
		 * @param {integer} n - Ending zero-based slide index
		 */
		_moveTo: function(n) {

			var self = this;

			self.n = n;
			self._redrawSlider(self.n);

			return self;

		},

		/**
		 * Resize all slide widths and container height for specified index
		 * @private
		 * @param {integer} n - Current zero-based slide index
		 */
		_redrawSlider: function(n) {

			var self = this;

			self._setSlidePos(n);
			self._setContainerSize(n);

			return self;

		},

		/**
		 * Set container height to specified slide height
		 * @private
		 * @param {integer} n - Current zero-based slide index
		 */
		_setContainerSize: function(n) {

			var self = this;

			console.log(self.container);

			self.container
				.height(self.slides
					.eq(n)
					.height()
				);

			return self;

		},

		/**
		 * Set all slide widths to container width
		 * @private
		 */
		_setSlidePos: function(n) {

			var self = this;

			self.slides.each(function(i) {

				$(this).css({
					width: self.container.width() + 'px'
					/* left: '+=' + position + 'px' */
				});

			});

			return self;

		},

		/**
		 * Parse start setting in almost any form
		 * @private
		 * @param {mixed} n - Slide index
		 */
		_setStart: function(start) {

			var self = this;

			if (typeof n === 'string' || typeof n === 'number') {
				n = n.toString();
				if (n.length <= 2)
					return ParseN(n);
				else if (n === 'last' || n === 'end')
					return self.size - 1;
				else
					return 0;
			} else {
				return 0;
			}

			function ParseN(n) {

				n = parseInt(n) || 0;

				if (n > self.size)
					return self.size - 1;
				else if (n < 0)
					return 0;
				else
					return n;

			}

		},

		/**
		 * Show slide at specified index and hide its siblings
		 * @private
		 * @param {integer} n - Resulting zero-based slide index
		 */
		_showSlide: function(n) {

			var self = this;

			//

			return self;

		}

	};

	$.fn.slider = function(options) {

		return this.each(function() {

			if (!$.data(this, 'plugin_' + pluginName))
				$.data(this, 'plugin_' + pluginName, new Slider(this, options));

		});

	};

});