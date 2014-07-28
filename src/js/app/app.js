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

			var self = this,
				slides = {};

			// wrap slides in a viewport and container
			$(self.element)
				.wrapInner('<div class="slider_container"/>')
				.wrapInner('<div class="slider_viewport"/>');

			// cache viewport
			self.viewport = $(self.element).find('.slider_viewport');
			// cache container
			self.container = $(self.element).find('.slider_container');
			// cache slides as direct descendants of container
			self._slides = self.container.children();
			// cache number of slides
			self.size = self._slides.length;

			// set initial slide
			self.n = self._setStart(self.options.start);
			// set initial html
			self._initHtml();
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
		 * Define container content elements and set initial slide content
		 * @private
		 */
		_initHtml: function() {

			var self = this;

			self.container
				.html('')
				.append(
					$('<div class="prev"/>'),
					$('<div class="curr"/>'),
					$('<div class="next"/>')
				);

			self.slides = self.container.children();

			self._setSlideHtml(self.n);

			return self;

		},

		/**
		 * Move slider to a specified slide index
		 * @private
		 * @param {integer} n - Ending zero-based slide index
		 */
		_moveTo: function(n) {

			var self = this;

			if (self.n !== n)
				self._transition(self.n, n);

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

			self._setSlideCss(n);
			self._setContainerSize(n);

			return self;

		},

		/**
		 * Set container height to specified slide height
		 * @private
		 * @param {integer} n - Current zero-based slide index
		 */
		_setContainerSize: function(n) {

			var self = this,
				sWidth = 0;

			self.slides.each(function(i) {
				sWidth += $(this).width();
			});

			self.viewport
				.height(self.container.find('.curr').height())

			self.container
				.width(sWidth);

			return self;

		},

		/**
		 * Set all slide widths to container width
		 * @private
		 */
		_setSlideCss: function(n) {

			var self = this;

			self.slides.each(function(i) {

				$(this).css({
					width: $(self.element).width() + 'px'
					/* left: '+=' + position + 'px' */
				});

			});

			return self;

		},

		/**
		 * Set container html based on new slide index
		 * @private
		 * @param {integer} n - New slide index
		 */
		_setSlideHtml: function(n) {

			var self = this
				_prev = (n === 0) ? self._slides.eq(self.size - 1).html() : self._slides.eq(n - 1).html(),
				_curr = self._slides.eq(n).html(),
				_next = (n === self.size - 1) ? self._slides.eq(0).html() : self._slides.eq(n + 1).html();

			self.container.find('.prev')
				.html(_prev)
				.next().html(_curr)
				.next().html(_next);

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
		 * Transition slide elements and set new content
		 * @private
		 * @param {integer} n - Resulting zero-based slide index 
		 */
		_transition: function(cur, nxt) {

			var self = this,
				diff,
				dir,
				$prev = self.container.find('.prev'),
				$curr = self.container.find('.curr'),
				$next = self.container.find('.next');

			// calculate the shortest path to travel and determine which direction
			diff = nxt - cur;
			dir = (diff < 0) ? -1 : 1;

			$curr.css({
				left: $curr.css('left') - dir * Math.abs(diff)
			})

			self._setSlideHtml(nxt);

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