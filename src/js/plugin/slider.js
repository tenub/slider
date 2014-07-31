/*jslint nomen: true */

/**
 * @file		slider
 * @author		Joseph Chrzan jchrzan1@gmail.com
 * @version		0.0.1
 * @copyright	Joseph Chrzan 2014
 */

define(['jquery'], function($) {

	var pluginName = 'slider',

	/**
	 * @namespace
	 * @property {mixed} start - integer or string representation of initial slide index
	 * @property {string} pagination - 'on' / 'off' - enable or disable pagination module
	 * @property {string} autoplay - 'on' / 'off' - enable or disable slider autoplay
	 * @property {integer} movetime - time in milliseconds for any transition
	 * @property {integer} stoptime - time in milliseconds to pause on each slide if autoplay is enabled
	 */
	defaults = {
		pagination: 'off',
		navigation: 'on',
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

			// call autoplay if option is enabled
			if (self.options.autoplay === 'on') {
				self.autoplay();
			}

			// call navigation if option is enabled
			if (self.options.navigation === 'on') {
				self._navigation();
			}

			// call pagination if option is enabled
			if (self.options.pagination === 'on') {
				self._pagination();
			}

			// bind all custom events
			self._bindEvents();
			// bind all event handlers
			self._bindHandlers();

			// all initialization has occurred so trigger the "loaded" event
			$(self.element).trigger('loaded.slider');

		},

		/**
		 * Public method to move slider to previous index
		 * Wrapper for special case of private method {@link _moveTo}
		 */
		next: function() {

			var self = this,
				n = 0;

			if (self.n !== self.size - 1) {
				n = self.n + 1;
			}

			self._moveTo(n, 'next');

			return self;

		},

		/**
		 * Public method to move slider to next index
		 * Wrapper for special case of private method {@link _moveTo}
		 */
		prev: function() {

			var self = this,
				n = self.size - 1;

			if (self.n !== 0) {
				n = self.n - 1;
			}

			self._moveTo(n, 'prev');

			return self;

		},

		/**
		 * Public method to start autoplay once slider is initialized
		 */
		autoplay: function() {

			var self = this, n;

			self.ival = window.setInterval(function() {

				n = 0;
				
				if (self.n !== self.size - 1) {
					n = self.n + 1;
				}

				self._moveTo(n, 'auto');

			}, self.options.stoptime);

			return self;

		},

		/**
		 * Public method to move slider to specified index
		 * Wrapper for private method {@link _moveTo}
		 * @param {integer} n - Ending zero-based slide index
		 */
		goTo: function(n) {

			var self = this,
				dir = ((n - self.n) < 0) ? 'prev' : 'next';

			self._moveTo(n, dir);

			return self;

		},

		/**
		 * Internal property used to indicate if the slider is currently in a transition
		 * @private
		 */
		_isAnimated: false,

		/**
		 * Bind custom slider events for extensibility
		 * @private
		 */
		_bindEvents: function() {

			var self = this;

			$(self.element).on('loaded.slider', function() {

				$(self.element).css('visibility', 'visible');

			});

			return self;

		},

		/**
		 * Bind slider event handlers
		 * @private
		 */
		_bindHandlers: function() {

			var self = this;

			$(window).resize(function() {
				self._redrawSlider();
			});

			$(document).keydown(function(e) {

				switch(e.which) {

					case 37: self.prev();
					break;

					case 38: self.next();
					break;

					case 39: self.next();
					break;

					case 40: self.prev();
					break;

					default: return;

				}

				e.preventDefault();

			});

			return self;

		},

		/**
		 * Define container content elements and set initial slide content
		 * @private
		 */
		_initHtml: function() {

			var self = this,
				$prev = $('<div class="prev"/>'),
				$curr = $('<div class="curr"/>'),
				$next = $('<div class="next"/>');

			if (self.options.movetime > 0) {
				$prev.css('transition', 'left ' + (self.options.movetime / 1000) + 's');
				$curr.css('transition', 'left ' + (self.options.movetime / 1000) + 's');
				$next.css('transition', 'left ' + (self.options.movetime / 1000) + 's');
			}

			self.container
				.html('')
				.append(
					$prev,
					$curr,
					$next
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
		_moveTo: function(n, dir) {

			var self = this;

			if (self.n !== n) {
				self._transition(n, dir);
			}

			return self;

		},

		/**
		 * Generate navigation and bind related events
		 * @private
		 */
		_navigation: function() {

			var self = this,
				$icons;

			$(self.element).append(
				$('<div/>')
					.addClass('navigation')
					.append(
						$('<i/>')
							.addClass('fa fa-chevron-left')
							.data('sl-dir', 'prev'),
						$('<i/>')
							.addClass('fa fa-chevron-right')
							.data('sl-dir', 'next')
					)
			);

			$(self.element).find('.navigation').on('click', 'i', function() {

				var dir = $(this).data('sl-dir');

				if (dir === 'prev') {
					self.prev();
				} else {
					self.next();
				}

			});

			return self;

		},

		/**
		 * Generate pagination and bind related events
		 * @private
		 */
		_pagination: function() {

			var self = this,
				$icons;

			$(self.element).append(
				$('<div/>')
					.addClass('pagination')
			);

			for (var i=0; i<self.size; i++) {

				$(self.element).find('.pagination')
					.append(
						$('<i/>')
							.addClass('fa fa-circle')
					)

			}

			$(self.element).find('.pagination').on('click', 'i', function() {

				self.goTo($(this).index());

			});

			return self;

		},

		/**
		 * Parse slide number and set it to the slider's opposite limit if it goes out of bounds
		 * Used to set the next slide index
		 * @private
		 * @param {string} n - Slide integer in string format
		 */
		_parseN: function(n) {

			var self = this;

			n = parseInt(n, 10) || 0;

			if (n > self.size) {
				return self.size - 1;
			}

			if (n < 0) {
				return 0;
			}

			return n;

		},

		/**
		 * Resize all slide widths and container height for specified index
		 * @private
		 */
		_redrawSlider: function() {

			var self = this;

			self._setSlideCss();
			self._setContainerSize();

			return self;

		},

		/**
		 * Since JavaScript does not modify a timeout/interval id once it is cleared there is no way to tell if it was ever cleared
		 * This simple function fixes the above issue
		 * @private
		 * @param {integer} id - Id of timeout/interval that needs to be cleared and reset
		 */
		_resetInterval: function(id) {

			var self = this;

			window.clearInterval(id);
			self.ival = false;

			return self;

		},

		/**
		 * Set container height to specified slide height
		 * @private
		 * @param {integer} n - Current zero-based slide index
		 */
		_setContainerSize: function() {

			var self = this,
				sWidth = 0;

			self.slides.each(function() {
				sWidth += $(this).width();
			});

			self.viewport
				.height(self.container.find('.curr').height());

			if (self.options.movetime > 0) {
				self.viewport
					.css('transition', 'height ' + (self.options.movetime / 1000) + 's');
			}

			self.container
				.width(sWidth);

			return self;

		},

		/**
		 * Set all slide widths to container width
		 * @private
		 */
		_setSlideCss: function() {

			var self = this;

			self.slides.each(function() {

				$(this).css({
					width: $(self.element).width() + 'px'
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

			var self = this,
				_prev = (n === 0) ? self._slides.eq(self.size - 1).html() : self._slides.eq(n - 1).html(),
				_curr = self._slides.eq(n).html(),
				_next = (n === self.size - 1) ? self._slides.eq(0).html() : self._slides.eq(n + 1).html();

			self.container.find('.prev')
				.html(_prev);
			self.container.find('.curr')
				.html(_curr);
			self.container.find('.next')
				.html(_next);

			self.n = n;

			self._redrawSlider();

			return self;

		},

		/**
		 * Parse start setting in almost any form
		 * @private
		 * @param {mixed} n - Slide index
		 */
		_setStart: function(n) {

			var self = this;

			if (typeof n === 'string' || typeof n === 'number') {

				n = n.toString();

				if (n.length <= 2) {
					return self._parseN(n);
				}

				if (n === 'last' || n === 'end') {
					return self.size - 1;
				}

			}

			return 0;

		},

		/**
		 * Transition slide elements and set new content
		 * @private
		 * @param {integer} n - Resulting zero-based slide index 
		 */
		_transition: function(next, move) {

			var self = this,
				$prev = self.container.find('.prev'),
				$curr = self.container.find('.curr'),
				$next = self.container.find('.next');

			if (self._isAnimated) {
				return;
			}

			self._isAnimated = true;

			if (move === 'auto' || move === 'next') {
				self._transitionNext($prev, $curr, $next);
			} else if (move === 'prev') {
				self._transitionPrev($prev, $curr, $next);
			}

			if (self.ival !== undefined && (move === 'prev' || move === 'next')) {
				self._resetInterval(self.ival);
			}

			self._setSlideHtml(next);

			if (self.options.movetime > 0) {

				$curr.off().one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {

					self._transitionEnd($prev, $next);

				});

			} else {

				self._transitionEnd($prev, $next);

			}

			return self;

		},

		/**
		 * Called at the end of a slide transition
		 * Triggers the end.trans.slider custom event
		 * @private
		 * @param {object} $prev - jquery object of previous slide
		 * @param {object} $next - jquery object of next slide
		 */
		_transitionEnd: function($prev, $next) {

			var self = this;

			self._isAnimated = false;

			$prev.show();
			$next.show();

			if (self.ival !== undefined && self.ival === false) {
				self.autoplay();
			}

			$(self.element).trigger('end.trans.slider');

			return self;

		},

		/**
		 * Transition slider to next slide and set necessary element states
		 * Triggers the next.slider custom event
		 * @private
		 * @param {object} $prev - jquery object of previous slide
		 * @param {object} $curr - jquery object of current slide
		 * @param {object} $next - jquery object of next slide
		 */
		_transitionNext: function($prev, $curr, $next) {

			var self = this;

			$(self.element).trigger('next.slider');
			$prev.removeClass('prev').hide().addClass('next');
			$curr.removeClass('curr').addClass('prev');
			$next.removeClass('next').addClass('curr');

			return self;

		},

		/**
		 * Transition slider to previous slide and set necessary element states
		 * Triggers the prev.slider custom event
		 * @private
		 * @param {object} $prev - jquery object of previous slide
		 * @param {object} $curr - jquery object of current slide
		 * @param {object} $next - jquery object of next slide
		 */
		_transitionPrev: function($prev, $curr, $next) {

			var self = this;

			$(self.element).trigger('prev.slider');
			$prev.removeClass('prev').addClass('curr');
			$curr.removeClass('curr').addClass('next');
			$next.removeClass('next').hide().addClass('prev');

			return self;

		}

	};

	$.fn.slider = function(options) {

		return this.each(function() {

			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Slider(this, options));
			}

		});

	};

});