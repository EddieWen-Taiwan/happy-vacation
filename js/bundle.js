/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _moment = __webpack_require__(2);

	var _moment2 = _interopRequireDefault(_moment);

	var _pikaday = __webpack_require__(3);

	var _pikaday2 = _interopRequireDefault(_pikaday);

	var _fullcalendar = __webpack_require__(4);

	var _fullcalendar2 = _interopRequireDefault(_fullcalendar);

	var _Days = __webpack_require__(5);

	var Days = _interopRequireWildcard(_Days);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var eventArray;
	var hourArray;
	var targetEvent;
	var back2workStatus = 'all-day';

	(0, _jquery2.default)(document).ready(function () {

		// Initialize FullCalendar
		var $calendar = (0, _jquery2.default)('#calendar');
		$calendar.fullCalendar({
			allDayDefault: true,
			eventClick: function eventClick(thisEvent, jsEvent, view) {
				targetEvent = thisEvent;
			},
			eventAfterAllRender: function eventAfterAllRender(event) {
				_jquery2.default.each((0, _jquery2.default)('.tenDays'), function (index, element) {
					(0, _jquery2.default)(element).children('.fc-content').append('<div class="arrow minus" data-move="minus"></div><div class="arrow plus" data-move="plus"></div><div class="event-background"></div>');
				});
				// Workday on the weekend
				(0, _jquery2.default)('.fc-day-number.fc-sat').each(function (index, element) {
					// Check whethe it's on the list
					if (Days.weekend_workday.indexOf((0, _jquery2.default)(element).attr('data-date')) > -1 && !(0, _jquery2.default)(element).hasClass('markWork')) {
						// Mark it with .markWrok
						(0, _jquery2.default)(element).html('<span class="weekendWork">補班</span> ' + parseInt((0, _jquery2.default)(element).attr('data-date').substr(-2))).addClass('markWork');
					}
				});
			}
		});

		// Initialize Pikaday
		var picker = new _pikaday2.default({
			field: (0, _jquery2.default)('#datepicker')[0],
			format: 'YYYY-MM-DD'
		});

		(0, _jquery2.default)('.options').on('click', function (e) {
			(0, _jquery2.default)('.options').removeClass('valuable');
			(0, _jquery2.default)('.wave').removeClass('show');
			(0, _jquery2.default)(e.currentTarget).addClass('valuable');
			(0, _jquery2.default)(e.currentTarget).find('.wave').addClass('show');

			(0, _jquery2.default)('.day-value').text((0, _jquery2.default)(e.currentTarget).attr('data-day') == 'all-day' ? '整天' : '半天');
			back2workStatus = (0, _jquery2.default)(e.currentTarget).attr('data-day');
		});

		(0, _jquery2.default)('.ok').on('click', function () {

			if ((0, _jquery2.default)('#datepicker').val() == '') {
				alert('跟我說哪天退伍麻~');
			} else {

				// Get this from user
				var finalDay = (0, _moment2.default)((0, _jquery2.default)('#datepicker').val());
				eventArray = [{
					title: '退伍日',
					start: finalDay,
					className: 'retireDate'
				}];

				var lastEvent = finalDay;
				hourArray = [];
				for (var i = 0; i < 9; i++) {

					lastEvent = (0, _moment2.default)(lastEvent).add(-10, 'days');
					lastEvent.makeOnWorkDay();

					var newEvent = {
						title: '*該上勤了吧',
						start: lastEvent,
						className: 'tenDays event-' + i
					};
					eventArray.push(newEvent);
				};
				$calendar.fullCalendar('removeEvents');
				$calendar.fullCalendar('addEventSource', eventArray);
				$calendar.fullCalendar('addEventSource', Days.national_holiday);
				setHourArray();

				$calendar.fullCalendar('gotoDate', finalDay);

				(0, _jquery2.default)('.overlay').fadeOut(300);
			}
		});

		// Arrows in Calendar
		$calendar.on('click', '.arrow', function (e) {
			e.stopPropagation();
			var eventOrdering = parseInt(targetEvent.className[1].substring(6, 7)) + 1;

			var move = (0, _jquery2.default)(e.currentTarget).attr('data-move');

			// Check minus or plus too much
			var actionPermission = 'OK';
			var preDate = eventArray[eventOrdering].start;
			if (move == 'minus') {
				// Prevent more then ten days
				// Should not be before this date
				var limitDate = (0, _moment2.default)(eventArray[eventOrdering - 1].start).add(-10, 'days');

				if (preDate.day() == 1) {
					if (meetWeekendWorkDay((0, _moment2.default)(preDate).add(-2, 'days')) == true) {
						preDate = (0, _moment2.default)(preDate).add(-2, 'days');
					} else {
						preDate = (0, _moment2.default)(preDate).add(-3, 'days');
					}
				} else {
					preDate = (0, _moment2.default)(preDate).add(-1, 'days');
				}
				var checkingHoliday = true;
				while (checkingHoliday) {
					checkingHoliday = false;
					for (var i = 0; i < Days.national_holiday.length; i++) {
						if (preDate.isSame(Days.national_holiday[i].start)) {
							preDate = (0, _moment2.default)(preDate).add(-1, 'days');
							checkingHoliday = true;
						}
					}
				}
				// Perhaps it's Sunday
				if (preDate.day() == 0) {
					preDate = (0, _moment2.default)(preDate).add(-2, 'days');
				}

				if (preDate.isBefore(limitDate)) {
					actionPermission = 'NOT ALLOWED';
					showDialog('left');
				}
			} else {
				// Prevent conflicts
				preDate = (0, _moment2.default)(preDate).add(1, 'days');
				preDate.makeOnWorkDay();
				if (preDate.isSame(eventArray[eventOrdering - 1].start)) {
					actionPermission = 'NOT ALLOWED';
					showDialog('right');
				}
			}

			if (actionPermission == 'OK') {
				for (var i = eventOrdering; i < 9 + 1; i++) {

					var updatedDate = eventArray[i].start;
					if (i == eventOrdering) {
						updatedDate = preDate;
					} else {
						// after that event
						updatedDate = (0, _moment2.default)(eventArray[i - 1].start).add(-10, 'days');
					}
					updatedDate.makeOnWorkDay();

					eventArray[i].start = updatedDate;
				}
				$calendar.fullCalendar('removeEvents');
				$calendar.fullCalendar('addEventSource', eventArray);
				$calendar.fullCalendar('addEventSource', Days.national_holiday);

				setHourArray();
			}
		}); // Arrows in Calendar -----

		// Get how many hours does user need
		(0, _jquery2.default)('#calendar').on('click', '.fc-event', function () {

			var neededHours = 0;

			// How many back-to-work events
			for (var i = 1; i < eventArray.length; i++) {
				if (targetEvent.start.isSameOrBefore(eventArray[i].start, 'day')) {
					if (back2workStatus == 'half-day') {
						neededHours += 4;
					}
					// Don't plus (all-day work)
				} else {
						break;
					}
			}

			for (var i = 0; i < hourArray.length; i++) {
				if (targetEvent.start.isSameOrBefore(hourArray[i].start, 'day')) {
					if (hourArray[i].title == '8hr') {
						neededHours += 8;
					}
				} else {
					break;
				}
			}

			(0, _jquery2.default)('.need-hours').text(neededHours);
			showDialog('hour');
		});

		// Trigger calendar to next/prev month
		(0, _jquery2.default)('.month-btn').on('click', function (event) {
			$calendar.fullCalendar((0, _jquery2.default)(event.currentTarget).hasClass('prev') ? 'prev' : 'next');
		});

		(0, _jquery2.default)('.setting-btn').on('click', function () {
			(0, _jquery2.default)('.overlay').fadeIn(500);
		});
	});

	var showDialog = function showDialog(action) {
		(0, _jquery2.default)('.alert').addClass('show ' + action);
		(0, _jquery2.default)('.dialog').addClass('bounceIn');

		(0, _jquery2.default)(document).on('keypress', function (e) {
			if ((0, _jquery2.default)('.alert').hasClass('show') && e.keyCode == 13) {
				(0, _jquery2.default)('.dialog .fine').trigger('click');
			}
		});

		(0, _jquery2.default)('.dialog .fine').on('click', function (e) {
			(0, _jquery2.default)(e.currentTarget).off('click');
			(0, _jquery2.default)(document).off('keypress');
			(0, _jquery2.default)('.alert').removeClass('show left right hour');
			(0, _jquery2.default)('.dialog').removeClass('bounceIn');
		});
	};

	var setHourArray = function setHourArray() {

		// Reset hourArray
		hourArray = [];
		for (var i = 0; i < eventArray.length - 1; i++) {
			var eventHead = eventArray[i].start;
			var eventTail = eventArray[i + 1].start;

			var _loop = function _loop(j) {
				var newStart = (0, _moment2.default)(eventHead).add(j * -1, 'days');
				var isThisHoliday = false;
				Days.national_holiday.map(function (holiday) {
					if (newStart.isSame(holiday.start)) {
						isThisHoliday = true;
					}
				});

				if (isThisHoliday == false) {
					var newEvent = {
						title: (newStart.day() == 0 || newStart.day() == 6) && !meetWeekendWorkDay(newStart) ? '＊＊＊＊＊' : '8hr',
						start: newStart,
						className: 'hourDay'
					};
					hourArray.push(newEvent);
				}
			};

			for (var j = 1; j < eventHead.diff(eventTail, 'days'); j++) {
				_loop(j);
			}
		}
		(0, _jquery2.default)('#calendar').fullCalendar('addEventSource', hourArray);
	};

	var meetWeekendWorkDay = function meetWeekendWorkDay(day) {
		return Days.weekend_workday.indexOf(day.format('YYYY-MM-DD')) > -1 ? true : false;
	};

	Object.assign(_moment2.default.prototype, {
		makeOnWorkDay: function makeOnWorkDay() {
			// Just plus day
			// 0 -> Sun. // 6 -> Sat.
			if (meetWeekendWorkDay(this) == false) {
				if (this.day() == 0) {
					this.add(1, 'days');
				} else if (this.day() == 6) {
					this.add(2, 'days');
				}
			}

			for (var k = 0; k < Days.national_holiday.length; k++) {
				if (this.isSame(Days.national_holiday[k].start)) {
					this.add(1, 'days');
					break;
				}
			}

			if (this.isThislegal() == false) {
				this.makeOnWorkDay();
			}
		},
		isThislegal: function isThislegal() {
			// Weekend
			if (meetWeekendWorkDay(this) == false) {
				if (this.day() == 0 || this.day() == 6) {
					return false;
				}
			}

			// National holidays
			for (var k = 0; k < Days.national_holiday.length; k++) {
				if (this.isSame(Days.national_holiday[k].start)) {
					return false;
				}
			}

			return true;
		}
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v2.2.1
	 * http://jquery.com/
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2016-02-22T19:11Z
	 */

	(function( global, factory ) {

		if ( typeof module === "object" && typeof module.exports === "object" ) {
			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		} else {
			factory( global );
		}

	// Pass this if window is not defined yet
	}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

	// Support: Firefox 18+
	// Can't be in strict mode, several libs including ASP.NET trace
	// the stack via arguments.caller.callee and Firefox dies if
	// you try to trace through "use strict" call chains. (#13335)
	//"use strict";
	var arr = [];

	var document = window.document;

	var slice = arr.slice;

	var concat = arr.concat;

	var push = arr.push;

	var indexOf = arr.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var support = {};



	var
		version = "2.2.1",

		// Define a local copy of jQuery
		jQuery = function( selector, context ) {

			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},

		// Support: Android<4.1
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,

		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};

	jQuery.fn = jQuery.prototype = {

		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// Start with an empty selector
		selector: "",

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function() {
			return slice.call( this );
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
			return num != null ?

				// Return just the one element from the set
				( num < 0 ? this[ num + this.length ] : this[ num ] ) :

				// Return all the elements in a clean array
				slice.call( this );
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		each: function( callback ) {
			return jQuery.each( this, callback );
		},

		map: function( callback ) {
			return this.pushStack( jQuery.map( this, function( elem, i ) {
				return callback.call( elem, i, elem );
			} ) );
		},

		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},

		first: function() {
			return this.eq( 0 );
		},

		last: function() {
			return this.eq( -1 );
		},

		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
		},

		end: function() {
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {

			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {

				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = jQuery.isArray( copy ) ) ) ) {

						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray( src ) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject( src ) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend( {

		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function( msg ) {
			throw new Error( msg );
		},

		noop: function() {},

		isFunction: function( obj ) {
			return jQuery.type( obj ) === "function";
		},

		isArray: Array.isArray,

		isWindow: function( obj ) {
			return obj != null && obj === obj.window;
		},

		isNumeric: function( obj ) {

			// parseFloat NaNs numeric-cast false positives (null|true|false|"")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			// adding 1 corrects loss of precision from parseFloat (#15100)
			var realStringObj = obj && obj.toString();
			return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
		},

		isPlainObject: function( obj ) {

			// Not plain objects:
			// - Any object or value whose internal [[Class]] property is not "[object Object]"
			// - DOM nodes
			// - window
			if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
				return false;
			}

			if ( obj.constructor &&
					!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}

			// If the function hasn't returned already, we're confident that
			// |obj| is a plain object, created by {} or constructed with new Object
			return true;
		},

		isEmptyObject: function( obj ) {
			var name;
			for ( name in obj ) {
				return false;
			}
			return true;
		},

		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}

			// Support: Android<4.0, iOS<6 (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call( obj ) ] || "object" :
				typeof obj;
		},

		// Evaluates a script in a global context
		globalEval: function( code ) {
			var script,
				indirect = eval;

			code = jQuery.trim( code );

			if ( code ) {

				// If the code includes a valid, prologue position
				// strict mode pragma, execute code by injecting a
				// script tag into the document.
				if ( code.indexOf( "use strict" ) === 1 ) {
					script = document.createElement( "script" );
					script.text = code;
					document.head.appendChild( script ).parentNode.removeChild( script );
				} else {

					// Otherwise, avoid the DOM node creation, insertion
					// and removal by using an indirect global eval

					indirect( code );
				}
			}
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE9-11+
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},

		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},

		each: function( obj, callback ) {
			var length, i = 0;

			if ( isArrayLike( obj ) ) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}

			return obj;
		},

		// Support: Android<4.1
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];

			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}

			return ret;
		},

		inArray: function( elem, arr, i ) {
			return arr == null ? -1 : indexOf.call( arr, elem, i );
		},

		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;

			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}

			first.length = i;

			return first;
		},

		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var length, value,
				i = 0,
				ret = [];

			// Go through the array, translating each of the items to their new values
			if ( isArrayLike( elems ) ) {
				length = elems.length;
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}

			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply( [], ret );
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var tmp, args, proxy;

			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}

			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: Date.now,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	} );

	// JSHint would error on this code due to the Symbol not being defined in ES5.
	// Defining this global in .jshintrc would create a danger of using the global
	// unguarded in another place, it seems safer to just disable JSHint for these
	// three lines.
	/* jshint ignore: start */
	if ( typeof Symbol === "function" ) {
		jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
	}
	/* jshint ignore: end */

	// Populate the class2type map
	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

	function isArrayLike( obj ) {

		// Support: iOS 8.2 (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type( obj );

		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.2.1
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2015-10-17
	 */
	(function( window ) {

	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,

		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,

		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},

		// General-purpose constants
		MAX_NEGATIVE = 1 << 31,

		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf as it's faster than native
		// http://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[i] === elem ) {
					return i;
				}
			}
			return -1;
		},

		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

		// Regular expressions

		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",

		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			"*\\]",

		pseudos = ":(" + identifier + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",

		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),

		matchExpr = {
			"ID": new RegExp( "^#(" + identifier + ")" ),
			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},

		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,

		rnative = /^[^{]+\{\s*\[native \w/,

		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

		rsibling = /[+~]/,
		rescape = /'|\\/g,

		// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},

		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		};

	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?

			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :

			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}

	function Sizzle( selector, context, results, seed ) {
		var m, i, elem, nid, nidselect, match, groups, newSelector,
			newContext = context && context.ownerDocument,

			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;

		results = results || [];

		// Return early from calls with invalid selector or context
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

			return results;
		}

		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if ( !seed ) {

			if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
				setDocument( context );
			}
			context = context || document;

			if ( documentIsHTML ) {

				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

					// ID selector
					if ( (m = match[1]) ) {

						// Document context
						if ( nodeType === 9 ) {
							if ( (elem = context.getElementById( m )) ) {

								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if ( elem.id === m ) {
									results.push( elem );
									return results;
								}
							} else {
								return results;
							}

						// Element context
						} else {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( newContext && (elem = newContext.getElementById( m )) &&
								contains( context, elem ) &&
								elem.id === m ) {

								results.push( elem );
								return results;
							}
						}

					// Type selector
					} else if ( match[2] ) {
						push.apply( results, context.getElementsByTagName( selector ) );
						return results;

					// Class selector
					} else if ( (m = match[3]) && support.getElementsByClassName &&
						context.getElementsByClassName ) {

						push.apply( results, context.getElementsByClassName( m ) );
						return results;
					}
				}

				// Take advantage of querySelectorAll
				if ( support.qsa &&
					!compilerCache[ selector + " " ] &&
					(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

					if ( nodeType !== 1 ) {
						newContext = context;
						newSelector = selector;

					// qSA looks outside Element context, which is not what we want
					// Thanks to Andrew Dupont for this workaround technique
					// Support: IE <=8
					// Exclude object elements
					} else if ( context.nodeName.toLowerCase() !== "object" ) {

						// Capture the context ID, setting it first if necessary
						if ( (nid = context.getAttribute( "id" )) ) {
							nid = nid.replace( rescape, "\\$&" );
						} else {
							context.setAttribute( "id", (nid = expando) );
						}

						// Prefix every selector in the list
						groups = tokenize( selector );
						i = groups.length;
						nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
						while ( i-- ) {
							groups[i] = nidselect + " " + toSelector( groups[i] );
						}
						newSelector = groups.join( "," );

						// Expand context for sibling selectors
						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
							context;
					}

					if ( newSelector ) {
						try {
							push.apply( results,
								newContext.querySelectorAll( newSelector )
							);
							return results;
						} catch ( qsaError ) {
						} finally {
							if ( nid === expando ) {
								context.removeAttribute( "id" );
							}
						}
					}
				}
			}
		}

		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}

	/**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];

		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}

	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}

	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created div and expects a boolean result
	 */
	function assert( fn ) {
		var div = document.createElement("div");

		try {
			return !!fn( div );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( div.parentNode ) {
				div.parentNode.removeChild( div );
			}
			// release memory in IE
			div = null;
		}
	}

	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = arr.length;

		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}

	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				( ~b.sourceIndex || MAX_NEGATIVE ) -
				( ~a.sourceIndex || MAX_NEGATIVE );

		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}

		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}

		return a ? 1 : -1;
	}

	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;

				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}

	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}

	// Expose support vars for convenience
	support = Sizzle.support = {};

	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};

	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, parent,
			doc = node ? node.ownerDocument || node : preferredDoc;

		// Return early if doc is invalid or already selected
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}

		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML( document );

		// Support: IE 9-11, Edge
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		if ( (parent = document.defaultView) && parent.top !== parent ) {
			// Support: IE 11
			if ( parent.addEventListener ) {
				parent.addEventListener( "unload", unloadHandler, false );

			// Support: IE 9 - 10 only
			} else if ( parent.attachEvent ) {
				parent.attachEvent( "onunload", unloadHandler );
			}
		}

		/* Attributes
		---------------------------------------------------------------------- */

		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( div ) {
			div.className = "i";
			return !div.getAttribute("className");
		});

		/* getElement(s)By*
		---------------------------------------------------------------------- */

		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( div ) {
			div.appendChild( document.createComment("") );
			return !div.getElementsByTagName("*").length;
		});

		// Support: IE<9
		support.getElementsByClassName = rnative.test( document.getElementsByClassName );

		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( div ) {
			docElem.appendChild( div ).id = expando;
			return !document.getElementsByName || !document.getElementsByName( expando ).length;
		});

		// ID find and filter
		if ( support.getById ) {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var m = context.getElementById( id );
					return m ? [ m ] : [];
				}
			};
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			// Support: IE6/7
			// getElementById is not reliable as a find shortcut
			delete Expr.find["ID"];

			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" &&
						elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}

		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );

				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :

			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			};

		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};

		/* QSA/matchesSelector
		---------------------------------------------------------------------- */

		// QSA and matchesSelector support

		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];

		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See http://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];

		if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( div ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// http://bugs.jquery.com/ticket/12359
				docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\r\\' msallowcapture=''>" +
					"<option selected=''></option></select>";

				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( div.querySelectorAll("[msallowcapture^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}

				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !div.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}

				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push("~=");
				}

				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}

				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibing-combinator selector` fails
				if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});

			assert(function( div ) {
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement("input");
				input.setAttribute( "type", "hidden" );
				div.appendChild( input ).setAttribute( "name", "D" );

				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( div.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}

				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":enabled").length ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}

				// Opera 10-11 does not throw on post-comma invalid pseudos
				div.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}

		if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {

			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( div, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}

		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );

		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};

		/* Sorting
		---------------------------------------------------------------------- */

		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {

			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}

			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :

				// Otherwise we know they are disconnected
				1;

			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];

			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === document ? -1 :
					b === document ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;

			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}

			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}

			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}

			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :

				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};

		return document;
	};

	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};

	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );

		if ( support.matchesSelector && documentIsHTML &&
			!compilerCache[ expr + " " ] &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

			try {
				var ret = matches.call( elem, expr );

				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch (e) {}
		}

		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};

	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};

	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;

		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};

	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};

	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;

		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}

		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;

		return results;
	};

	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};

	Expr = Sizzle.selectors = {

		// Can be adjusted by the user
		cacheLength: 50,

		createPseudo: markFunction,

		match: matchExpr,

		attrHandle: {},

		find: {},

		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},

		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );

				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}

				return match.slice( 0, 4 );
			},

			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();

				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}

					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}

				return match;
			},

			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[6] && match[2];

				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}

				// Accept quoted arguments as-is
				if ( match[3] ) {
					match[2] = match[4] || match[5] || "";

				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}

				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},

		filter: {

			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},

			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];

				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
					});
			},

			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );

					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}

					result += "";

					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},

			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";

				return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :

					function( elem, context, xml ) {
						var cache, uniqueCache, outerCache, node, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = false;

						if ( parent ) {

							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) {

											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [ forward ? parent.firstChild : parent.lastChild ];

							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {

								// Seek `elem` from a previously-cached index

								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex && cache[ 2 ];
								node = nodeIndex && parent.childNodes[ nodeIndex ];

								while ( (node = ++nodeIndex && node && node[ dir ] ||

									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {

									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}

							} else {
								// Use previously-cached element index if available
								if ( useCache ) {
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[ expando ] || (node[ expando ] = {});

									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[ node.uniqueID ] ||
										(outerCache[ node.uniqueID ] = {});

									cache = uniqueCache[ type ] || [];
									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
									diff = nodeIndex;
								}

								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if ( diff === false ) {
									// Use the same loop as above to seek `elem` from the start
									while ( (node = ++nodeIndex && node && node[ dir ] ||
										(diff = nodeIndex = 0) || start.pop()) ) {

										if ( ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) &&
											++diff ) {

											// Cache the index of each encountered element
											if ( useCache ) {
												outerCache = node[ expando ] || (node[ expando ] = {});

												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[ node.uniqueID ] ||
													(outerCache[ node.uniqueID ] = {});

												uniqueCache[ type ] = [ dirruns, diff ];
											}

											if ( node === elem ) {
												break;
											}
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},

			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );

				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}

				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}

				return fn;
			}
		},

		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );

				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;

						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
			}),

			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),

			"contains": markFunction(function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),

			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),

			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},

			"root": function( elem ) {
				return elem === docElem;
			},

			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},

			// Boolean properties
			"enabled": function( elem ) {
				return elem.disabled === false;
			},

			"disabled": function( elem ) {
				return elem.disabled === true;
			},

			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},

			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},

			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},

			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},

			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},

			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},

			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&

					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},

			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),

			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),

			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),

			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};

	Expr.pseudos["nth"] = Expr.pseudos["eq"];

	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}

	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();

	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];

		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}

		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;

		while ( soFar ) {

			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}

			matched = false;

			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}

			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}

			if ( !matched ) {
				break;
			}
		}

		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};

	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}

	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			checkNonElements = base && dir === "parentNode",
			doneName = done++;

		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
			} :

			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, uniqueCache, outerCache,
					newCache = [ dirruns, doneName ];

				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

							if ( (oldCache = uniqueCache[ dir ]) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

								// Assign to newCache so results back-propagate to previous elements
								return (newCache[ 2 ] = oldCache[ 2 ]);
							} else {
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[ dir ] = newCache;

								// A match means we're done; a fail means we have to keep checking
								if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
									return true;
								}
							}
						}
					}
				}
			};
	}

	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}

	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}

	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;

		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}

		return newUnmatched;
	}

	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,

				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,

				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

						// ...intermediate processing is necessary
						[] :

						// ...otherwise use results directly
						results :
					matcherIn;

			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}

			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );

				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}

			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}

					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

							seed[temp] = !(results[temp] = elem);
						}
					}
				}

			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}

	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,

			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];

		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}

		return elementMatcher( matchers );
	}

	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;

				if ( outermost ) {
					outermostContext = context === document || context || outermost;
				}

				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						if ( !context && elem.ownerDocument !== document ) {
							setDocument( elem );
							xml = !documentIsHTML;
						}
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context || document, xml) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}

					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}

				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;

				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}

					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}

						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}

					// Add matches to results
					push.apply( results, setMatched );

					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {

						Sizzle.uniqueSort( results );
					}
				}

				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}

	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];

		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}

			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};

	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( (selector = compiled.selector || selector) );

		results = results || [];

		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if ( match.length === 1 ) {

			// Reduce context if the leading compound selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;

				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}

		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};

	// One-time assignments

	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;

	// Initialize against the default document
	setDocument();

	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( div1 ) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition( document.createElement("div") ) & 1;
	});

	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}

	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( div ) {
		div.innerHTML = "<input/>";
		div.firstChild.setAttribute( "value", "" );
		return div.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}

	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( div ) {
		return div.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}

	return Sizzle;

	})( window );



	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;



	var dir = function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	};


	var siblings = function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	};


	var rneedsContext = jQuery.expr.match.needsContext;

	var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



	var risSimple = /^.[^:#\[\.,]*$/;

	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				/* jshint -W018 */
				return !!qualifier.call( elem, i, elem ) !== not;
			} );

		}

		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			} );

		}

		if ( typeof qualifier === "string" ) {
			if ( risSimple.test( qualifier ) ) {
				return jQuery.filter( qualifier, elements, not );
			}

			qualifier = jQuery.filter( qualifier, elements );
		}

		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			} ) );
	};

	jQuery.fn.extend( {
		find: function( selector ) {
			var i,
				len = this.length,
				ret = [],
				self = this;

			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter( function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				} ) );
			}

			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}

			// Needed because $( selector, context ) becomes $( context ).find( selector )
			ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
			ret.selector = this.selector ? this.selector + " " + selector : selector;
			return ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow( this, selector || [], false ) );
		},
		not: function( selector ) {
			return this.pushStack( winnow( this, selector || [], true ) );
		},
		is: function( selector ) {
			return !!winnow(
				this,

				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	} );


	// Initialize a jQuery object


	// A central reference to the root jQuery(document)
	var rootjQuery,

		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

		init = jQuery.fn.init = function( selector, context, root ) {
			var match, elem;

			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}

			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;

			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector[ 0 ] === "<" &&
					selector[ selector.length - 1 ] === ">" &&
					selector.length >= 3 ) {

					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];

				} else {
					match = rquickExpr.exec( selector );
				}

				// Match html or make sure no context is specified for #id
				if ( match && ( match[ 1 ] || !context ) ) {

					// HANDLE: $(html) -> $(array)
					if ( match[ 1 ] ) {
						context = context instanceof jQuery ? context[ 0 ] : context;

						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[ 1 ],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );

						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {

								// Properties of context are called as methods if possible
								if ( jQuery.isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );

								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}

						return this;

					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[ 2 ] );

						// Support: Blackberry 4.6
						// gEBID returns nodes no longer in the document (#6963)
						if ( elem && elem.parentNode ) {

							// Inject the element directly into the jQuery object
							this.length = 1;
							this[ 0 ] = elem;
						}

						this.context = document;
						this.selector = selector;
						return this;
					}

				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || root ).find( selector );

				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}

			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this.context = this[ 0 ] = selector;
				this.length = 1;
				return this;

			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return root.ready !== undefined ?
					root.ready( selector ) :

					// Execute immediately if ready is not present
					selector( jQuery );
			}

			if ( selector.selector !== undefined ) {
				this.selector = selector.selector;
				this.context = selector.context;
			}

			return jQuery.makeArray( selector, this );
		};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery( document );


	var rparentsprev = /^(?:parents|prev(?:Until|All))/,

		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

	jQuery.fn.extend( {
		has: function( target ) {
			var targets = jQuery( target, this ),
				l = targets.length;

			return this.filter( function() {
				var i = 0;
				for ( ; i < l; i++ ) {
					if ( jQuery.contains( this, targets[ i ] ) ) {
						return true;
					}
				}
			} );
		},

		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
					jQuery( selectors, context || this.context ) :
					0;

			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( pos ?
						pos.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}

			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
		},

		// Determine the position of an element within the set
		index: function( elem ) {

			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}

			// Index in selector
			if ( typeof elem === "string" ) {
				return indexOf.call( jQuery( elem ), this[ 0 ] );
			}

			// Locate the position of the desired element
			return indexOf.call( this,

				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem
			);
		},

		add: function( selector, context ) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},

		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		}
	} );

	function sibling( cur, dir ) {
		while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
		return cur;
	}

	jQuery.each( {
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, i, until ) {
			return dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, i, until ) {
			return dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return siblings( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return siblings( elem.firstChild );
		},
		contents: function( elem ) {
			return elem.contentDocument || jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var matched = jQuery.map( this, fn, until );

			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}

			if ( selector && typeof selector === "string" ) {
				matched = jQuery.filter( selector, matched );
			}

			if ( this.length > 1 ) {

				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					jQuery.uniqueSort( matched );
				}

				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					matched.reverse();
				}
			}

			return this.pushStack( matched );
		};
	} );
	var rnotwhite = ( /\S+/g );



	// Convert String-formatted options into Object-formatted ones
	function createOptions( options ) {
		var object = {};
		jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		} );
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions( options ) :
			jQuery.extend( {}, options );

		var // Flag to know if list is currently firing
			firing,

			// Last fire value for non-forgettable lists
			memory,

			// Flag to know if list was already fired
			fired,

			// Flag to prevent firing
			locked,

			// Actual callback list
			list = [],

			// Queue of execution data for repeatable lists
			queue = [],

			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,

			// Fire callbacks
			fire = function() {

				// Enforce single-firing
				locked = options.once;

				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for ( ; queue.length; firingIndex = -1 ) {
					memory = queue.shift();
					while ( ++firingIndex < list.length ) {

						// Run callback and check for early termination
						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
							options.stopOnFalse ) {

							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}

				// Forget the data if we're done with it
				if ( !options.memory ) {
					memory = false;
				}

				firing = false;

				// Clean up if we're done firing for good
				if ( locked ) {

					// Keep an empty list if we have data for future add calls
					if ( memory ) {
						list = [];

					// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},

			// Actual Callbacks object
			self = {

				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {

						// If we have memory from a past run, we should fire after adding
						if ( memory && !firing ) {
							firingIndex = list.length - 1;
							queue.push( memory );
						}

						( function add( args ) {
							jQuery.each( args, function( _, arg ) {
								if ( jQuery.isFunction( arg ) ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

									// Inspect recursively
									add( arg );
								}
							} );
						} )( arguments );

						if ( memory && !firing ) {
							fire();
						}
					}
					return this;
				},

				// Remove a callback from the list
				remove: function() {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );

							// Handle firing indexes
							if ( index <= firingIndex ) {
								firingIndex--;
							}
						}
					} );
					return this;
				},

				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ?
						jQuery.inArray( fn, list ) > -1 :
						list.length > 0;
				},

				// Remove all callbacks from the list
				empty: function() {
					if ( list ) {
						list = [];
					}
					return this;
				},

				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function() {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function() {
					return !list;
				},

				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function() {
					locked = queue = [];
					if ( !memory ) {
						list = memory = "";
					}
					return this;
				},
				locked: function() {
					return !!locked;
				},

				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( !locked ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						queue.push( args );
						if ( !firing ) {
							fire();
						}
					}
					return this;
				},

				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},

				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};

		return self;
	};


	jQuery.extend( {

		Deferred: function( func ) {
			var tuples = [

					// action, add listener, listener list, final state
					[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
					[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
					[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;
						return jQuery.Deferred( function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {
								var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

								// deferred[ done | fail | progress ] for forwarding actions to newDefer
								deferred[ tuple[ 1 ] ]( function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.progress( newDefer.notify )
											.done( newDefer.resolve )
											.fail( newDefer.reject );
									} else {
										newDefer[ tuple[ 0 ] + "With" ](
											this === promise ? newDefer.promise() : this,
											fn ? [ returned ] : arguments
										);
									}
								} );
							} );
							fns = null;
						} ).promise();
					},

					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};

			// Keep pipe for back-compat
			promise.pipe = promise.then;

			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 3 ];

				// promise[ done | fail | progress ] = list.add
				promise[ tuple[ 1 ] ] = list.add;

				// Handle state
				if ( stateString ) {
					list.add( function() {

						// state = [ resolved | rejected ]
						state = stateString;

					// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
				}

				// deferred[ resolve | reject | notify ]
				deferred[ tuple[ 0 ] ] = function() {
					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
					return this;
				};
				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
			} );

			// Make the deferred a promise
			promise.promise( deferred );

			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function( subordinate /* , ..., subordinateN */ ) {
			var i = 0,
				resolveValues = slice.call( arguments ),
				length = resolveValues.length,

				// the count of uncompleted subordinates
				remaining = length !== 1 ||
					( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

				// the master Deferred.
				// If resolveValues consist of only a single Deferred, just use that.
				deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

				// Update function for both resolve and progress values
				updateFunc = function( i, contexts, values ) {
					return function( value ) {
						contexts[ i ] = this;
						values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( values === progressValues ) {
							deferred.notifyWith( contexts, values );
						} else if ( !( --remaining ) ) {
							deferred.resolveWith( contexts, values );
						}
					};
				},

				progressValues, progressContexts, resolveContexts;

			// Add listeners to Deferred subordinates; treat others as resolved
			if ( length > 1 ) {
				progressValues = new Array( length );
				progressContexts = new Array( length );
				resolveContexts = new Array( length );
				for ( ; i < length; i++ ) {
					if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
						resolveValues[ i ].promise()
							.progress( updateFunc( i, progressContexts, progressValues ) )
							.done( updateFunc( i, resolveContexts, resolveValues ) )
							.fail( deferred.reject );
					} else {
						--remaining;
					}
				}
			}

			// If we're not waiting on anything, resolve the master
			if ( !remaining ) {
				deferred.resolveWith( resolveContexts, resolveValues );
			}

			return deferred.promise();
		}
	} );


	// The deferred used on DOM ready
	var readyList;

	jQuery.fn.ready = function( fn ) {

		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	};

	jQuery.extend( {

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},

		// Handle when the DOM is ready
		ready: function( wait ) {

			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
				jQuery( document ).off( "ready" );
			}
		}
	} );

	/**
	 * The ready event handler and self cleanup method
	 */
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );
		jQuery.ready();
	}

	jQuery.ready.promise = function( obj ) {
		if ( !readyList ) {

			readyList = jQuery.Deferred();

			// Catch cases where $(document).ready() is called
			// after the browser event has already occurred.
			// Support: IE9-10 only
			// Older IE sometimes signals "interactive" too soon
			if ( document.readyState === "complete" ||
				( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

				// Handle it asynchronously to allow scripts the opportunity to delay ready
				window.setTimeout( jQuery.ready );

			} else {

				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", completed );

				// A fallback to window.onload, that will always work
				window.addEventListener( "load", completed );
			}
		}
		return readyList.promise( obj );
	};

	// Kick off the DOM ready check even if the user does not
	jQuery.ready.promise();




	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			len = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				access( elems, fn, i, key[ i ], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {

				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < len; i++ ) {
					fn(
						elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
					);
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				len ? fn( elems[ 0 ], key ) : emptyGet;
	};
	var acceptData = function( owner ) {

		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		/* jshint -W018 */
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};




	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;

	Data.prototype = {

		register: function( owner, initial ) {
			var value = initial || {};

			// If it is a node unlikely to be stringify-ed or looped over
			// use plain assignment
			if ( owner.nodeType ) {
				owner[ this.expando ] = value;

			// Otherwise secure it in a non-enumerable, non-writable property
			// configurability must be true to allow the property to be
			// deleted with the delete operator
			} else {
				Object.defineProperty( owner, this.expando, {
					value: value,
					writable: true,
					configurable: true
				} );
			}
			return owner[ this.expando ];
		},
		cache: function( owner ) {

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( !acceptData( owner ) ) {
				return {};
			}

			// Check if the owner object already has a cache
			var value = owner[ this.expando ];

			// If not, create one
			if ( !value ) {
				value = {};

				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if ( acceptData( owner ) ) {

					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if ( owner.nodeType ) {
						owner[ this.expando ] = value;

					// Otherwise secure it in a non-enumerable property
					// configurable must be true to allow the property to be
					// deleted when data is removed
					} else {
						Object.defineProperty( owner, this.expando, {
							value: value,
							configurable: true
						} );
					}
				}
			}

			return value;
		},
		set: function( owner, data, value ) {
			var prop,
				cache = this.cache( owner );

			// Handle: [ owner, key, value ] args
			if ( typeof data === "string" ) {
				cache[ data ] = value;

			// Handle: [ owner, { properties } ] args
			} else {

				// Copy the properties one-by-one to the cache object
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
			return cache;
		},
		get: function( owner, key ) {
			return key === undefined ?
				this.cache( owner ) :
				owner[ this.expando ] && owner[ this.expando ][ key ];
		},
		access: function( owner, key, value ) {
			var stored;

			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					( ( key && typeof key === "string" ) && value === undefined ) ) {

				stored = this.get( owner, key );

				return stored !== undefined ?
					stored : this.get( owner, jQuery.camelCase( key ) );
			}

			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i, name, camel,
				cache = owner[ this.expando ];

			if ( cache === undefined ) {
				return;
			}

			if ( key === undefined ) {
				this.register( owner );

			} else {

				// Support array or space separated string of keys
				if ( jQuery.isArray( key ) ) {

					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat( key.map( jQuery.camelCase ) );
				} else {
					camel = jQuery.camelCase( key );

					// Try the string as a key before any manipulation
					if ( key in cache ) {
						name = [ key, camel ];
					} else {

						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						name = camel;
						name = name in cache ?
							[ name ] : ( name.match( rnotwhite ) || [] );
					}
				}

				i = name.length;

				while ( i-- ) {
					delete cache[ name[ i ] ];
				}
			}

			// Remove the expando if there's no more data
			if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

				// Support: Chrome <= 35-45+
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://code.google.com/p/chromium/issues/detail?id=378607
				if ( owner.nodeType ) {
					owner[ this.expando ] = undefined;
				} else {
					delete owner[ this.expando ];
				}
			}
		},
		hasData: function( owner ) {
			var cache = owner[ this.expando ];
			return cache !== undefined && !jQuery.isEmptyObject( cache );
		}
	};
	var dataPriv = new Data();

	var dataUser = new Data();



	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;

	function dataAttr( elem, key, data ) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
			name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
			data = elem.getAttribute( name );

			if ( typeof data === "string" ) {
				try {
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :

						// Only convert to a number if it doesn't change the string
						+data + "" === data ? +data :
						rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
				} catch ( e ) {}

				// Make sure we set the data so it isn't changed later
				dataUser.set( elem, key, data );
			} else {
				data = undefined;
			}
		}
		return data;
	}

	jQuery.extend( {
		hasData: function( elem ) {
			return dataUser.hasData( elem ) || dataPriv.hasData( elem );
		},

		data: function( elem, name, data ) {
			return dataUser.access( elem, name, data );
		},

		removeData: function( elem, name ) {
			dataUser.remove( elem, name );
		},

		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function( elem, name, data ) {
			return dataPriv.access( elem, name, data );
		},

		_removeData: function( elem, name ) {
			dataPriv.remove( elem, name );
		}
	} );

	jQuery.fn.extend( {
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;

			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = dataUser.get( elem );

					if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {

							// Support: IE11+
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = jQuery.camelCase( name.slice( 5 ) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						dataPriv.set( elem, "hasDataAttrs", true );
					}
				}

				return data;
			}

			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each( function() {
					dataUser.set( this, key );
				} );
			}

			return access( this, function( value ) {
				var data, camelKey;

				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if ( elem && value === undefined ) {

					// Attempt to get data from the cache
					// with the key as-is
					data = dataUser.get( elem, key ) ||

						// Try to find dashed key if it exists (gh-2779)
						// This is for 2.2.x only
						dataUser.get( elem, key.replace( rmultiDash, "-$&" ).toLowerCase() );

					if ( data !== undefined ) {
						return data;
					}

					camelKey = jQuery.camelCase( key );

					// Attempt to get data from the cache
					// with the key camelized
					data = dataUser.get( elem, camelKey );
					if ( data !== undefined ) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr( elem, camelKey, undefined );
					if ( data !== undefined ) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				camelKey = jQuery.camelCase( key );
				this.each( function() {

					// First, attempt to store a copy or reference of any
					// data that might've been store with a camelCased key.
					var data = dataUser.get( this, camelKey );

					// For HTML5 data-* attribute interop, we have to
					// store property names with dashes in a camelCase form.
					// This might not apply to all properties...*
					dataUser.set( this, camelKey, value );

					// *... In the case of properties that might _actually_
					// have dashes, we need to also store a copy of that
					// unchanged property.
					if ( key.indexOf( "-" ) > -1 && data !== undefined ) {
						dataUser.set( this, key, value );
					}
				} );
			}, null, value, arguments.length > 1, null, true );
		},

		removeData: function( key ) {
			return this.each( function() {
				dataUser.remove( this, key );
			} );
		}
	} );


	jQuery.extend( {
		queue: function( elem, type, data ) {
			var queue;

			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = dataPriv.get( elem, type );

				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || jQuery.isArray( data ) ) {
						queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},

		dequeue: function( elem, type ) {
			type = type || "fx";

			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}

			if ( fn ) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}

				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}

			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},

		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
				empty: jQuery.Callbacks( "once memory" ).add( function() {
					dataPriv.remove( elem, [ type + "queue", key ] );
				} )
			} );
		}
	} );

	jQuery.fn.extend( {
		queue: function( type, data ) {
			var setter = 2;

			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}

			if ( arguments.length < setter ) {
				return jQuery.queue( this[ 0 ], type );
			}

			return data === undefined ?
				this :
				this.each( function() {
					var queue = jQuery.queue( this, type, data );

					// Ensure a hooks for this queue
					jQuery._queueHooks( this, type );

					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				} );
		},
		dequeue: function( type ) {
			return this.each( function() {
				jQuery.dequeue( this, type );
			} );
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},

		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};

			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while ( i-- ) {
				tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	} );
	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

	var isHidden = function( elem, el ) {

			// isHidden might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;
			return jQuery.css( elem, "display" ) === "none" ||
				!jQuery.contains( elem.ownerDocument, elem );
		};



	function adjustCSS( elem, prop, valueParts, tween ) {
		var adjusted,
			scale = 1,
			maxIterations = 20,
			currentValue = tween ?
				function() { return tween.cur(); } :
				function() { return jQuery.css( elem, prop, "" ); },
			initial = currentValue(),
			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

			// Starting value computation is required for potential unit mismatches
			initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
				rcssNum.exec( jQuery.css( elem, prop ) );

		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[ 3 ];

			// Make sure we update the tween properties later on
			valueParts = valueParts || [];

			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;

			do {

				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";

				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style( elem, prop, initialInUnit + unit );

			// Update scale, tolerating zero or NaN from tween.cur()
			// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (
				scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
			);
		}

		if ( valueParts ) {
			initialInUnit = +initialInUnit || +initial || 0;

			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[ 1 ] ?
				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
				+valueParts[ 2 ];
			if ( tween ) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}
	var rcheckableType = ( /^(?:checkbox|radio)$/i );

	var rtagName = ( /<([\w:-]+)/ );

	var rscriptType = ( /^$|\/(?:java|ecma)script/i );



	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {

		// Support: IE9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

	// Support: IE9
	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;


	function getAll( context, tag ) {

		// Support: IE9-11+
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret = typeof context.getElementsByTagName !== "undefined" ?
				context.getElementsByTagName( tag || "*" ) :
				typeof context.querySelectorAll !== "undefined" ?
					context.querySelectorAll( tag || "*" ) :
				[];

		return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
			jQuery.merge( [ context ], ret ) :
			ret;
	}


	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			dataPriv.set(
				elems[ i ],
				"globalEval",
				!refElements || dataPriv.get( refElements[ i ], "globalEval" )
			);
		}
	}


	var rhtml = /<|&#?\w+;/;

	function buildFragment( elems, context, scripts, selection, ignored ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {

					// Support: Android<4.1, PhantomJS<2
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: Android<4.1, PhantomJS<2
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( ( elem = nodes[ i++ ] ) ) {

			// Skip elements already in the context collection (trac-4087)
			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
				if ( ignored ) {
					ignored.push( elem );
				}
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( ( elem = tmp[ j++ ] ) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	}


	( function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild( document.createElement( "div" ) ),
			input = document.createElement( "input" );

		// Support: Android 4.0-4.3, Safari<=5.1
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );

		div.appendChild( input );

		// Support: Safari<=5.1, Android<4.2
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

		// Support: IE<=11+
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	} )();


	var
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	// Support: IE9
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}

	function on( elem, types, selector, data, fn, one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {

			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {

				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				on( elem, type, selector, data, types[ type ], one );
			}
			return elem;
		}

		if ( data == null && fn == null ) {

			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {

				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {

				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return elem;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {

				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};

			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return elem.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		} );
	}

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {

		global: {},

		add: function( elem, types, handler, data, selector ) {

			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.get( elem );

			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if ( !elemData ) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if ( !( events = elemData.events ) ) {
				events = elemData.events = {};
			}
			if ( !( eventHandle = elemData.handle ) ) {
				eventHandle = elemData.handle = function( e ) {

					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
				};
			}

			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend( {
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join( "." )
				}, handleObjIn );

				// Init the event handler queue if we're the first
				if ( !( handlers = events[ type ] ) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if ( !special.setup ||
						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle );
						}
					}
				}

				if ( special.add ) {
					special.add.call( elem, handleObj );

					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}

		},

		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {

			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

			if ( !elemData || !( events = elemData.events ) ) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}

				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[ 2 ] &&
					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];

					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );

						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown ||
						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

						jQuery.removeEvent( elem, type, elemData.handle );
					}

					delete events[ type ];
				}
			}

			// Remove data and the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				dataPriv.remove( elem, "handle events" );
			}
		},

		dispatch: function( event ) {

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( event );

			var i, j, ret, matched, handleObj,
				handlerQueue = [],
				args = slice.call( arguments ),
				handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[ 0 ] = event;
			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;

				j = 0;
				while ( ( handleObj = matched.handlers[ j++ ] ) &&
					!event.isImmediatePropagationStopped() ) {

					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
							handleObj.handler ).apply( matched.elem, args );

						if ( ret !== undefined ) {
							if ( ( event.result = ret ) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}

			return event.result;
		},

		handlers: function( event, handlers ) {
			var i, matches, sel, handleObj,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;

			// Support (at least): Chrome, IE9
			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			//
			// Support: Firefox<=42+
			// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
			if ( delegateCount && cur.nodeType &&
				( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

				for ( ; cur !== this; cur = cur.parentNode || this ) {

					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
						matches = [];
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

							if ( matches[ sel ] === undefined ) {
								matches[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) > -1 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matches[ sel ] ) {
								matches.push( handleObj );
							}
						}
						if ( matches.length ) {
							handlerQueue.push( { elem: cur, handlers: matches } );
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			if ( delegateCount < handlers.length ) {
				handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
			}

			return handlerQueue;
		},

		// Includes some event props shared by KeyEvent and MouseEvent
		props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
			"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

		fixHooks: {},

		keyHooks: {
			props: "char charCode key keyCode".split( " " ),
			filter: function( event, original ) {

				// Add which for key events
				if ( event.which == null ) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}

				return event;
			}
		},

		mouseHooks: {
			props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
				"screenX screenY toElement" ).split( " " ),
			filter: function( event, original ) {
				var eventDoc, doc, body,
					button = original.button;

				// Calculate pageX/Y if missing and clientX/Y available
				if ( event.pageX == null && original.clientX != null ) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					event.pageX = original.clientX +
						( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
						( doc && doc.clientLeft || body && body.clientLeft || 0 );
					event.pageY = original.clientY +
						( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
						( doc && doc.clientTop  || body && body.clientTop  || 0 );
				}

				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if ( !event.which && button !== undefined ) {
					event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
				}

				return event;
			}
		},

		fix: function( event ) {
			if ( event[ jQuery.expando ] ) {
				return event;
			}

			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[ type ];

			if ( !fixHook ) {
				this.fixHooks[ type ] = fixHook =
					rmouseEvent.test( type ) ? this.mouseHooks :
					rkeyEvent.test( type ) ? this.keyHooks :
					{};
			}
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

			event = new jQuery.Event( originalEvent );

			i = copy.length;
			while ( i-- ) {
				prop = copy[ i ];
				event[ prop ] = originalEvent[ prop ];
			}

			// Support: Cordova 2.5 (WebKit) (#13255)
			// All events should have a target; Cordova deviceready doesn't
			if ( !event.target ) {
				event.target = document;
			}

			// Support: Safari 6.0+, Chrome<28
			// Target should not be a text node (#504, #13143)
			if ( event.target.nodeType === 3 ) {
				event.target = event.target.parentNode;
			}

			return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
		},

		special: {
			load: {

				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {

				// Fire native event if possible so blur/focus sequence is correct
				trigger: function() {
					if ( this !== safeActiveElement() && this.focus ) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if ( this === safeActiveElement() && this.blur ) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {

				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function( event ) {
					return jQuery.nodeName( event.target, "a" );
				}
			},

			beforeunload: {
				postDispatch: function( event ) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};

	jQuery.removeEvent = function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	};

	jQuery.Event = function( src, props ) {

		// Allow instantiation without the 'new' keyword
		if ( !( this instanceof jQuery.Event ) ) {
			return new jQuery.Event( src, props );
		}

		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&

					// Support: Android<4.0
					src.returnValue === false ?
				returnTrue :
				returnFalse;

		// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,

		preventDefault: function() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if ( e ) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if ( e ) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if ( e ) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://code.google.com/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each( {
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,

			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;

				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	} );

	jQuery.fn.extend( {
		on: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn );
		},
		one: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {

				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {

				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {

				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each( function() {
				jQuery.event.remove( this, types, fn, selector );
			} );
		}
	} );


	var
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

		// Support: IE 10-11, Edge 10240+
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,

		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

	// Manipulating tables requires a tbody
	function manipulationTarget( elem, content ) {
		return jQuery.nodeName( elem, "table" ) &&
			jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

			elem.getElementsByTagName( "tbody" )[ 0 ] ||
				elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
			elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		var match = rscriptTypeMasked.exec( elem.type );

		if ( match ) {
			elem.type = match[ 1 ];
		} else {
			elem.removeAttribute( "type" );
		}

		return elem;
	}

	function cloneCopyEvent( src, dest ) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

		if ( dest.nodeType !== 1 ) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if ( dataPriv.hasData( src ) ) {
			pdataOld = dataPriv.access( src );
			pdataCur = dataPriv.set( dest, pdataOld );
			events = pdataOld.events;

			if ( events ) {
				delete pdataCur.handle;
				pdataCur.events = {};

				for ( type in events ) {
					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
						jQuery.event.add( dest, type, events[ type ][ i ] );
					}
				}
			}
		}

		// 2. Copy user data
		if ( dataUser.hasData( src ) ) {
			udataOld = dataUser.access( src );
			udataCur = jQuery.extend( {}, udataOld );

			dataUser.set( dest, udataCur );
		}
	}

	// Fix IE bugs, see support tests
	function fixInput( src, dest ) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
			dest.checked = src.checked;

		// Fails to return the selected option to the default selected state when cloning options
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}

	function domManip( collection, args, callback, ignored ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return collection.each( function( index ) {
				var self = collection.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				domManip( self, args, callback, ignored );
			} );
		}

		if ( l ) {
			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			// Require either new content or an interest in ignored elements to invoke the callback
			if ( first || ignored ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {

							// Support: Android<4.1, PhantomJS<2
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( collection[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!dataPriv.access( node, "globalEval" ) &&
							jQuery.contains( doc, node ) ) {

							if ( node.src ) {

								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return collection;
	}

	function remove( elem, selector, keepData ) {
		var node,
			nodes = selector ? jQuery.filter( selector, elem ) : elem,
			i = 0;

		for ( ; ( node = nodes[ i ] ) != null; i++ ) {
			if ( !keepData && node.nodeType === 1 ) {
				jQuery.cleanData( getAll( node ) );
			}

			if ( node.parentNode ) {
				if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
					setGlobalEval( getAll( node, "script" ) );
				}
				node.parentNode.removeChild( node );
			}
		}

		return elem;
	}

	jQuery.extend( {
		htmlPrefilter: function( html ) {
			return html.replace( rxhtmlTag, "<$1></$2>" );
		},

		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode( true ),
				inPage = jQuery.contains( elem.ownerDocument, elem );

			// Fix IE cloning issues
			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
					!jQuery.isXMLDoc( elem ) ) {

				// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					fixInput( srcElements[ i ], destElements[ i ] );
				}
			}

			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );

					for ( i = 0, l = srcElements.length; i < l; i++ ) {
						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}

			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}

			// Return the cloned set
			return clone;
		},

		cleanData: function( elems ) {
			var data, elem, type,
				special = jQuery.event.special,
				i = 0;

			for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
				if ( acceptData( elem ) ) {
					if ( ( data = elem[ dataPriv.expando ] ) ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );

								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}

						// Support: Chrome <= 35-45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataPriv.expando ] = undefined;
					}
					if ( elem[ dataUser.expando ] ) {

						// Support: Chrome <= 35-45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataUser.expando ] = undefined;
					}
				}
			}
		}
	} );

	jQuery.fn.extend( {

		// Keep domManip exposed until 3.0 (gh-2225)
		domManip: domManip,

		detach: function( selector ) {
			return remove( this, selector, true );
		},

		remove: function( selector ) {
			return remove( this, selector );
		},

		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().each( function() {
						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
							this.textContent = value;
						}
					} );
			}, null, value, arguments.length );
		},

		append: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			} );
		},

		prepend: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			} );
		},

		before: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			} );
		},

		after: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			} );
		},

		empty: function() {
			var elem,
				i = 0;

			for ( ; ( elem = this[ i ] ) != null; i++ ) {
				if ( elem.nodeType === 1 ) {

					// Prevent memory leaks
					jQuery.cleanData( getAll( elem, false ) );

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map( function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			} );
		},

		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;

				if ( value === undefined && elem.nodeType === 1 ) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

					value = jQuery.htmlPrefilter( value );

					try {
						for ( ; i < l; i++ ) {
							elem = this[ i ] || {};

							// Remove element nodes and prevent memory leaks
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}

						elem = 0;

					// If using innerHTML throws an exception, use the fallback method
					} catch ( e ) {}
				}

				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},

		replaceWith: function() {
			var ignored = [];

			// Make the changes, replacing each non-ignored context element with the new content
			return domManip( this, arguments, function( elem ) {
				var parent = this.parentNode;

				if ( jQuery.inArray( this, ignored ) < 0 ) {
					jQuery.cleanData( getAll( this ) );
					if ( parent ) {
						parent.replaceChild( elem, this );
					}
				}

			// Force callback invocation
			}, ignored );
		}
	} );

	jQuery.each( {
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1,
				i = 0;

			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );

				// Support: QtWebKit
				// .get() because push.apply(_, arraylike) throws
				push.apply( ret, elems.get() );
			}

			return this.pushStack( ret );
		};
	} );


	var iframe,
		elemdisplay = {

			// Support: Firefox
			// We have to pre-define these values for FF (#10227)
			HTML: "block",
			BODY: "block"
		};

	/**
	 * Retrieve the actual display of a element
	 * @param {String} name nodeName of the element
	 * @param {Object} doc Document object
	 */

	// Called only from within defaultDisplay
	function actualDisplay( name, doc ) {
		var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

			display = jQuery.css( elem[ 0 ], "display" );

		// We don't have any data stored on the element,
		// so use "detach" method as fast way to get rid of the element
		elem.detach();

		return display;
	}

	/**
	 * Try to determine the default display value of an element
	 * @param {String} nodeName
	 */
	function defaultDisplay( nodeName ) {
		var doc = document,
			display = elemdisplay[ nodeName ];

		if ( !display ) {
			display = actualDisplay( nodeName, doc );

			// If the simple way fails, read from inside an iframe
			if ( display === "none" || !display ) {

				// Use the already-created iframe if possible
				iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
					.appendTo( doc.documentElement );

				// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
				doc = iframe[ 0 ].contentDocument;

				// Support: IE
				doc.write();
				doc.close();

				display = actualDisplay( nodeName, doc );
				iframe.detach();
			}

			// Store the correct default display
			elemdisplay[ nodeName ] = display;
		}

		return display;
	}
	var rmargin = ( /^margin/ );

	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

	var getStyles = function( elem ) {

			// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;

			if ( !view || !view.opener ) {
				view = window;
			}

			return view.getComputedStyle( elem );
		};

	var swap = function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	};


	var documentElement = document.documentElement;



	( function() {
		var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );

		// Finish early in limited (non-browser) environments
		if ( !div.style ) {
			return;
		}

		// Support: IE9-11+
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
			"padding:0;margin-top:1px;position:absolute";
		container.appendChild( div );

		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {
			div.style.cssText =

				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
				"position:relative;display:block;" +
				"margin:auto;border:1px;padding:1px;" +
				"top:1%;width:50%";
			div.innerHTML = "";
			documentElement.appendChild( container );

			var divStyle = window.getComputedStyle( div );
			pixelPositionVal = divStyle.top !== "1%";
			reliableMarginLeftVal = divStyle.marginLeft === "2px";
			boxSizingReliableVal = divStyle.width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = divStyle.marginRight === "4px";

			documentElement.removeChild( container );
		}

		jQuery.extend( support, {
			pixelPosition: function() {

				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computeStyleTests();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computeStyleTests();
				}
				return boxSizingReliableVal;
			},
			pixelMarginRight: function() {

				// Support: Android 4.0-4.3
				// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
				// since that compresses better and they're computed together anyway.
				if ( boxSizingReliableVal == null ) {
					computeStyleTests();
				}
				return pixelMarginRightVal;
			},
			reliableMarginLeft: function() {

				// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
				if ( boxSizingReliableVal == null ) {
					computeStyleTests();
				}
				return reliableMarginLeftVal;
			},
			reliableMarginRight: function() {

				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );

				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =

					// Support: Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;box-sizing:content-box;" +
					"display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				documentElement.appendChild( container );

				ret = !parseFloat( window.getComputedStyle( marginDiv ).marginRight );

				documentElement.removeChild( container );
				div.removeChild( marginDiv );

				return ret;
			}
		} );
	} )();


	function curCSS( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') (#12537)
		if ( computed ) {

			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret !== undefined ?

			// Support: IE9-11+
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}


	function addGetHookIf( conditionFn, hookFn ) {

		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {

					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return ( this.get = hookFn ).apply( this, arguments );
			}
		};
	}


	var

		// Swappable if display is none or starts with table
		// except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,

		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},

		cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
		emptyStyle = document.createElement( "div" ).style;

	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( name ) {

		// Shortcut for names that are not vendor prefixed
		if ( name in emptyStyle ) {
			return name;
		}

		// Check for vendor prefixed names
		var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;

		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}

	function setPositiveNumber( elem, value, subtract ) {

		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec( value );
		return matches ?

			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
			value;
	}

	function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
		var i = extra === ( isBorderBox ? "border" : "content" ) ?

			// If we already have the right measurement, avoid augmentation
			4 :

			// Otherwise initialize for horizontal or vertical properties
			name === "width" ? 1 : 0,

			val = 0;

		for ( ; i < 4; i += 2 ) {

			// Both box models exclude margin, so add it if we want it
			if ( extra === "margin" ) {
				val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
			}

			if ( isBorderBox ) {

				// border-box includes padding, so remove it if we want content
				if ( extra === "content" ) {
					val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}

				// At this point, extra isn't border nor margin, so remove border
				if ( extra !== "margin" ) {
					val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			} else {

				// At this point, extra isn't content, so add padding
				val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

				// At this point, extra isn't content nor padding, so add border
				if ( extra !== "padding" ) {
					val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}

		return val;
	}

	function getWidthOrHeight( elem, name, extra ) {

		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
			val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			styles = getStyles( elem ),
			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Support: IE11 only
		// In IE 11 fullscreen elements inside of an iframe have
		// 100x too small dimensions (gh-1764).
		if ( document.msFullscreenElement && window.top !== window ) {

			// Support: IE11 only
			// Running getBoundingClientRect on a disconnected node
			// in IE throws an error.
			if ( elem.getClientRects().length ) {
				val = Math.round( elem.getBoundingClientRect()[ name ] * 100 );
			}
		}

		// Some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if ( val <= 0 || val == null ) {

			// Fall back to computed then uncomputed css if necessary
			val = curCSS( elem, name, styles );
			if ( val < 0 || val == null ) {
				val = elem.style[ name ];
			}

			// Computed unit is not pixels. Stop here and return.
			if ( rnumnonpx.test( val ) ) {
				return val;
			}

			// Check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				( support.boxSizingReliable() || val === elem.style[ name ] );

			// Normalize "", auto, and prepare for extra
			val = parseFloat( val ) || 0;
		}

		// Use the active box-sizing model to add/subtract irrelevant styles
		return ( val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}

	function showHide( elements, show ) {
		var display, elem, hidden,
			values = [],
			index = 0,
			length = elements.length;

		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}

			values[ index ] = dataPriv.get( elem, "olddisplay" );
			display = elem.style.display;
			if ( show ) {

				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !values[ index ] && display === "none" ) {
					elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( elem.style.display === "" && isHidden( elem ) ) {
					values[ index ] = dataPriv.access(
						elem,
						"olddisplay",
						defaultDisplay( elem.nodeName )
					);
				}
			} else {
				hidden = isHidden( elem );

				if ( display !== "none" || !hidden ) {
					dataPriv.set(
						elem,
						"olddisplay",
						hidden ? display : jQuery.css( elem, "display" )
					);
				}
			}
		}

		// Set the display of most of the elements in a second loop
		// to avoid the constant reflow
		for ( index = 0; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
			if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
				elem.style.display = show ? values[ index ] || "" : "none";
			}
		}

		return elements;
	}

	jQuery.extend( {

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {

						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},

		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {

			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase( name ),
				style = elem.style;

			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;

				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
					value = adjustCSS( elem, name, ret );

					// Fixes bug #9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set (#7116)
				if ( value == null || value !== value ) {
					return;
				}

				// If a number was passed in, add the unit (except for certain CSS properties)
				if ( type === "number" ) {
					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
				}

				// Support: IE9-11+
				// background-* props affect original clone's values
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !( "set" in hooks ) ||
					( value = hooks.set( elem, value, extra ) ) !== undefined ) {

					style[ name ] = value;
				}

			} else {

				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks &&
					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

					return ret;
				}

				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},

		css: function( elem, name, extra, styles ) {
			var val, num, hooks,
				origName = jQuery.camelCase( name );

			// Make sure that we're working with the right name
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}

			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}

			// Convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}

			// Make numeric if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || isFinite( num ) ? num || 0 : val;
			}
			return val;
		}
	} );

	jQuery.each( [ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {

					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
						elem.offsetWidth === 0 ?
							swap( elem, cssShow, function() {
								return getWidthOrHeight( elem, name, extra );
							} ) :
							getWidthOrHeight( elem, name, extra );
				}
			},

			set: function( elem, value, extra ) {
				var matches,
					styles = extra && getStyles( elem ),
					subtract = extra && augmentWidthOrHeight(
						elem,
						name,
						extra,
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
						styles
					);

				// Convert to pixels if value adjustment is needed
				if ( subtract && ( matches = rcssNum.exec( value ) ) &&
					( matches[ 3 ] || "px" ) !== "px" ) {

					elem.style[ name ] = value;
					value = jQuery.css( elem, name );
				}

				return setPositiveNumber( elem, value, subtract );
			}
		};
	} );

	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
		function( elem, computed ) {
			if ( computed ) {
				return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} )
					) + "px";
			}
		}
	);

	// Support: Android 2.3
	jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
		function( elem, computed ) {
			if ( computed ) {
				return swap( elem, { "display": "inline-block" },
					curCSS, [ elem, "marginRight" ] );
			}
		}
	);

	// These hooks are used by animate to expand properties
	jQuery.each( {
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},

					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split( " " ) : [ value ];

				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}

				return expanded;
			}
		};

		if ( !rmargin.test( prefix ) ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	} );

	jQuery.fn.extend( {
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;

				if ( jQuery.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;

					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}

					return map;
				}

				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		},
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}

			return this.each( function() {
				if ( isHidden( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			} );
		}
	} );


	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];

			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];

			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;

			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}

			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;

				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if ( tween.elem.nodeType !== 1 ||
					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
					return tween.elem[ tween.prop ];
				}

				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css( tween.elem, tween.prop, "" );

				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {

				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.nodeType === 1 &&
					( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
						jQuery.cssHooks[ tween.prop ] ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};

	// Support: IE9
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		},
		_default: "swing"
	};

	jQuery.fx = Tween.prototype.init;

	// Back Compat <1.8 extension point
	jQuery.fx.step = {};




	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;

	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout( function() {
			fxNow = undefined;
		} );
		return ( fxNow = jQuery.now() );
	}

	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			i = 0,
			attrs = { height: type };

		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4 ; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}

		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween( value, prop, animation ) {
		var tween,
			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

				// We're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter( elem, props, opts ) {
		/* jshint validthis: true */
		var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHidden( elem ),
			dataShow = dataPriv.get( elem, "fxshow" );

		// Handle queue: false promises
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always( function() {

				// Ensure the complete handler is called before this completes
				anim.always( function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				} );
			} );
		}

		// Height/width overflow pass
		if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

			// Make sure that nothing sneaks out
			// Record all 3 overflow attributes because IE9-10 do not
			// change the overflow attribute when overflowX and
			// overflowY are set to the same value
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

			// Set display property to inline-block for height/width
			// animations on inline elements that are having width/height animated
			display = jQuery.css( elem, "display" );

			// Test default display if display is currently "none"
			checkDisplay = display === "none" ?
				dataPriv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

			if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
				style.display = "inline-block";
			}
		}

		if ( opts.overflow ) {
			style.overflow = "hidden";
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}

		// show/hide pass
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.exec( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {

					// If there is dataShow left over from a stopped hide or show
					// and we are going to proceed with show, we should pretend to be hidden
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

			// Any non-fx value stops us from restoring the original display value
			} else {
				display = undefined;
			}
		}

		if ( !jQuery.isEmptyObject( orig ) ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", {} );
			}

			// Store state if its toggle - enables .stop().toggle() to "reverse"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}
			if ( hidden ) {
				jQuery( elem ).show();
			} else {
				anim.done( function() {
					jQuery( elem ).hide();
				} );
			}
			anim.done( function() {
				var prop;

				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
			for ( prop in orig ) {
				tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

				if ( !( prop in dataShow ) ) {
					dataShow[ prop ] = tween.start;
					if ( hidden ) {
						tween.end = tween.start;
						tween.start = prop === "width" || prop === "height" ? 1 : 0;
					}
				}
			}

		// If this is a noop like .hide().hide(), restore an overwritten display value
		} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
			style.display = display;
		}
	}

	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = jQuery.camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( jQuery.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}

			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}

			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];

				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}

	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always( function() {

				// Don't match elem in the :animated selector
				delete tick.elem;
			} ),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

					// Support: Android 2.3
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;

				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( percent );
				}

				deferred.notifyWith( elem, [ animation, percent, remaining ] );

				if ( percent < 1 && length ) {
					return remaining;
				} else {
					deferred.resolveWith( elem, [ animation ] );
					return false;
				}
			},
			animation = deferred.promise( {
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
							animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,

						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length ; index++ ) {
						animation.tweens[ index ].run( 1 );
					}

					// Resolve when we played the last frame; otherwise, reject
					if ( gotoEnd ) {
						deferred.notifyWith( elem, [ animation, 1, 0 ] );
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			} ),
			props = animation.props;

		propFilter( props, animation.opts.specialEasing );

		for ( ; index < length ; index++ ) {
			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				if ( jQuery.isFunction( result.stop ) ) {
					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
						jQuery.proxy( result.stop, result );
				}
				return result;
			}
		}

		jQuery.map( props, createTween, animation );

		if ( jQuery.isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}

		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			} )
		);

		// attach callbacks from options
		return animation.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	}

	jQuery.Animation = jQuery.extend( Animation, {
		tweeners: {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value );
				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
				return tween;
			} ]
		},

		tweener: function( props, callback ) {
			if ( jQuery.isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.match( rnotwhite );
			}

			var prop,
				index = 0,
				length = props.length;

			for ( ; index < length ; index++ ) {
				prop = props[ index ];
				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
				Animation.tweeners[ prop ].unshift( callback );
			}
		},

		prefilters: [ defaultPrefilter ],

		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				Animation.prefilters.unshift( callback );
			} else {
				Animation.prefilters.push( callback );
			}
		}
	} );

	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ?
			opt.duration : opt.duration in jQuery.fx.speeds ?
				jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// Normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function() {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};

		return opt;
	};

	jQuery.fn.extend( {
		fadeTo: function( speed, to, easing, callback ) {

			// Show any hidden elements after setting opacity to 0
			return this.filter( isHidden ).css( "opacity", 0 ).show()

				// Animate to the value specified
				.end().animate( { opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {

					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );

					// Empty animations, or finishing resolves immediately
					if ( empty || dataPriv.get( this, "finish" ) ) {
						anim.stop( true );
					}
				};
				doAnimation.finish = doAnimation;

			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};

			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}

			return this.each( function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = dataPriv.get( this );

				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}

				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this &&
						( type == null || timers[ index ].queue === type ) ) {

						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}

				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			} );
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each( function() {
				var index,
					data = dataPriv.get( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;

				// Enable finishing flag on private data
				data.finish = true;

				// Empty the queue first
				jQuery.queue( this, type, [] );

				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}

				// Look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}

				// Look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}

				// Turn off finishing flag
				delete data.finish;
			} );
		}
	} );

	jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	} );

	// Generate shortcuts for custom animations
	jQuery.each( {
		slideDown: genFx( "show" ),
		slideUp: genFx( "hide" ),
		slideToggle: genFx( "toggle" ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	} );

	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;

		fxNow = jQuery.now();

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];

			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		if ( timer() ) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};

	jQuery.fx.interval = 13;
	jQuery.fx.start = function() {
		if ( !timerId ) {
			timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	};

	jQuery.fx.stop = function() {
		window.clearInterval( timerId );

		timerId = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,

		// Default speed
		_default: 400
	};


	// Based off of the plugin by Clint Helfers, with permission.
	// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = window.setTimeout( next, time );
			hooks.stop = function() {
				window.clearTimeout( timeout );
			};
		} );
	};


	( function() {
		var input = document.createElement( "input" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );

		input.type = "checkbox";

		// Support: iOS<=5.1, Android<=4.2+
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";

		// Support: IE<=11+
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;

		// Support: Android<=2.3
		// Options inside disabled selects are incorrectly marked as disabled
		select.disabled = true;
		support.optDisabled = !opt.disabled;

		// Support: IE<=11+
		// An input loses its value after becoming a radio
		input = document.createElement( "input" );
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	} )();


	var boolHook,
		attrHandle = jQuery.expr.attrHandle;

	jQuery.fn.extend( {
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},

		removeAttr: function( name ) {
			return this.each( function() {
				jQuery.removeAttr( this, name );
			} );
		}
	} );

	jQuery.extend( {
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set attributes on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}

			// All attributes are lowercase
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[ name ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
			}

			if ( value !== undefined ) {
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;
				}

				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}

				elem.setAttribute( name, value + "" );
				return value;
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},

		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						jQuery.nodeName( elem, "input" ) ) {
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},

		removeAttr: function( elem, value ) {
			var name, propName,
				i = 0,
				attrNames = value && value.match( rnotwhite );

			if ( attrNames && elem.nodeType === 1 ) {
				while ( ( name = attrNames[ i++ ] ) ) {
					propName = jQuery.propFix[ name ] || name;

					// Boolean attributes get special treatment (#10870)
					if ( jQuery.expr.match.bool.test( name ) ) {

						// Set corresponding property to false
						elem[ propName ] = false;
					}

					elem.removeAttribute( name );
				}
			}
		}
	} );

	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {

				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				elem.setAttribute( name, name );
			}
			return name;
		}
	};
	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;

		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	} );




	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;

	jQuery.fn.extend( {
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},

		removeProp: function( name ) {
			return this.each( function() {
				delete this[ jQuery.propFix[ name ] || name ];
			} );
		}
	} );

	jQuery.extend( {
		prop: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}

			if ( value !== undefined ) {
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}

				return ( elem[ name ] = value );
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			return elem[ name ];
		},

		propHooks: {
			tabIndex: {
				get: function( elem ) {

					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr( elem, "tabindex" );

					return tabindex ?
						parseInt( tabindex, 10 ) :
						rfocusable.test( elem.nodeName ) ||
							rclickable.test( elem.nodeName ) && elem.href ?
								0 :
								-1;
				}
			}
		},

		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	} );

	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {
				var parent = elem.parentNode;
				if ( parent && parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
				return null;
			}
		};
	}

	jQuery.each( [
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	} );




	var rclass = /[\t\r\n\f]/g;

	function getClass( elem ) {
		return elem.getAttribute && elem.getAttribute( "class" ) || "";
	}

	jQuery.fn.extend( {
		addClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
				} );
			}

			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];

				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );

					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}

			return this;
		},

		removeClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
				} );
			}

			if ( !arguments.length ) {
				return this.attr( "class", "" );
			}

			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];

				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );

					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );

					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {

							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}

			return this;
		},

		toggleClass: function( value, stateVal ) {
			var type = typeof value;

			if ( typeof stateVal === "boolean" && type === "string" ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( i ) {
					jQuery( this ).toggleClass(
						value.call( this, i, getClass( this ), stateVal ),
						stateVal
					);
				} );
			}

			return this.each( function() {
				var className, i, self, classNames;

				if ( type === "string" ) {

					// Toggle individual class names
					i = 0;
					self = jQuery( this );
					classNames = value.match( rnotwhite ) || [];

					while ( ( className = classNames[ i++ ] ) ) {

						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}

				// Toggle whole class name
				} else if ( value === undefined || type === "boolean" ) {
					className = getClass( this );
					if ( className ) {

						// Store className if set
						dataPriv.set( this, "__className__", className );
					}

					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if ( this.setAttribute ) {
						this.setAttribute( "class",
							className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
						);
					}
				}
			} );
		},

		hasClass: function( selector ) {
			var className, elem,
				i = 0;

			className = " " + selector + " ";
			while ( ( elem = this[ i++ ] ) ) {
				if ( elem.nodeType === 1 &&
					( " " + getClass( elem ) + " " ).replace( rclass, " " )
						.indexOf( className ) > -1
				) {
					return true;
				}
			}

			return false;
		}
	} );




	var rreturn = /\r/g;

	jQuery.fn.extend( {
		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[ 0 ];

			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] ||
						jQuery.valHooks[ elem.nodeName.toLowerCase() ];

					if ( hooks &&
						"get" in hooks &&
						( ret = hooks.get( elem, "value" ) ) !== undefined
					) {
						return ret;
					}

					ret = elem.value;

					return typeof ret === "string" ?

						// Handle most common string cases
						ret.replace( rreturn, "" ) :

						// Handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction( value );

			return this.each( function( i ) {
				var val;

				if ( this.nodeType !== 1 ) {
					return;
				}

				if ( isFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";

				} else if ( typeof val === "number" ) {
					val += "";

				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					} );
				}

				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

				// If set returns undefined, fall back to normal setting
				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			} );
		}
	} );

	jQuery.extend( {
		valHooks: {
			option: {
				get: function( elem ) {

					// Support: IE<11
					// option.value not trimmed (#14858)
					return jQuery.trim( elem.value );
				}
			},
			select: {
				get: function( elem ) {
					var value, option,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one" || index < 0,
						values = one ? null : [],
						max = one ? index + 1 : options.length,
						i = index < 0 ?
							max :
							one ? index : 0;

					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];

						// IE8-9 doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&

								// Don't return options that are disabled or in a disabled optgroup
								( support.optDisabled ?
									!option.disabled : option.getAttribute( "disabled" ) === null ) &&
								( !option.parentNode.disabled ||
									!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

							// Get the specific value for the option
							value = jQuery( option ).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				},

				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;

					while ( i-- ) {
						option = options[ i ];
						if ( option.selected =
								jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
						) {
							optionSet = true;
						}
					}

					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	} );

	// Radios and checkboxes getter/setter
	jQuery.each( [ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
			};
		}
	} );




	// Return jQuery for attributes-only inclusion


	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

	jQuery.extend( jQuery.event, {

		trigger: function( event, data, elem, onlyHandlers ) {

			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

			cur = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}

			if ( type.indexOf( "." ) > -1 ) {

				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split( "." );
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf( ":" ) < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join( "." );
			event.rnamespace = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
				null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );

			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === ( elem.ownerDocument || document ) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;

				// jQuery handler
				handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
					dataPriv.get( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}

				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {

				if ( ( !special._default ||
					special._default.apply( eventPath.pop(), data ) === false ) &&
					acceptData( elem ) ) {

					// Call a native DOM method on the target with the same name name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];

						if ( tmp ) {
							elem[ ontype ] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[ type ]();
						jQuery.event.triggered = undefined;

						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		// Piggyback on a donor event to simulate a different one
		simulate: function( type, elem, event ) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true

					// Previously, `originalEvent: {}` was set here, so stopPropagation call
					// would not be triggered on donor event, since in our own
					// jQuery.event.stopPropagation function we had a check for existence of
					// originalEvent.stopPropagation method, so, consequently it would be a noop.
					//
					// But now, this "simulate" function is used only for events
					// for which stopPropagation() is noop, so there is no need for that anymore.
					//
					// For the 1.x branch though, guard for "click" and "submit"
					// events is still used, but was moved to jQuery.event.stopPropagation function
					// because `originalEvent` should point to the original event for the constancy
					// with other events and for more focused logic
				}
			);

			jQuery.event.trigger( e, null, elem );

			if ( e.isDefaultPrevented() ) {
				event.preventDefault();
			}
		}

	} );

	jQuery.fn.extend( {

		trigger: function( type, data ) {
			return this.each( function() {
				jQuery.event.trigger( type, data, this );
			} );
		},
		triggerHandler: function( type, data ) {
			var elem = this[ 0 ];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	} );


	jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
		function( i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );

	jQuery.fn.extend( {
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		}
	} );




	support.focusin = "onfocusin" in window;


	// Support: Firefox
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome, Safari
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
	if ( !support.focusin ) {
		jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
			};

			jQuery.event.special[ fix ] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix );

					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix ) - 1;

					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						dataPriv.remove( doc, fix );

					} else {
						dataPriv.access( doc, fix, attaches );
					}
				}
			};
		} );
	}
	var location = window.location;

	var nonce = jQuery.now();

	var rquery = ( /\?/ );



	// Support: Android 2.3
	// Workaround failure to string-cast null input
	jQuery.parseJSON = function( data ) {
		return JSON.parse( data + "" );
	};


	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	};


	var
		rhash = /#.*$/,
		rts = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,

		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},

		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},

		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),

		// Anchor tag for parsing the document origin
		originAnchor = document.createElement( "a" );
		originAnchor.href = location.href;

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {

		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {

			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

			if ( jQuery.isFunction( func ) ) {

				// For each dataType in the dataTypeExpression
				while ( ( dataType = dataTypes[ i++ ] ) ) {

					// Prepend if requested
					if ( dataType[ 0 ] === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

					// Otherwise append
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

		var inspected = {},
			seekingTransport = ( structure === transports );

		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			} );
			return selected;
		}

		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}

		return target;
	}

	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {

		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
			}
		}

		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {

			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}

			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}

	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},

			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while ( current ) {

			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}

			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}

			prev = current;
			current = dataTypes.shift();

			if ( current ) {

			// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {

					current = prev;

				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {

					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];

					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {

							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {

								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {

									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];

									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if ( conv !== true ) {

						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s.throws ) {
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend( {

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test( location.protocol ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?

				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},

		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),

		// Main method
		ajax: function( url, options ) {

			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var transport,

				// URL without anti-cache param
				cacheURL,

				// Response headers
				responseHeadersString,
				responseHeaders,

				// timeout handle
				timeoutTimer,

				// Url cleanup var
				urlAnchor,

				// To know if global events are to be dispatched
				fireGlobals,

				// Loop variable
				i,

				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),

				// Callbacks context
				callbackContext = s.context || s,

				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
						jQuery( callbackContext ) :
						jQuery.event,

				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),

				// Status-dependent callbacks
				statusCode = s.statusCode || {},

				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},

				// The jqXHR state
				state = 0,

				// Default abort message
				strAbort = "canceled",

				// Fake xhr
				jqXHR = {
					readyState: 0,

					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( state === 2 ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},

					// Raw string
					getAllResponseHeaders: function() {
						return state === 2 ? responseHeadersString : null;
					},

					// Caches the header
					setRequestHeader: function( name, value ) {
						var lname = name.toLowerCase();
						if ( !state ) {
							name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},

					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( !state ) {
							s.mimeType = type;
						}
						return this;
					},

					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( state < 2 ) {
								for ( code in map ) {

									// Lazy-add the new callback in a way that preserves old ones
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							} else {

								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							}
						}
						return this;
					},

					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};

			// Attach deferreds
			deferred.promise( jqXHR ).complete = completeDeferred.add;
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;

			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || location.href ) + "" ).replace( rhash, "" )
				.replace( rprotocol, location.protocol + "//" );

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

			// A cross-domain request is in order when the origin doesn't match the current origin.
			if ( s.crossDomain == null ) {
				urlAnchor = document.createElement( "a" );

				// Support: IE8-11+
				// IE throws exception if url is malformed, e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;

					// Support: IE8-11+
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
						urlAnchor.protocol + "//" + urlAnchor.host;
				} catch ( e ) {

					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}

			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}

			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

			// If request was aborted inside a prefilter, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			cacheURL = s.url;

			// More options handling for requests with no content
			if ( !s.hasContent ) {

				// If data is available, append data to url
				if ( s.data ) {
					cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add anti-cache in url if needed
				if ( s.cache === false ) {
					s.url = rts.test( cacheURL ) ?

						// If there is already a '_' parameter, set its value
						cacheURL.replace( rts, "$1_=" + nonce++ ) :

						// Otherwise add one to the end
						cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
				}
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}

			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);

			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}

			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

				// Abort if not done already and return
				return jqXHR.abort();
			}

			// Aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			for ( i in { success: 1, error: 1, complete: 1 } ) {
				jqXHR[ i ]( s[ i ] );
			}

			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}

				// If request was aborted inside ajaxSend, stop there
				if ( state === 2 ) {
					return jqXHR;
				}

				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}

				try {
					state = 1;
					transport.send( requestHeaders, done );
				} catch ( e ) {

					// Propagate exception as error if not done
					if ( state < 2 ) {
						done( -1, e );

					// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}

			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;

				// Called once
				if ( state === 2 ) {
					return;
				}

				// State is "done" now
				state = 2;

				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );

				// If successful, handle type chaining
				if ( isSuccess ) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}

					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";

					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";

					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {

					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";

				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}

				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;

				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}

				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}

			return jqXHR;
		},

		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},

		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	} );

	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {

			// Shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			// The url can be an options object (which then must have .url)
			return jQuery.ajax( jQuery.extend( {
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject( url ) && url ) );
		};
	} );


	jQuery._evalUrl = function( url ) {
		return jQuery.ajax( {
			url: url,

			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		} );
	};


	jQuery.fn.extend( {
		wrapAll: function( html ) {
			var wrap;

			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapAll( html.call( this, i ) );
				} );
			}

			if ( this[ 0 ] ) {

				// The elements to wrap the target around
				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}

				wrap.map( function() {
					var elem = this;

					while ( elem.firstElementChild ) {
						elem = elem.firstElementChild;
					}

					return elem;
				} ).append( this );
			}

			return this;
		},

		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapInner( html.call( this, i ) );
				} );
			}

			return this.each( function() {
				var self = jQuery( this ),
					contents = self.contents();

				if ( contents.length ) {
					contents.wrapAll( html );

				} else {
					self.append( html );
				}
			} );
		},

		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );

			return this.each( function( i ) {
				jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
			} );
		},

		unwrap: function() {
			return this.parent().each( function() {
				if ( !jQuery.nodeName( this, "body" ) ) {
					jQuery( this ).replaceWith( this.childNodes );
				}
			} ).end();
		}
	} );


	jQuery.expr.filters.hidden = function( elem ) {
		return !jQuery.expr.filters.visible( elem );
	};
	jQuery.expr.filters.visible = function( elem ) {

		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		// Use OR instead of AND as the element is not visible if either is true
		// See tickets #10406 and #13132
		return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
	};




	var r20 = /%20/g,
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams( prefix, obj, traditional, add ) {
		var name;

		if ( jQuery.isArray( obj ) ) {

			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {

					// Treat each array item as a scalar.
					add( prefix, v );

				} else {

					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
						v,
						traditional,
						add
					);
				}
			} );

		} else if ( !traditional && jQuery.type( obj ) === "object" ) {

			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}

		} else {

			// Serialize scalar item.
			add( prefix, obj );
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, value ) {

				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );

		} else {

			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	};

	jQuery.fn.extend( {
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map( function() {

				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			} )
			.filter( function() {
				var type = this.type;

				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} )
			.map( function( i, elem ) {
				var val = jQuery( this ).val();

				return val == null ?
					null :
					jQuery.isArray( val ) ?
						jQuery.map( val, function( val ) {
							return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
						} ) :
						{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );


	jQuery.ajaxSettings.xhr = function() {
		try {
			return new window.XMLHttpRequest();
		} catch ( e ) {}
	};

	var xhrSuccessStatus = {

			// File protocol always yields status code 0, assume 200
			0: 200,

			// Support: IE9
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();

	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	support.ajax = xhrSupported = !!xhrSupported;

	jQuery.ajaxTransport( function( options ) {
		var callback, errorCallback;

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( support.cors || xhrSupported && !options.crossDomain ) {
			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr();

					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {
						xhr.setRequestHeader( i, headers[ i ] );
					}

					// Callback
					callback = function( type ) {
						return function() {
							if ( callback ) {
								callback = errorCallback = xhr.onload =
									xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

								if ( type === "abort" ) {
									xhr.abort();
								} else if ( type === "error" ) {

									// Support: IE9
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if ( typeof xhr.status !== "number" ) {
										complete( 0, "error" );
									} else {
										complete(

											// File: protocol always yields status 0; see #8605, #14207
											xhr.status,
											xhr.statusText
										);
									}
								} else {
									complete(
										xhrSuccessStatus[ xhr.status ] || xhr.status,
										xhr.statusText,

										// Support: IE9 only
										// IE9 has no XHR2 but throws on binary (trac-11426)
										// For XHR2 non-text, let the caller handle it (gh-2498)
										( xhr.responseType || "text" ) !== "text"  ||
										typeof xhr.responseText !== "string" ?
											{ binary: xhr.response } :
											{ text: xhr.responseText },
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};

					// Listen to events
					xhr.onload = callback();
					errorCallback = xhr.onerror = callback( "error" );

					// Support: IE9
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if ( xhr.onabort !== undefined ) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function() {

							// Check readyState before timeout as it changes
							if ( xhr.readyState === 4 ) {

								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout( function() {
									if ( callback ) {
										errorCallback();
									}
								} );
							}
						};
					}

					// Create the abort callback
					callback = callback( "abort" );

					try {

						// Do send the request (this may raise an exception)
						xhr.send( options.hasContent && options.data || null );
					} catch ( e ) {

						// #14683: Only rethrow if this hasn't been notified as an error yet
						if ( callback ) {
							throw e;
						}
					}
				},

				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );




	// Install script dataType
	jQuery.ajaxSetup( {
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	} );

	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
		}
	} );

	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {

		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {
			var script, callback;
			return {
				send: function( _, complete ) {
					script = jQuery( "<script>" ).prop( {
						charset: s.scriptCharset,
						src: s.url
					} ).on(
						"load error",
						callback = function( evt ) {
							script.remove();
							callback = null;
							if ( evt ) {
								complete( evt.type === "error" ? 404 : 200, evt.type );
							}
						}
					);

					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild( script[ 0 ] );
				},
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );




	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup( {
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	} );

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" &&
					( s.contentType || "" )
						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
					rjsonp.test( s.data ) && "data"
			);

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;

			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters[ "script json" ] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};

			// Force json dataType
			s.dataTypes[ 0 ] = "json";

			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always( function() {

				// If previous value didn't exist - remove it
				if ( overwritten === undefined ) {
					jQuery( window ).removeProp( callbackName );

				// Otherwise restore preexisting value
				} else {
					window[ callbackName ] = overwritten;
				}

				// Save back as free
				if ( s[ callbackName ] ) {

					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// Save the callback name for future use
					oldCallbacks.push( callbackName );
				}

				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}

				responseContainer = overwritten = undefined;
			} );

			// Delegate to script
			return "script";
		}
	} );




	// Support: Safari 8+
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = ( function() {
		var body = document.implementation.createHTMLDocument( "" ).body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	} )();


	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		context = context || ( support.createHTMLDocument ?
			document.implementation.createHTMLDocument( "" ) :
			document );

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[ 1 ] ) ];
		}

		parsed = buildFragment( [ data ], context, scripts );

		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	};


	// Keep a copy of the old load method
	var _load = jQuery.fn.load;

	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );
		}

		var selector, type, response,
			self = this,
			off = url.indexOf( " " );

		if ( off > -1 ) {
			selector = jQuery.trim( url.slice( off ) );
			url = url.slice( 0, off );
		}

		// If it's a function
		if ( jQuery.isFunction( params ) ) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,

				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {

				// Save response for use in complete callback
				response = arguments;

				self.html( selector ?

					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

					// Otherwise use the full result
					responseText );

			// If the request succeeds, this function gets "data", "status", "jqXHR"
			// but they are ignored because response was set above.
			// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( self, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}

		return this;
	};




	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( [
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	} );




	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep( jQuery.timers, function( fn ) {
			return elem === fn.elem;
		} ).length;
	};




	/**
	 * Gets a window from an element
	 */
	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
	}

	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};

			// Set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;

			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}

			if ( jQuery.isFunction( options ) ) {

				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
			}

			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}

			if ( "using" in options ) {
				options.using.call( elem, props );

			} else {
				curElem.css( props );
			}
		}
	};

	jQuery.fn.extend( {
		offset: function( options ) {
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each( function( i ) {
						jQuery.offset.setOffset( this, options, i );
					} );
			}

			var docElem, win,
				elem = this[ 0 ],
				box = { top: 0, left: 0 },
				doc = elem && elem.ownerDocument;

			if ( !doc ) {
				return;
			}

			docElem = doc.documentElement;

			// Make sure it's not a disconnected DOM node
			if ( !jQuery.contains( docElem, elem ) ) {
				return box;
			}

			box = elem.getBoundingClientRect();
			win = getWindow( doc );
			return {
				top: box.top + win.pageYOffset - docElem.clientTop,
				left: box.left + win.pageXOffset - docElem.clientLeft
			};
		},

		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}

			var offsetParent, offset,
				elem = this[ 0 ],
				parentOffset = { top: 0, left: 0 };

			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if ( jQuery.css( elem, "position" ) === "fixed" ) {

				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();

			} else {

				// Get *real* offsetParent
				offsetParent = this.offsetParent();

				// Get correct offsets
				offset = this.offset();
				if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
					parentOffset = offsetParent.offset();
				}

				// Add offsetParent borders
				parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},

		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function() {
			return this.map( function() {
				var offsetParent = this.offsetParent;

				while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || documentElement;
			} );
		}
	} );

	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = "pageYOffset" === prop;

		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
				var win = getWindow( elem );

				if ( val === undefined ) {
					return win ? win[ prop ] : elem[ method ];
				}

				if ( win ) {
					win.scrollTo(
						!top ? val : win.pageXOffset,
						top ? val : win.pageYOffset
					);

				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length );
		};
	} );

	// Support: Safari<7-8+, Chrome<37-44+
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each( [ "top", "left" ], function( i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );

					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	} );


	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
			function( defaultExtra, funcName ) {

			// Margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

				return access( this, function( elem, type, value ) {
					var doc;

					if ( jQuery.isWindow( elem ) ) {

						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement[ "client" + name ];
					}

					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}

					return value === undefined ?

						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :

						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable, null );
			};
		} );
	} );


	jQuery.fn.extend( {

		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},

		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {

			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off( selector, "**" ) :
				this.off( types, selector || "**", fn );
		},
		size: function() {
			return this.length;
		}
	} );

	jQuery.fn.andSelf = jQuery.fn.addBack;




	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.

	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}



	var

		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

		// Map over the $ in case of overwrite
		_$ = window.$;

	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( !noGlobal ) {
		window.jQuery = window.$ = jQuery;
	}

	return jQuery;
	}));


/***/ },
/* 2 */
/***/ function(module, exports) {

	//! moment.js
	//! version : 2.11.2
	//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
	//! license : MIT
	//! momentjs.com
	!function(a,b){"object"==typeof exports&&"undefined"!=typeof module?module.exports=b():"function"==typeof define&&define.amd?define(b):a.moment=b()}(this,function(){"use strict";function a(){return Uc.apply(null,arguments)}function b(a){Uc=a}function c(a){return"[object Array]"===Object.prototype.toString.call(a)}function d(a){return a instanceof Date||"[object Date]"===Object.prototype.toString.call(a)}function e(a,b){var c,d=[];for(c=0;c<a.length;++c)d.push(b(a[c],c));return d}function f(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function g(a,b){for(var c in b)f(b,c)&&(a[c]=b[c]);return f(b,"toString")&&(a.toString=b.toString),f(b,"valueOf")&&(a.valueOf=b.valueOf),a}function h(a,b,c,d){return Da(a,b,c,d,!0).utc()}function i(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function j(a){return null==a._pf&&(a._pf=i()),a._pf}function k(a){if(null==a._isValid){var b=j(a);a._isValid=!(isNaN(a._d.getTime())||!(b.overflow<0)||b.empty||b.invalidMonth||b.invalidWeekday||b.nullInput||b.invalidFormat||b.userInvalidated),a._strict&&(a._isValid=a._isValid&&0===b.charsLeftOver&&0===b.unusedTokens.length&&void 0===b.bigHour)}return a._isValid}function l(a){var b=h(NaN);return null!=a?g(j(b),a):j(b).userInvalidated=!0,b}function m(a){return void 0===a}function n(a,b){var c,d,e;if(m(b._isAMomentObject)||(a._isAMomentObject=b._isAMomentObject),m(b._i)||(a._i=b._i),m(b._f)||(a._f=b._f),m(b._l)||(a._l=b._l),m(b._strict)||(a._strict=b._strict),m(b._tzm)||(a._tzm=b._tzm),m(b._isUTC)||(a._isUTC=b._isUTC),m(b._offset)||(a._offset=b._offset),m(b._pf)||(a._pf=j(b)),m(b._locale)||(a._locale=b._locale),Wc.length>0)for(c in Wc)d=Wc[c],e=b[d],m(e)||(a[d]=e);return a}function o(b){n(this,b),this._d=new Date(null!=b._d?b._d.getTime():NaN),Xc===!1&&(Xc=!0,a.updateOffset(this),Xc=!1)}function p(a){return a instanceof o||null!=a&&null!=a._isAMomentObject}function q(a){return 0>a?Math.ceil(a):Math.floor(a)}function r(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=q(b)),c}function s(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;e>d;d++)(c&&a[d]!==b[d]||!c&&r(a[d])!==r(b[d]))&&g++;return g+f}function t(){}function u(a){return a?a.toLowerCase().replace("_","-"):a}function v(a){for(var b,c,d,e,f=0;f<a.length;){for(e=u(a[f]).split("-"),b=e.length,c=u(a[f+1]),c=c?c.split("-"):null;b>0;){if(d=w(e.slice(0,b).join("-")))return d;if(c&&c.length>=b&&s(e,c,!0)>=b-1)break;b--}f++}return null}function w(a){var b=null;if(!Yc[a]&&"undefined"!=typeof module&&module&&module.exports)try{b=Vc._abbr,require("./locale/"+a),x(b)}catch(c){}return Yc[a]}function x(a,b){var c;return a&&(c=m(b)?z(a):y(a,b),c&&(Vc=c)),Vc._abbr}function y(a,b){return null!==b?(b.abbr=a,Yc[a]=Yc[a]||new t,Yc[a].set(b),x(a),Yc[a]):(delete Yc[a],null)}function z(a){var b;if(a&&a._locale&&a._locale._abbr&&(a=a._locale._abbr),!a)return Vc;if(!c(a)){if(b=w(a))return b;a=[a]}return v(a)}function A(a,b){var c=a.toLowerCase();Zc[c]=Zc[c+"s"]=Zc[b]=a}function B(a){return"string"==typeof a?Zc[a]||Zc[a.toLowerCase()]:void 0}function C(a){var b,c,d={};for(c in a)f(a,c)&&(b=B(c),b&&(d[b]=a[c]));return d}function D(a){return a instanceof Function||"[object Function]"===Object.prototype.toString.call(a)}function E(b,c){return function(d){return null!=d?(G(this,b,d),a.updateOffset(this,c),this):F(this,b)}}function F(a,b){return a.isValid()?a._d["get"+(a._isUTC?"UTC":"")+b]():NaN}function G(a,b,c){a.isValid()&&a._d["set"+(a._isUTC?"UTC":"")+b](c)}function H(a,b){var c;if("object"==typeof a)for(c in a)this.set(c,a[c]);else if(a=B(a),D(this[a]))return this[a](b);return this}function I(a,b,c){var d=""+Math.abs(a),e=b-d.length,f=a>=0;return(f?c?"+":"":"-")+Math.pow(10,Math.max(0,e)).toString().substr(1)+d}function J(a,b,c,d){var e=d;"string"==typeof d&&(e=function(){return this[d]()}),a&&(bd[a]=e),b&&(bd[b[0]]=function(){return I(e.apply(this,arguments),b[1],b[2])}),c&&(bd[c]=function(){return this.localeData().ordinal(e.apply(this,arguments),a)})}function K(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function L(a){var b,c,d=a.match($c);for(b=0,c=d.length;c>b;b++)bd[d[b]]?d[b]=bd[d[b]]:d[b]=K(d[b]);return function(e){var f="";for(b=0;c>b;b++)f+=d[b]instanceof Function?d[b].call(e,a):d[b];return f}}function M(a,b){return a.isValid()?(b=N(b,a.localeData()),ad[b]=ad[b]||L(b),ad[b](a)):a.localeData().invalidDate()}function N(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(_c.lastIndex=0;d>=0&&_c.test(a);)a=a.replace(_c,c),_c.lastIndex=0,d-=1;return a}function O(a,b,c){td[a]=D(b)?b:function(a,d){return a&&c?c:b}}function P(a,b){return f(td,a)?td[a](b._strict,b._locale):new RegExp(Q(a))}function Q(a){return R(a.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e}))}function R(a){return a.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function S(a,b){var c,d=b;for("string"==typeof a&&(a=[a]),"number"==typeof b&&(d=function(a,c){c[b]=r(a)}),c=0;c<a.length;c++)ud[a[c]]=d}function T(a,b){S(a,function(a,c,d,e){d._w=d._w||{},b(a,d._w,d,e)})}function U(a,b,c){null!=b&&f(ud,a)&&ud[a](b,c._a,c,a)}function V(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function W(a,b){return c(this._months)?this._months[a.month()]:this._months[Ed.test(b)?"format":"standalone"][a.month()]}function X(a,b){return c(this._monthsShort)?this._monthsShort[a.month()]:this._monthsShort[Ed.test(b)?"format":"standalone"][a.month()]}function Y(a,b,c){var d,e,f;for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),d=0;12>d;d++){if(e=h([2e3,d]),c&&!this._longMonthsParse[d]&&(this._longMonthsParse[d]=new RegExp("^"+this.months(e,"").replace(".","")+"$","i"),this._shortMonthsParse[d]=new RegExp("^"+this.monthsShort(e,"").replace(".","")+"$","i")),c||this._monthsParse[d]||(f="^"+this.months(e,"")+"|^"+this.monthsShort(e,""),this._monthsParse[d]=new RegExp(f.replace(".",""),"i")),c&&"MMMM"===b&&this._longMonthsParse[d].test(a))return d;if(c&&"MMM"===b&&this._shortMonthsParse[d].test(a))return d;if(!c&&this._monthsParse[d].test(a))return d}}function Z(a,b){var c;return a.isValid()?"string"==typeof b&&(b=a.localeData().monthsParse(b),"number"!=typeof b)?a:(c=Math.min(a.date(),V(a.year(),b)),a._d["set"+(a._isUTC?"UTC":"")+"Month"](b,c),a):a}function $(b){return null!=b?(Z(this,b),a.updateOffset(this,!0),this):F(this,"Month")}function _(){return V(this.year(),this.month())}function aa(a){return this._monthsParseExact?(f(this,"_monthsRegex")||ca.call(this),a?this._monthsShortStrictRegex:this._monthsShortRegex):this._monthsShortStrictRegex&&a?this._monthsShortStrictRegex:this._monthsShortRegex}function ba(a){return this._monthsParseExact?(f(this,"_monthsRegex")||ca.call(this),a?this._monthsStrictRegex:this._monthsRegex):this._monthsStrictRegex&&a?this._monthsStrictRegex:this._monthsRegex}function ca(){function a(a,b){return b.length-a.length}var b,c,d=[],e=[],f=[];for(b=0;12>b;b++)c=h([2e3,b]),d.push(this.monthsShort(c,"")),e.push(this.months(c,"")),f.push(this.months(c,"")),f.push(this.monthsShort(c,""));for(d.sort(a),e.sort(a),f.sort(a),b=0;12>b;b++)d[b]=R(d[b]),e[b]=R(e[b]),f[b]=R(f[b]);this._monthsRegex=new RegExp("^("+f.join("|")+")","i"),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp("^("+e.join("|")+")$","i"),this._monthsShortStrictRegex=new RegExp("^("+d.join("|")+")$","i")}function da(a){var b,c=a._a;return c&&-2===j(a).overflow&&(b=c[wd]<0||c[wd]>11?wd:c[xd]<1||c[xd]>V(c[vd],c[wd])?xd:c[yd]<0||c[yd]>24||24===c[yd]&&(0!==c[zd]||0!==c[Ad]||0!==c[Bd])?yd:c[zd]<0||c[zd]>59?zd:c[Ad]<0||c[Ad]>59?Ad:c[Bd]<0||c[Bd]>999?Bd:-1,j(a)._overflowDayOfYear&&(vd>b||b>xd)&&(b=xd),j(a)._overflowWeeks&&-1===b&&(b=Cd),j(a)._overflowWeekday&&-1===b&&(b=Dd),j(a).overflow=b),a}function ea(b){a.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+b)}function fa(a,b){var c=!0;return g(function(){return c&&(ea(a+"\nArguments: "+Array.prototype.slice.call(arguments).join(", ")+"\n"+(new Error).stack),c=!1),b.apply(this,arguments)},b)}function ga(a,b){Jd[a]||(ea(b),Jd[a]=!0)}function ha(a){var b,c,d,e,f,g,h=a._i,i=Kd.exec(h)||Ld.exec(h);if(i){for(j(a).iso=!0,b=0,c=Nd.length;c>b;b++)if(Nd[b][1].exec(i[1])){e=Nd[b][0],d=Nd[b][2]!==!1;break}if(null==e)return void(a._isValid=!1);if(i[3]){for(b=0,c=Od.length;c>b;b++)if(Od[b][1].exec(i[3])){f=(i[2]||" ")+Od[b][0];break}if(null==f)return void(a._isValid=!1)}if(!d&&null!=f)return void(a._isValid=!1);if(i[4]){if(!Md.exec(i[4]))return void(a._isValid=!1);g="Z"}a._f=e+(f||"")+(g||""),wa(a)}else a._isValid=!1}function ia(b){var c=Pd.exec(b._i);return null!==c?void(b._d=new Date(+c[1])):(ha(b),void(b._isValid===!1&&(delete b._isValid,a.createFromInputFallback(b))))}function ja(a,b,c,d,e,f,g){var h=new Date(a,b,c,d,e,f,g);return 100>a&&a>=0&&isFinite(h.getFullYear())&&h.setFullYear(a),h}function ka(a){var b=new Date(Date.UTC.apply(null,arguments));return 100>a&&a>=0&&isFinite(b.getUTCFullYear())&&b.setUTCFullYear(a),b}function la(a){return ma(a)?366:365}function ma(a){return a%4===0&&a%100!==0||a%400===0}function na(){return ma(this.year())}function oa(a,b,c){var d=7+b-c,e=(7+ka(a,0,d).getUTCDay()-b)%7;return-e+d-1}function pa(a,b,c,d,e){var f,g,h=(7+c-d)%7,i=oa(a,d,e),j=1+7*(b-1)+h+i;return 0>=j?(f=a-1,g=la(f)+j):j>la(a)?(f=a+1,g=j-la(a)):(f=a,g=j),{year:f,dayOfYear:g}}function qa(a,b,c){var d,e,f=oa(a.year(),b,c),g=Math.floor((a.dayOfYear()-f-1)/7)+1;return 1>g?(e=a.year()-1,d=g+ra(e,b,c)):g>ra(a.year(),b,c)?(d=g-ra(a.year(),b,c),e=a.year()+1):(e=a.year(),d=g),{week:d,year:e}}function ra(a,b,c){var d=oa(a,b,c),e=oa(a+1,b,c);return(la(a)-d+e)/7}function sa(a,b,c){return null!=a?a:null!=b?b:c}function ta(b){var c=new Date(a.now());return b._useUTC?[c.getUTCFullYear(),c.getUTCMonth(),c.getUTCDate()]:[c.getFullYear(),c.getMonth(),c.getDate()]}function ua(a){var b,c,d,e,f=[];if(!a._d){for(d=ta(a),a._w&&null==a._a[xd]&&null==a._a[wd]&&va(a),a._dayOfYear&&(e=sa(a._a[vd],d[vd]),a._dayOfYear>la(e)&&(j(a)._overflowDayOfYear=!0),c=ka(e,0,a._dayOfYear),a._a[wd]=c.getUTCMonth(),a._a[xd]=c.getUTCDate()),b=0;3>b&&null==a._a[b];++b)a._a[b]=f[b]=d[b];for(;7>b;b++)a._a[b]=f[b]=null==a._a[b]?2===b?1:0:a._a[b];24===a._a[yd]&&0===a._a[zd]&&0===a._a[Ad]&&0===a._a[Bd]&&(a._nextDay=!0,a._a[yd]=0),a._d=(a._useUTC?ka:ja).apply(null,f),null!=a._tzm&&a._d.setUTCMinutes(a._d.getUTCMinutes()-a._tzm),a._nextDay&&(a._a[yd]=24)}}function va(a){var b,c,d,e,f,g,h,i;b=a._w,null!=b.GG||null!=b.W||null!=b.E?(f=1,g=4,c=sa(b.GG,a._a[vd],qa(Ea(),1,4).year),d=sa(b.W,1),e=sa(b.E,1),(1>e||e>7)&&(i=!0)):(f=a._locale._week.dow,g=a._locale._week.doy,c=sa(b.gg,a._a[vd],qa(Ea(),f,g).year),d=sa(b.w,1),null!=b.d?(e=b.d,(0>e||e>6)&&(i=!0)):null!=b.e?(e=b.e+f,(b.e<0||b.e>6)&&(i=!0)):e=f),1>d||d>ra(c,f,g)?j(a)._overflowWeeks=!0:null!=i?j(a)._overflowWeekday=!0:(h=pa(c,d,e,f,g),a._a[vd]=h.year,a._dayOfYear=h.dayOfYear)}function wa(b){if(b._f===a.ISO_8601)return void ha(b);b._a=[],j(b).empty=!0;var c,d,e,f,g,h=""+b._i,i=h.length,k=0;for(e=N(b._f,b._locale).match($c)||[],c=0;c<e.length;c++)f=e[c],d=(h.match(P(f,b))||[])[0],d&&(g=h.substr(0,h.indexOf(d)),g.length>0&&j(b).unusedInput.push(g),h=h.slice(h.indexOf(d)+d.length),k+=d.length),bd[f]?(d?j(b).empty=!1:j(b).unusedTokens.push(f),U(f,d,b)):b._strict&&!d&&j(b).unusedTokens.push(f);j(b).charsLeftOver=i-k,h.length>0&&j(b).unusedInput.push(h),j(b).bigHour===!0&&b._a[yd]<=12&&b._a[yd]>0&&(j(b).bigHour=void 0),b._a[yd]=xa(b._locale,b._a[yd],b._meridiem),ua(b),da(b)}function xa(a,b,c){var d;return null==c?b:null!=a.meridiemHour?a.meridiemHour(b,c):null!=a.isPM?(d=a.isPM(c),d&&12>b&&(b+=12),d||12!==b||(b=0),b):b}function ya(a){var b,c,d,e,f;if(0===a._f.length)return j(a).invalidFormat=!0,void(a._d=new Date(NaN));for(e=0;e<a._f.length;e++)f=0,b=n({},a),null!=a._useUTC&&(b._useUTC=a._useUTC),b._f=a._f[e],wa(b),k(b)&&(f+=j(b).charsLeftOver,f+=10*j(b).unusedTokens.length,j(b).score=f,(null==d||d>f)&&(d=f,c=b));g(a,c||b)}function za(a){if(!a._d){var b=C(a._i);a._a=e([b.year,b.month,b.day||b.date,b.hour,b.minute,b.second,b.millisecond],function(a){return a&&parseInt(a,10)}),ua(a)}}function Aa(a){var b=new o(da(Ba(a)));return b._nextDay&&(b.add(1,"d"),b._nextDay=void 0),b}function Ba(a){var b=a._i,e=a._f;return a._locale=a._locale||z(a._l),null===b||void 0===e&&""===b?l({nullInput:!0}):("string"==typeof b&&(a._i=b=a._locale.preparse(b)),p(b)?new o(da(b)):(c(e)?ya(a):e?wa(a):d(b)?a._d=b:Ca(a),k(a)||(a._d=null),a))}function Ca(b){var f=b._i;void 0===f?b._d=new Date(a.now()):d(f)?b._d=new Date(+f):"string"==typeof f?ia(b):c(f)?(b._a=e(f.slice(0),function(a){return parseInt(a,10)}),ua(b)):"object"==typeof f?za(b):"number"==typeof f?b._d=new Date(f):a.createFromInputFallback(b)}function Da(a,b,c,d,e){var f={};return"boolean"==typeof c&&(d=c,c=void 0),f._isAMomentObject=!0,f._useUTC=f._isUTC=e,f._l=c,f._i=a,f._f=b,f._strict=d,Aa(f)}function Ea(a,b,c,d){return Da(a,b,c,d,!1)}function Fa(a,b){var d,e;if(1===b.length&&c(b[0])&&(b=b[0]),!b.length)return Ea();for(d=b[0],e=1;e<b.length;++e)(!b[e].isValid()||b[e][a](d))&&(d=b[e]);return d}function Ga(){var a=[].slice.call(arguments,0);return Fa("isBefore",a)}function Ha(){var a=[].slice.call(arguments,0);return Fa("isAfter",a)}function Ia(a){var b=C(a),c=b.year||0,d=b.quarter||0,e=b.month||0,f=b.week||0,g=b.day||0,h=b.hour||0,i=b.minute||0,j=b.second||0,k=b.millisecond||0;this._milliseconds=+k+1e3*j+6e4*i+36e5*h,this._days=+g+7*f,this._months=+e+3*d+12*c,this._data={},this._locale=z(),this._bubble()}function Ja(a){return a instanceof Ia}function Ka(a,b){J(a,0,0,function(){var a=this.utcOffset(),c="+";return 0>a&&(a=-a,c="-"),c+I(~~(a/60),2)+b+I(~~a%60,2)})}function La(a,b){var c=(b||"").match(a)||[],d=c[c.length-1]||[],e=(d+"").match(Ud)||["-",0,0],f=+(60*e[1])+r(e[2]);return"+"===e[0]?f:-f}function Ma(b,c){var e,f;return c._isUTC?(e=c.clone(),f=(p(b)||d(b)?+b:+Ea(b))-+e,e._d.setTime(+e._d+f),a.updateOffset(e,!1),e):Ea(b).local()}function Na(a){return 15*-Math.round(a._d.getTimezoneOffset()/15)}function Oa(b,c){var d,e=this._offset||0;return this.isValid()?null!=b?("string"==typeof b?b=La(qd,b):Math.abs(b)<16&&(b=60*b),!this._isUTC&&c&&(d=Na(this)),this._offset=b,this._isUTC=!0,null!=d&&this.add(d,"m"),e!==b&&(!c||this._changeInProgress?cb(this,Za(b-e,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,a.updateOffset(this,!0),this._changeInProgress=null)),this):this._isUTC?e:Na(this):null!=b?this:NaN}function Pa(a,b){return null!=a?("string"!=typeof a&&(a=-a),this.utcOffset(a,b),this):-this.utcOffset()}function Qa(a){return this.utcOffset(0,a)}function Ra(a){return this._isUTC&&(this.utcOffset(0,a),this._isUTC=!1,a&&this.subtract(Na(this),"m")),this}function Sa(){return this._tzm?this.utcOffset(this._tzm):"string"==typeof this._i&&this.utcOffset(La(pd,this._i)),this}function Ta(a){return this.isValid()?(a=a?Ea(a).utcOffset():0,(this.utcOffset()-a)%60===0):!1}function Ua(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()}function Va(){if(!m(this._isDSTShifted))return this._isDSTShifted;var a={};if(n(a,this),a=Ba(a),a._a){var b=a._isUTC?h(a._a):Ea(a._a);this._isDSTShifted=this.isValid()&&s(a._a,b.toArray())>0}else this._isDSTShifted=!1;return this._isDSTShifted}function Wa(){return this.isValid()?!this._isUTC:!1}function Xa(){return this.isValid()?this._isUTC:!1}function Ya(){return this.isValid()?this._isUTC&&0===this._offset:!1}function Za(a,b){var c,d,e,g=a,h=null;return Ja(a)?g={ms:a._milliseconds,d:a._days,M:a._months}:"number"==typeof a?(g={},b?g[b]=a:g.milliseconds=a):(h=Vd.exec(a))?(c="-"===h[1]?-1:1,g={y:0,d:r(h[xd])*c,h:r(h[yd])*c,m:r(h[zd])*c,s:r(h[Ad])*c,ms:r(h[Bd])*c}):(h=Wd.exec(a))?(c="-"===h[1]?-1:1,g={y:$a(h[2],c),M:$a(h[3],c),d:$a(h[4],c),h:$a(h[5],c),m:$a(h[6],c),s:$a(h[7],c),w:$a(h[8],c)}):null==g?g={}:"object"==typeof g&&("from"in g||"to"in g)&&(e=ab(Ea(g.from),Ea(g.to)),g={},g.ms=e.milliseconds,g.M=e.months),d=new Ia(g),Ja(a)&&f(a,"_locale")&&(d._locale=a._locale),d}function $a(a,b){var c=a&&parseFloat(a.replace(",","."));return(isNaN(c)?0:c)*b}function _a(a,b){var c={milliseconds:0,months:0};return c.months=b.month()-a.month()+12*(b.year()-a.year()),a.clone().add(c.months,"M").isAfter(b)&&--c.months,c.milliseconds=+b-+a.clone().add(c.months,"M"),c}function ab(a,b){var c;return a.isValid()&&b.isValid()?(b=Ma(b,a),a.isBefore(b)?c=_a(a,b):(c=_a(b,a),c.milliseconds=-c.milliseconds,c.months=-c.months),c):{milliseconds:0,months:0}}function bb(a,b){return function(c,d){var e,f;return null===d||isNaN(+d)||(ga(b,"moment()."+b+"(period, number) is deprecated. Please use moment()."+b+"(number, period)."),f=c,c=d,d=f),c="string"==typeof c?+c:c,e=Za(c,d),cb(this,e,a),this}}function cb(b,c,d,e){var f=c._milliseconds,g=c._days,h=c._months;b.isValid()&&(e=null==e?!0:e,f&&b._d.setTime(+b._d+f*d),g&&G(b,"Date",F(b,"Date")+g*d),h&&Z(b,F(b,"Month")+h*d),e&&a.updateOffset(b,g||h))}function db(a,b){var c=a||Ea(),d=Ma(c,this).startOf("day"),e=this.diff(d,"days",!0),f=-6>e?"sameElse":-1>e?"lastWeek":0>e?"lastDay":1>e?"sameDay":2>e?"nextDay":7>e?"nextWeek":"sameElse",g=b&&(D(b[f])?b[f]():b[f]);return this.format(g||this.localeData().calendar(f,this,Ea(c)))}function eb(){return new o(this)}function fb(a,b){var c=p(a)?a:Ea(a);return this.isValid()&&c.isValid()?(b=B(m(b)?"millisecond":b),"millisecond"===b?+this>+c:+c<+this.clone().startOf(b)):!1}function gb(a,b){var c=p(a)?a:Ea(a);return this.isValid()&&c.isValid()?(b=B(m(b)?"millisecond":b),"millisecond"===b?+c>+this:+this.clone().endOf(b)<+c):!1}function hb(a,b,c){return this.isAfter(a,c)&&this.isBefore(b,c)}function ib(a,b){var c,d=p(a)?a:Ea(a);return this.isValid()&&d.isValid()?(b=B(b||"millisecond"),"millisecond"===b?+this===+d:(c=+d,+this.clone().startOf(b)<=c&&c<=+this.clone().endOf(b))):!1}function jb(a,b){return this.isSame(a,b)||this.isAfter(a,b)}function kb(a,b){return this.isSame(a,b)||this.isBefore(a,b)}function lb(a,b,c){var d,e,f,g;return this.isValid()?(d=Ma(a,this),d.isValid()?(e=6e4*(d.utcOffset()-this.utcOffset()),b=B(b),"year"===b||"month"===b||"quarter"===b?(g=mb(this,d),"quarter"===b?g/=3:"year"===b&&(g/=12)):(f=this-d,g="second"===b?f/1e3:"minute"===b?f/6e4:"hour"===b?f/36e5:"day"===b?(f-e)/864e5:"week"===b?(f-e)/6048e5:f),c?g:q(g)):NaN):NaN}function mb(a,b){var c,d,e=12*(b.year()-a.year())+(b.month()-a.month()),f=a.clone().add(e,"months");return 0>b-f?(c=a.clone().add(e-1,"months"),d=(b-f)/(f-c)):(c=a.clone().add(e+1,"months"),d=(b-f)/(c-f)),-(e+d)}function nb(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")}function ob(){var a=this.clone().utc();return 0<a.year()&&a.year()<=9999?D(Date.prototype.toISOString)?this.toDate().toISOString():M(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):M(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")}function pb(b){var c=M(this,b||a.defaultFormat);return this.localeData().postformat(c)}function qb(a,b){return this.isValid()&&(p(a)&&a.isValid()||Ea(a).isValid())?Za({to:this,from:a}).locale(this.locale()).humanize(!b):this.localeData().invalidDate()}function rb(a){return this.from(Ea(),a)}function sb(a,b){return this.isValid()&&(p(a)&&a.isValid()||Ea(a).isValid())?Za({from:this,to:a}).locale(this.locale()).humanize(!b):this.localeData().invalidDate()}function tb(a){return this.to(Ea(),a)}function ub(a){var b;return void 0===a?this._locale._abbr:(b=z(a),null!=b&&(this._locale=b),this)}function vb(){return this._locale}function wb(a){switch(a=B(a)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a&&this.weekday(0),"isoWeek"===a&&this.isoWeekday(1),"quarter"===a&&this.month(3*Math.floor(this.month()/3)),this}function xb(a){return a=B(a),void 0===a||"millisecond"===a?this:this.startOf(a).add(1,"isoWeek"===a?"week":a).subtract(1,"ms")}function yb(){return+this._d-6e4*(this._offset||0)}function zb(){return Math.floor(+this/1e3)}function Ab(){return this._offset?new Date(+this):this._d}function Bb(){var a=this;return[a.year(),a.month(),a.date(),a.hour(),a.minute(),a.second(),a.millisecond()]}function Cb(){var a=this;return{years:a.year(),months:a.month(),date:a.date(),hours:a.hours(),minutes:a.minutes(),seconds:a.seconds(),milliseconds:a.milliseconds()}}function Db(){return this.isValid()?this.toISOString():"null"}function Eb(){return k(this)}function Fb(){return g({},j(this))}function Gb(){return j(this).overflow}function Hb(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}}function Ib(a,b){J(0,[a,a.length],0,b)}function Jb(a){return Nb.call(this,a,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)}function Kb(a){return Nb.call(this,a,this.isoWeek(),this.isoWeekday(),1,4)}function Lb(){return ra(this.year(),1,4)}function Mb(){var a=this.localeData()._week;return ra(this.year(),a.dow,a.doy)}function Nb(a,b,c,d,e){var f;return null==a?qa(this,d,e).year:(f=ra(a,d,e),b>f&&(b=f),Ob.call(this,a,b,c,d,e))}function Ob(a,b,c,d,e){var f=pa(a,b,c,d,e),g=ka(f.year,0,f.dayOfYear);return this.year(g.getUTCFullYear()),this.month(g.getUTCMonth()),this.date(g.getUTCDate()),this}function Pb(a){return null==a?Math.ceil((this.month()+1)/3):this.month(3*(a-1)+this.month()%3)}function Qb(a){return qa(a,this._week.dow,this._week.doy).week}function Rb(){return this._week.dow}function Sb(){return this._week.doy}function Tb(a){var b=this.localeData().week(this);return null==a?b:this.add(7*(a-b),"d")}function Ub(a){var b=qa(this,1,4).week;return null==a?b:this.add(7*(a-b),"d")}function Vb(a,b){return"string"!=typeof a?a:isNaN(a)?(a=b.weekdaysParse(a),"number"==typeof a?a:null):parseInt(a,10)}function Wb(a,b){return c(this._weekdays)?this._weekdays[a.day()]:this._weekdays[this._weekdays.isFormat.test(b)?"format":"standalone"][a.day()]}function Xb(a){return this._weekdaysShort[a.day()]}function Yb(a){return this._weekdaysMin[a.day()]}function Zb(a,b,c){var d,e,f;for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),d=0;7>d;d++){if(e=Ea([2e3,1]).day(d),c&&!this._fullWeekdaysParse[d]&&(this._fullWeekdaysParse[d]=new RegExp("^"+this.weekdays(e,"").replace(".",".?")+"$","i"),this._shortWeekdaysParse[d]=new RegExp("^"+this.weekdaysShort(e,"").replace(".",".?")+"$","i"),this._minWeekdaysParse[d]=new RegExp("^"+this.weekdaysMin(e,"").replace(".",".?")+"$","i")),this._weekdaysParse[d]||(f="^"+this.weekdays(e,"")+"|^"+this.weekdaysShort(e,"")+"|^"+this.weekdaysMin(e,""),this._weekdaysParse[d]=new RegExp(f.replace(".",""),"i")),c&&"dddd"===b&&this._fullWeekdaysParse[d].test(a))return d;if(c&&"ddd"===b&&this._shortWeekdaysParse[d].test(a))return d;if(c&&"dd"===b&&this._minWeekdaysParse[d].test(a))return d;if(!c&&this._weekdaysParse[d].test(a))return d}}function $b(a){if(!this.isValid())return null!=a?this:NaN;var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=Vb(a,this.localeData()),this.add(a-b,"d")):b}function _b(a){if(!this.isValid())return null!=a?this:NaN;var b=(this.day()+7-this.localeData()._week.dow)%7;return null==a?b:this.add(a-b,"d")}function ac(a){return this.isValid()?null==a?this.day()||7:this.day(this.day()%7?a:a-7):null!=a?this:NaN}function bc(a){var b=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==a?b:this.add(a-b,"d")}function cc(){return this.hours()%12||12}function dc(a,b){J(a,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),b)})}function ec(a,b){return b._meridiemParse}function fc(a){return"p"===(a+"").toLowerCase().charAt(0)}function gc(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"}function hc(a,b){b[Bd]=r(1e3*("0."+a))}function ic(){return this._isUTC?"UTC":""}function jc(){return this._isUTC?"Coordinated Universal Time":""}function kc(a){return Ea(1e3*a)}function lc(){return Ea.apply(null,arguments).parseZone()}function mc(a,b,c){var d=this._calendar[a];return D(d)?d.call(b,c):d}function nc(a){var b=this._longDateFormat[a],c=this._longDateFormat[a.toUpperCase()];return b||!c?b:(this._longDateFormat[a]=c.replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a])}function oc(){return this._invalidDate}function pc(a){return this._ordinal.replace("%d",a)}function qc(a){return a}function rc(a,b,c,d){var e=this._relativeTime[c];return D(e)?e(a,b,c,d):e.replace(/%d/i,a)}function sc(a,b){var c=this._relativeTime[a>0?"future":"past"];return D(c)?c(b):c.replace(/%s/i,b)}function tc(a){var b,c;for(c in a)b=a[c],D(b)?this[c]=b:this["_"+c]=b;this._ordinalParseLenient=new RegExp(this._ordinalParse.source+"|"+/\d{1,2}/.source)}function uc(a,b,c,d){var e=z(),f=h().set(d,b);return e[c](f,a)}function vc(a,b,c,d,e){if("number"==typeof a&&(b=a,a=void 0),a=a||"",null!=b)return uc(a,b,c,e);var f,g=[];for(f=0;d>f;f++)g[f]=uc(a,f,c,e);return g}function wc(a,b){return vc(a,b,"months",12,"month")}function xc(a,b){return vc(a,b,"monthsShort",12,"month")}function yc(a,b){return vc(a,b,"weekdays",7,"day")}function zc(a,b){return vc(a,b,"weekdaysShort",7,"day")}function Ac(a,b){return vc(a,b,"weekdaysMin",7,"day")}function Bc(){var a=this._data;return this._milliseconds=se(this._milliseconds),this._days=se(this._days),this._months=se(this._months),a.milliseconds=se(a.milliseconds),a.seconds=se(a.seconds),a.minutes=se(a.minutes),a.hours=se(a.hours),a.months=se(a.months),a.years=se(a.years),this}function Cc(a,b,c,d){var e=Za(b,c);return a._milliseconds+=d*e._milliseconds,a._days+=d*e._days,a._months+=d*e._months,a._bubble()}function Dc(a,b){return Cc(this,a,b,1)}function Ec(a,b){return Cc(this,a,b,-1)}function Fc(a){return 0>a?Math.floor(a):Math.ceil(a)}function Gc(){var a,b,c,d,e,f=this._milliseconds,g=this._days,h=this._months,i=this._data;return f>=0&&g>=0&&h>=0||0>=f&&0>=g&&0>=h||(f+=864e5*Fc(Ic(h)+g),g=0,h=0),i.milliseconds=f%1e3,a=q(f/1e3),i.seconds=a%60,b=q(a/60),i.minutes=b%60,c=q(b/60),i.hours=c%24,g+=q(c/24),e=q(Hc(g)),h+=e,g-=Fc(Ic(e)),d=q(h/12),h%=12,i.days=g,i.months=h,i.years=d,this}function Hc(a){return 4800*a/146097}function Ic(a){return 146097*a/4800}function Jc(a){var b,c,d=this._milliseconds;if(a=B(a),"month"===a||"year"===a)return b=this._days+d/864e5,c=this._months+Hc(b),"month"===a?c:c/12;switch(b=this._days+Math.round(Ic(this._months)),a){case"week":return b/7+d/6048e5;case"day":return b+d/864e5;case"hour":return 24*b+d/36e5;case"minute":return 1440*b+d/6e4;case"second":return 86400*b+d/1e3;case"millisecond":return Math.floor(864e5*b)+d;default:throw new Error("Unknown unit "+a)}}function Kc(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*r(this._months/12)}function Lc(a){return function(){return this.as(a)}}function Mc(a){return a=B(a),this[a+"s"]()}function Nc(a){return function(){return this._data[a]}}function Oc(){return q(this.days()/7)}function Pc(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function Qc(a,b,c){var d=Za(a).abs(),e=Ie(d.as("s")),f=Ie(d.as("m")),g=Ie(d.as("h")),h=Ie(d.as("d")),i=Ie(d.as("M")),j=Ie(d.as("y")),k=e<Je.s&&["s",e]||1>=f&&["m"]||f<Je.m&&["mm",f]||1>=g&&["h"]||g<Je.h&&["hh",g]||1>=h&&["d"]||h<Je.d&&["dd",h]||1>=i&&["M"]||i<Je.M&&["MM",i]||1>=j&&["y"]||["yy",j];return k[2]=b,k[3]=+a>0,k[4]=c,Pc.apply(null,k)}function Rc(a,b){return void 0===Je[a]?!1:void 0===b?Je[a]:(Je[a]=b,!0)}function Sc(a){var b=this.localeData(),c=Qc(this,!a,b);return a&&(c=b.pastFuture(+this,c)),b.postformat(c)}function Tc(){var a,b,c,d=Ke(this._milliseconds)/1e3,e=Ke(this._days),f=Ke(this._months);a=q(d/60),b=q(a/60),d%=60,a%=60,c=q(f/12),f%=12;var g=c,h=f,i=e,j=b,k=a,l=d,m=this.asSeconds();return m?(0>m?"-":"")+"P"+(g?g+"Y":"")+(h?h+"M":"")+(i?i+"D":"")+(j||k||l?"T":"")+(j?j+"H":"")+(k?k+"M":"")+(l?l+"S":""):"P0D"}var Uc,Vc,Wc=a.momentProperties=[],Xc=!1,Yc={},Zc={},$c=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,_c=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,ad={},bd={},cd=/\d/,dd=/\d\d/,ed=/\d{3}/,fd=/\d{4}/,gd=/[+-]?\d{6}/,hd=/\d\d?/,id=/\d\d\d\d?/,jd=/\d\d\d\d\d\d?/,kd=/\d{1,3}/,ld=/\d{1,4}/,md=/[+-]?\d{1,6}/,nd=/\d+/,od=/[+-]?\d+/,pd=/Z|[+-]\d\d:?\d\d/gi,qd=/Z|[+-]\d\d(?::?\d\d)?/gi,rd=/[+-]?\d+(\.\d{1,3})?/,sd=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,td={},ud={},vd=0,wd=1,xd=2,yd=3,zd=4,Ad=5,Bd=6,Cd=7,Dd=8;J("M",["MM",2],"Mo",function(){return this.month()+1}),J("MMM",0,0,function(a){return this.localeData().monthsShort(this,a)}),J("MMMM",0,0,function(a){return this.localeData().months(this,a)}),A("month","M"),O("M",hd),O("MM",hd,dd),O("MMM",function(a,b){return b.monthsShortRegex(a)}),O("MMMM",function(a,b){return b.monthsRegex(a)}),S(["M","MM"],function(a,b){b[wd]=r(a)-1}),S(["MMM","MMMM"],function(a,b,c,d){var e=c._locale.monthsParse(a,d,c._strict);null!=e?b[wd]=e:j(c).invalidMonth=a});var Ed=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/,Fd="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),Gd="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),Hd=sd,Id=sd,Jd={};a.suppressDeprecationWarnings=!1;var Kd=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/,Ld=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/,Md=/Z|[+-]\d\d(?::?\d\d)?/,Nd=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/]],Od=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],Pd=/^\/?Date\((\-?\d+)/i;a.createFromInputFallback=fa("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.",function(a){a._d=new Date(a._i+(a._useUTC?" UTC":""))}),J("Y",0,0,function(){var a=this.year();return 9999>=a?""+a:"+"+a}),J(0,["YY",2],0,function(){return this.year()%100}),J(0,["YYYY",4],0,"year"),J(0,["YYYYY",5],0,"year"),J(0,["YYYYYY",6,!0],0,"year"),A("year","y"),O("Y",od),O("YY",hd,dd),O("YYYY",ld,fd),O("YYYYY",md,gd),O("YYYYYY",md,gd),S(["YYYYY","YYYYYY"],vd),S("YYYY",function(b,c){c[vd]=2===b.length?a.parseTwoDigitYear(b):r(b)}),S("YY",function(b,c){c[vd]=a.parseTwoDigitYear(b)}),S("Y",function(a,b){b[vd]=parseInt(a,10)}),a.parseTwoDigitYear=function(a){return r(a)+(r(a)>68?1900:2e3)};var Qd=E("FullYear",!1);a.ISO_8601=function(){};var Rd=fa("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(){var a=Ea.apply(null,arguments);return this.isValid()&&a.isValid()?this>a?this:a:l()}),Sd=fa("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(){var a=Ea.apply(null,arguments);return this.isValid()&&a.isValid()?a>this?this:a:l()}),Td=function(){return Date.now?Date.now():+new Date};Ka("Z",":"),Ka("ZZ",""),O("Z",qd),O("ZZ",qd),S(["Z","ZZ"],function(a,b,c){c._useUTC=!0,c._tzm=La(qd,a)});var Ud=/([\+\-]|\d\d)/gi;a.updateOffset=function(){};var Vd=/^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?\d*)?$/,Wd=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;
	Za.fn=Ia.prototype;var Xd=bb(1,"add"),Yd=bb(-1,"subtract");a.defaultFormat="YYYY-MM-DDTHH:mm:ssZ";var Zd=fa("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(a){return void 0===a?this.localeData():this.locale(a)});J(0,["gg",2],0,function(){return this.weekYear()%100}),J(0,["GG",2],0,function(){return this.isoWeekYear()%100}),Ib("gggg","weekYear"),Ib("ggggg","weekYear"),Ib("GGGG","isoWeekYear"),Ib("GGGGG","isoWeekYear"),A("weekYear","gg"),A("isoWeekYear","GG"),O("G",od),O("g",od),O("GG",hd,dd),O("gg",hd,dd),O("GGGG",ld,fd),O("gggg",ld,fd),O("GGGGG",md,gd),O("ggggg",md,gd),T(["gggg","ggggg","GGGG","GGGGG"],function(a,b,c,d){b[d.substr(0,2)]=r(a)}),T(["gg","GG"],function(b,c,d,e){c[e]=a.parseTwoDigitYear(b)}),J("Q",0,"Qo","quarter"),A("quarter","Q"),O("Q",cd),S("Q",function(a,b){b[wd]=3*(r(a)-1)}),J("w",["ww",2],"wo","week"),J("W",["WW",2],"Wo","isoWeek"),A("week","w"),A("isoWeek","W"),O("w",hd),O("ww",hd,dd),O("W",hd),O("WW",hd,dd),T(["w","ww","W","WW"],function(a,b,c,d){b[d.substr(0,1)]=r(a)});var $d={dow:0,doy:6};J("D",["DD",2],"Do","date"),A("date","D"),O("D",hd),O("DD",hd,dd),O("Do",function(a,b){return a?b._ordinalParse:b._ordinalParseLenient}),S(["D","DD"],xd),S("Do",function(a,b){b[xd]=r(a.match(hd)[0],10)});var _d=E("Date",!0);J("d",0,"do","day"),J("dd",0,0,function(a){return this.localeData().weekdaysMin(this,a)}),J("ddd",0,0,function(a){return this.localeData().weekdaysShort(this,a)}),J("dddd",0,0,function(a){return this.localeData().weekdays(this,a)}),J("e",0,0,"weekday"),J("E",0,0,"isoWeekday"),A("day","d"),A("weekday","e"),A("isoWeekday","E"),O("d",hd),O("e",hd),O("E",hd),O("dd",sd),O("ddd",sd),O("dddd",sd),T(["dd","ddd","dddd"],function(a,b,c,d){var e=c._locale.weekdaysParse(a,d,c._strict);null!=e?b.d=e:j(c).invalidWeekday=a}),T(["d","e","E"],function(a,b,c,d){b[d]=r(a)});var ae="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),be="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),ce="Su_Mo_Tu_We_Th_Fr_Sa".split("_");J("DDD",["DDDD",3],"DDDo","dayOfYear"),A("dayOfYear","DDD"),O("DDD",kd),O("DDDD",ed),S(["DDD","DDDD"],function(a,b,c){c._dayOfYear=r(a)}),J("H",["HH",2],0,"hour"),J("h",["hh",2],0,cc),J("hmm",0,0,function(){return""+cc.apply(this)+I(this.minutes(),2)}),J("hmmss",0,0,function(){return""+cc.apply(this)+I(this.minutes(),2)+I(this.seconds(),2)}),J("Hmm",0,0,function(){return""+this.hours()+I(this.minutes(),2)}),J("Hmmss",0,0,function(){return""+this.hours()+I(this.minutes(),2)+I(this.seconds(),2)}),dc("a",!0),dc("A",!1),A("hour","h"),O("a",ec),O("A",ec),O("H",hd),O("h",hd),O("HH",hd,dd),O("hh",hd,dd),O("hmm",id),O("hmmss",jd),O("Hmm",id),O("Hmmss",jd),S(["H","HH"],yd),S(["a","A"],function(a,b,c){c._isPm=c._locale.isPM(a),c._meridiem=a}),S(["h","hh"],function(a,b,c){b[yd]=r(a),j(c).bigHour=!0}),S("hmm",function(a,b,c){var d=a.length-2;b[yd]=r(a.substr(0,d)),b[zd]=r(a.substr(d)),j(c).bigHour=!0}),S("hmmss",function(a,b,c){var d=a.length-4,e=a.length-2;b[yd]=r(a.substr(0,d)),b[zd]=r(a.substr(d,2)),b[Ad]=r(a.substr(e)),j(c).bigHour=!0}),S("Hmm",function(a,b,c){var d=a.length-2;b[yd]=r(a.substr(0,d)),b[zd]=r(a.substr(d))}),S("Hmmss",function(a,b,c){var d=a.length-4,e=a.length-2;b[yd]=r(a.substr(0,d)),b[zd]=r(a.substr(d,2)),b[Ad]=r(a.substr(e))});var de=/[ap]\.?m?\.?/i,ee=E("Hours",!0);J("m",["mm",2],0,"minute"),A("minute","m"),O("m",hd),O("mm",hd,dd),S(["m","mm"],zd);var fe=E("Minutes",!1);J("s",["ss",2],0,"second"),A("second","s"),O("s",hd),O("ss",hd,dd),S(["s","ss"],Ad);var ge=E("Seconds",!1);J("S",0,0,function(){return~~(this.millisecond()/100)}),J(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),J(0,["SSS",3],0,"millisecond"),J(0,["SSSS",4],0,function(){return 10*this.millisecond()}),J(0,["SSSSS",5],0,function(){return 100*this.millisecond()}),J(0,["SSSSSS",6],0,function(){return 1e3*this.millisecond()}),J(0,["SSSSSSS",7],0,function(){return 1e4*this.millisecond()}),J(0,["SSSSSSSS",8],0,function(){return 1e5*this.millisecond()}),J(0,["SSSSSSSSS",9],0,function(){return 1e6*this.millisecond()}),A("millisecond","ms"),O("S",kd,cd),O("SS",kd,dd),O("SSS",kd,ed);var he;for(he="SSSS";he.length<=9;he+="S")O(he,nd);for(he="S";he.length<=9;he+="S")S(he,hc);var ie=E("Milliseconds",!1);J("z",0,0,"zoneAbbr"),J("zz",0,0,"zoneName");var je=o.prototype;je.add=Xd,je.calendar=db,je.clone=eb,je.diff=lb,je.endOf=xb,je.format=pb,je.from=qb,je.fromNow=rb,je.to=sb,je.toNow=tb,je.get=H,je.invalidAt=Gb,je.isAfter=fb,je.isBefore=gb,je.isBetween=hb,je.isSame=ib,je.isSameOrAfter=jb,je.isSameOrBefore=kb,je.isValid=Eb,je.lang=Zd,je.locale=ub,je.localeData=vb,je.max=Sd,je.min=Rd,je.parsingFlags=Fb,je.set=H,je.startOf=wb,je.subtract=Yd,je.toArray=Bb,je.toObject=Cb,je.toDate=Ab,je.toISOString=ob,je.toJSON=Db,je.toString=nb,je.unix=zb,je.valueOf=yb,je.creationData=Hb,je.year=Qd,je.isLeapYear=na,je.weekYear=Jb,je.isoWeekYear=Kb,je.quarter=je.quarters=Pb,je.month=$,je.daysInMonth=_,je.week=je.weeks=Tb,je.isoWeek=je.isoWeeks=Ub,je.weeksInYear=Mb,je.isoWeeksInYear=Lb,je.date=_d,je.day=je.days=$b,je.weekday=_b,je.isoWeekday=ac,je.dayOfYear=bc,je.hour=je.hours=ee,je.minute=je.minutes=fe,je.second=je.seconds=ge,je.millisecond=je.milliseconds=ie,je.utcOffset=Oa,je.utc=Qa,je.local=Ra,je.parseZone=Sa,je.hasAlignedHourOffset=Ta,je.isDST=Ua,je.isDSTShifted=Va,je.isLocal=Wa,je.isUtcOffset=Xa,je.isUtc=Ya,je.isUTC=Ya,je.zoneAbbr=ic,je.zoneName=jc,je.dates=fa("dates accessor is deprecated. Use date instead.",_d),je.months=fa("months accessor is deprecated. Use month instead",$),je.years=fa("years accessor is deprecated. Use year instead",Qd),je.zone=fa("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779",Pa);var ke=je,le={sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},me={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},ne="Invalid date",oe="%d",pe=/\d{1,2}/,qe={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},re=t.prototype;re._calendar=le,re.calendar=mc,re._longDateFormat=me,re.longDateFormat=nc,re._invalidDate=ne,re.invalidDate=oc,re._ordinal=oe,re.ordinal=pc,re._ordinalParse=pe,re.preparse=qc,re.postformat=qc,re._relativeTime=qe,re.relativeTime=rc,re.pastFuture=sc,re.set=tc,re.months=W,re._months=Fd,re.monthsShort=X,re._monthsShort=Gd,re.monthsParse=Y,re._monthsRegex=Id,re.monthsRegex=ba,re._monthsShortRegex=Hd,re.monthsShortRegex=aa,re.week=Qb,re._week=$d,re.firstDayOfYear=Sb,re.firstDayOfWeek=Rb,re.weekdays=Wb,re._weekdays=ae,re.weekdaysMin=Yb,re._weekdaysMin=ce,re.weekdaysShort=Xb,re._weekdaysShort=be,re.weekdaysParse=Zb,re.isPM=fc,re._meridiemParse=de,re.meridiem=gc,x("en",{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(a){var b=a%10,c=1===r(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),a.lang=fa("moment.lang is deprecated. Use moment.locale instead.",x),a.langData=fa("moment.langData is deprecated. Use moment.localeData instead.",z);var se=Math.abs,te=Lc("ms"),ue=Lc("s"),ve=Lc("m"),we=Lc("h"),xe=Lc("d"),ye=Lc("w"),ze=Lc("M"),Ae=Lc("y"),Be=Nc("milliseconds"),Ce=Nc("seconds"),De=Nc("minutes"),Ee=Nc("hours"),Fe=Nc("days"),Ge=Nc("months"),He=Nc("years"),Ie=Math.round,Je={s:45,m:45,h:22,d:26,M:11},Ke=Math.abs,Le=Ia.prototype;Le.abs=Bc,Le.add=Dc,Le.subtract=Ec,Le.as=Jc,Le.asMilliseconds=te,Le.asSeconds=ue,Le.asMinutes=ve,Le.asHours=we,Le.asDays=xe,Le.asWeeks=ye,Le.asMonths=ze,Le.asYears=Ae,Le.valueOf=Kc,Le._bubble=Gc,Le.get=Mc,Le.milliseconds=Be,Le.seconds=Ce,Le.minutes=De,Le.hours=Ee,Le.days=Fe,Le.weeks=Oc,Le.months=Ge,Le.years=He,Le.humanize=Sc,Le.toISOString=Tc,Le.toString=Tc,Le.toJSON=Tc,Le.locale=ub,Le.localeData=vb,Le.toIsoString=fa("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",Tc),Le.lang=Zd,J("X",0,0,"unix"),J("x",0,0,"valueOf"),O("x",od),O("X",rd),S("X",function(a,b,c){c._d=new Date(1e3*parseFloat(a,10))}),S("x",function(a,b,c){c._d=new Date(r(a))}),a.version="2.11.2",b(Ea),a.fn=ke,a.min=Ga,a.max=Ha,a.now=Td,a.utc=h,a.unix=kc,a.months=wc,a.isDate=d,a.locale=x,a.invalid=l,a.duration=Za,a.isMoment=p,a.weekdays=yc,a.parseZone=lc,a.localeData=z,a.isDuration=Ja,a.monthsShort=xc,a.weekdaysMin=Ac,a.defineLocale=y,a.weekdaysShort=zc,a.normalizeUnits=B,a.relativeTimeThreshold=Rc,a.prototype=ke;var Me=a;return Me});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Pikaday
	 *
	 * Copyright © 2014 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday
	 */

	(function (root, factory)
	{
	    'use strict';

	    var moment;
	    if (true) {
	        // CommonJS module
	        // Load moment.js as an optional dependency
	        try { moment = __webpack_require__(2); } catch (e) {}
	        module.exports = factory(moment);
	    } else if (typeof define === 'function' && define.amd) {
	        // AMD. Register as an anonymous module.
	        define(function (req)
	        {
	            // Load moment.js as an optional dependency
	            var id = 'moment';
	            try { moment = req(id); } catch (e) {}
	            return factory(moment);
	        });
	    } else {
	        root.Pikaday = factory(root.moment);
	    }
	}(this, function (moment)
	{
	    'use strict';

	    /**
	     * feature detection and helper functions
	     */
	    var hasMoment = typeof moment === 'function',

	    hasEventListeners = !!window.addEventListener,

	    document = window.document,

	    sto = window.setTimeout,

	    addEvent = function(el, e, callback, capture)
	    {
	        if (hasEventListeners) {
	            el.addEventListener(e, callback, !!capture);
	        } else {
	            el.attachEvent('on' + e, callback);
	        }
	    },

	    removeEvent = function(el, e, callback, capture)
	    {
	        if (hasEventListeners) {
	            el.removeEventListener(e, callback, !!capture);
	        } else {
	            el.detachEvent('on' + e, callback);
	        }
	    },

	    fireEvent = function(el, eventName, data)
	    {
	        var ev;

	        if (document.createEvent) {
	            ev = document.createEvent('HTMLEvents');
	            ev.initEvent(eventName, true, false);
	            ev = extend(ev, data);
	            el.dispatchEvent(ev);
	        } else if (document.createEventObject) {
	            ev = document.createEventObject();
	            ev = extend(ev, data);
	            el.fireEvent('on' + eventName, ev);
	        }
	    },

	    trim = function(str)
	    {
	        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
	    },

	    hasClass = function(el, cn)
	    {
	        return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
	    },

	    addClass = function(el, cn)
	    {
	        if (!hasClass(el, cn)) {
	            el.className = (el.className === '') ? cn : el.className + ' ' + cn;
	        }
	    },

	    removeClass = function(el, cn)
	    {
	        el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
	    },

	    isArray = function(obj)
	    {
	        return (/Array/).test(Object.prototype.toString.call(obj));
	    },

	    isDate = function(obj)
	    {
	        return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
	    },

	    isWeekend = function(date)
	    {
	        var day = date.getDay();
	        return day === 0 || day === 6;
	    },

	    isLeapYear = function(year)
	    {
	        // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
	        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
	    },

	    getDaysInMonth = function(year, month)
	    {
	        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	    },

	    setToStartOfDay = function(date)
	    {
	        if (isDate(date)) date.setHours(0,0,0,0);
	    },

	    compareDates = function(a,b)
	    {
	        // weak date comparison (use setToStartOfDay(date) to ensure correct result)
	        return a.getTime() === b.getTime();
	    },

	    extend = function(to, from, overwrite)
	    {
	        var prop, hasProp;
	        for (prop in from) {
	            hasProp = to[prop] !== undefined;
	            if (hasProp && typeof from[prop] === 'object' && from[prop] !== null && from[prop].nodeName === undefined) {
	                if (isDate(from[prop])) {
	                    if (overwrite) {
	                        to[prop] = new Date(from[prop].getTime());
	                    }
	                }
	                else if (isArray(from[prop])) {
	                    if (overwrite) {
	                        to[prop] = from[prop].slice(0);
	                    }
	                } else {
	                    to[prop] = extend({}, from[prop], overwrite);
	                }
	            } else if (overwrite || !hasProp) {
	                to[prop] = from[prop];
	            }
	        }
	        return to;
	    },

	    adjustCalendar = function(calendar) {
	        if (calendar.month < 0) {
	            calendar.year -= Math.ceil(Math.abs(calendar.month)/12);
	            calendar.month += 12;
	        }
	        if (calendar.month > 11) {
	            calendar.year += Math.floor(Math.abs(calendar.month)/12);
	            calendar.month -= 12;
	        }
	        return calendar;
	    },

	    /**
	     * defaults and localisation
	     */
	    defaults = {

	        // bind the picker to a form field
	        field: null,

	        // automatically show/hide the picker on `field` focus (default `true` if `field` is set)
	        bound: undefined,

	        // position of the datepicker, relative to the field (default to bottom & left)
	        // ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
	        position: 'bottom left',

	        // automatically fit in the viewport even if it means repositioning from the position option
	        reposition: true,

	        // the default output format for `.toString()` and `field` value
	        format: 'YYYY-MM-DD',

	        // the initial date to view when first opened
	        defaultDate: null,

	        // make the `defaultDate` the initial selected value
	        setDefaultDate: false,

	        // first day of week (0: Sunday, 1: Monday etc)
	        firstDay: 0,

	        // the minimum/earliest date that can be selected
	        minDate: null,
	        // the maximum/latest date that can be selected
	        maxDate: null,

	        // number of years either side, or array of upper/lower range
	        yearRange: 10,

	        // show week numbers at head of row
	        showWeekNumber: false,

	        // used internally (don't config outside)
	        minYear: 0,
	        maxYear: 9999,
	        minMonth: undefined,
	        maxMonth: undefined,

	        startRange: null,
	        endRange: null,

	        isRTL: false,

	        // Additional text to append to the year in the calendar title
	        yearSuffix: '',

	        // Render the month after year in the calendar title
	        showMonthAfterYear: false,

	        // how many months are visible
	        numberOfMonths: 1,

	        // when numberOfMonths is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`)
	        // only used for the first display or when a selected date is not visible
	        mainCalendar: 'left',

	        // Specify a DOM element to render the calendar in
	        container: undefined,

	        // internationalization
	        i18n: {
	            previousMonth : 'Previous Month',
	            nextMonth     : 'Next Month',
	            months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
	            weekdays      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
	            weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
	        },

	        // Theme Classname
	        theme: null,

	        // callback function
	        onSelect: null,
	        onOpen: null,
	        onClose: null,
	        onDraw: null
	    },


	    /**
	     * templating functions to abstract HTML rendering
	     */
	    renderDayName = function(opts, day, abbr)
	    {
	        day += opts.firstDay;
	        while (day >= 7) {
	            day -= 7;
	        }
	        return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
	    },

	    renderDay = function(opts)
	    {
	        if (opts.isEmpty) {
	            return '<td class="is-empty"></td>';
	        }
	        var arr = [];
	        if (opts.isDisabled) {
	            arr.push('is-disabled');
	        }
	        if (opts.isToday) {
	            arr.push('is-today');
	        }
	        if (opts.isSelected) {
	            arr.push('is-selected');
	        }
	        if (opts.isInRange) {
	            arr.push('is-inrange');
	        }
	        if (opts.isStartRange) {
	            arr.push('is-startrange');
	        }
	        if (opts.isEndRange) {
	            arr.push('is-endrange');
	        }
	        return '<td data-day="' + opts.day + '" class="' + arr.join(' ') + '">' +
	                 '<button class="pika-button pika-day" type="button" ' +
	                    'data-pika-year="' + opts.year + '" data-pika-month="' + opts.month + '" data-pika-day="' + opts.day + '">' +
	                        opts.day +
	                 '</button>' +
	               '</td>';
	    },

	    renderWeek = function (d, m, y) {
	        // Lifted from http://javascript.about.com/library/blweekyear.htm, lightly modified.
	        var onejan = new Date(y, 0, 1),
	            weekNum = Math.ceil((((new Date(y, m, d) - onejan) / 86400000) + onejan.getDay()+1)/7);
	        return '<td class="pika-week">' + weekNum + '</td>';
	    },

	    renderRow = function(days, isRTL)
	    {
	        return '<tr>' + (isRTL ? days.reverse() : days).join('') + '</tr>';
	    },

	    renderBody = function(rows)
	    {
	        return '<tbody>' + rows.join('') + '</tbody>';
	    },

	    renderHead = function(opts)
	    {
	        var i, arr = [];
	        if (opts.showWeekNumber) {
	            arr.push('<th></th>');
	        }
	        for (i = 0; i < 7; i++) {
	            arr.push('<th scope="col"><abbr title="' + renderDayName(opts, i) + '">' + renderDayName(opts, i, true) + '</abbr></th>');
	        }
	        return '<thead>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</thead>';
	    },

	    renderTitle = function(instance, c, year, month, refYear)
	    {
	        var i, j, arr,
	            opts = instance._o,
	            isMinYear = year === opts.minYear,
	            isMaxYear = year === opts.maxYear,
	            html = '<div class="pika-title">',
	            monthHtml,
	            yearHtml,
	            prev = true,
	            next = true;

	        for (arr = [], i = 0; i < 12; i++) {
	            arr.push('<option value="' + (year === refYear ? i - c : 12 + i - c) + '"' +
	                (i === month ? ' selected': '') +
	                ((isMinYear && i < opts.minMonth) || (isMaxYear && i > opts.maxMonth) ? 'disabled' : '') + '>' +
	                opts.i18n.months[i] + '</option>');
	        }
	        monthHtml = '<div class="pika-label">' + opts.i18n.months[month] + '<select class="pika-select pika-select-month" tabindex="-1">' + arr.join('') + '</select></div>';

	        if (isArray(opts.yearRange)) {
	            i = opts.yearRange[0];
	            j = opts.yearRange[1] + 1;
	        } else {
	            i = year - opts.yearRange;
	            j = 1 + year + opts.yearRange;
	        }

	        for (arr = []; i < j && i <= opts.maxYear; i++) {
	            if (i >= opts.minYear) {
	                arr.push('<option value="' + i + '"' + (i === year ? ' selected': '') + '>' + (i) + '</option>');
	            }
	        }
	        yearHtml = '<div class="pika-label">' + year + opts.yearSuffix + '<select class="pika-select pika-select-year" tabindex="-1">' + arr.join('') + '</select></div>';

	        if (opts.showMonthAfterYear) {
	            html += yearHtml + monthHtml;
	        } else {
	            html += monthHtml + yearHtml;
	        }

	        if (isMinYear && (month === 0 || opts.minMonth >= month)) {
	            prev = false;
	        }

	        if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
	            next = false;
	        }

	        if (c === 0) {
	            html += '<button class="pika-prev' + (prev ? '' : ' is-disabled') + '" type="button">' + opts.i18n.previousMonth + '</button>';
	        }
	        if (c === (instance._o.numberOfMonths - 1) ) {
	            html += '<button class="pika-next' + (next ? '' : ' is-disabled') + '" type="button">' + opts.i18n.nextMonth + '</button>';
	        }

	        return html += '</div>';
	    },

	    renderTable = function(opts, data)
	    {
	        return '<table cellpadding="0" cellspacing="0" class="pika-table">' + renderHead(opts) + renderBody(data) + '</table>';
	    },


	    /**
	     * Pikaday constructor
	     */
	    Pikaday = function(options)
	    {
	        var self = this,
	            opts = self.config(options);

	        self._onMouseDown = function(e)
	        {
	            if (!self._v) {
	                return;
	            }
	            e = e || window.event;
	            var target = e.target || e.srcElement;
	            if (!target) {
	                return;
	            }

	            if (!hasClass(target, 'is-disabled')) {
	                if (hasClass(target, 'pika-button') && !hasClass(target, 'is-empty')) {
	                    self.setDate(new Date(target.getAttribute('data-pika-year'), target.getAttribute('data-pika-month'), target.getAttribute('data-pika-day')));
	                    if (opts.bound) {
	                        sto(function() {
	                            self.hide();
	                            if (opts.field) {
	                                opts.field.blur();
	                            }
	                        }, 100);
	                    }
	                }
	                else if (hasClass(target, 'pika-prev')) {
	                    self.prevMonth();
	                }
	                else if (hasClass(target, 'pika-next')) {
	                    self.nextMonth();
	                }
	            }
	            if (!hasClass(target, 'pika-select')) {
	                // if this is touch event prevent mouse events emulation
	                if (e.preventDefault) {
	                    e.preventDefault();
	                } else {
	                    e.returnValue = false;
	                    return false;
	                }
	            } else {
	                self._c = true;
	            }
	        };

	        self._onChange = function(e)
	        {
	            e = e || window.event;
	            var target = e.target || e.srcElement;
	            if (!target) {
	                return;
	            }
	            if (hasClass(target, 'pika-select-month')) {
	                self.gotoMonth(target.value);
	            }
	            else if (hasClass(target, 'pika-select-year')) {
	                self.gotoYear(target.value);
	            }
	        };

	        self._onInputChange = function(e)
	        {
	            var date;

	            if (e.firedBy === self) {
	                return;
	            }
	            if (hasMoment) {
	                date = moment(opts.field.value, opts.format);
	                date = (date && date.isValid()) ? date.toDate() : null;
	            }
	            else {
	                date = new Date(Date.parse(opts.field.value));
	            }
	            if (isDate(date)) {
	              self.setDate(date);
	            }
	            if (!self._v) {
	                self.show();
	            }
	        };

	        self._onInputFocus = function()
	        {
	            self.show();
	        };

	        self._onInputClick = function()
	        {
	            self.show();
	        };

	        self._onInputBlur = function()
	        {
	            // IE allows pika div to gain focus; catch blur the input field
	            var pEl = document.activeElement;
	            do {
	                if (hasClass(pEl, 'pika-single')) {
	                    return;
	                }
	            }
	            while ((pEl = pEl.parentNode));

	            if (!self._c) {
	                self._b = sto(function() {
	                    self.hide();
	                }, 50);
	            }
	            self._c = false;
	        };

	        self._onClick = function(e)
	        {
	            e = e || window.event;
	            var target = e.target || e.srcElement,
	                pEl = target;
	            if (!target) {
	                return;
	            }
	            if (!hasEventListeners && hasClass(target, 'pika-select')) {
	                if (!target.onchange) {
	                    target.setAttribute('onchange', 'return;');
	                    addEvent(target, 'change', self._onChange);
	                }
	            }
	            do {
	                if (hasClass(pEl, 'pika-single') || pEl === opts.trigger) {
	                    return;
	                }
	            }
	            while ((pEl = pEl.parentNode));
	            if (self._v && target !== opts.trigger && pEl !== opts.trigger) {
	                self.hide();
	            }
	        };

	        self.el = document.createElement('div');
	        self.el.className = 'pika-single' + (opts.isRTL ? ' is-rtl' : '') + (opts.theme ? ' ' + opts.theme : '');

	        addEvent(self.el, 'mousedown', self._onMouseDown, true);
	        addEvent(self.el, 'touchend', self._onMouseDown, true);
	        addEvent(self.el, 'change', self._onChange);

	        if (opts.field) {
	            if (opts.container) {
	                opts.container.appendChild(self.el);
	            } else if (opts.bound) {
	                document.body.appendChild(self.el);
	            } else {
	                opts.field.parentNode.insertBefore(self.el, opts.field.nextSibling);
	            }
	            addEvent(opts.field, 'change', self._onInputChange);

	            if (!opts.defaultDate) {
	                if (hasMoment && opts.field.value) {
	                    opts.defaultDate = moment(opts.field.value, opts.format).toDate();
	                } else {
	                    opts.defaultDate = new Date(Date.parse(opts.field.value));
	                }
	                opts.setDefaultDate = true;
	            }
	        }

	        var defDate = opts.defaultDate;

	        if (isDate(defDate)) {
	            if (opts.setDefaultDate) {
	                self.setDate(defDate, true);
	            } else {
	                self.gotoDate(defDate);
	            }
	        } else {
	            self.gotoDate(new Date());
	        }

	        if (opts.bound) {
	            this.hide();
	            self.el.className += ' is-bound';
	            addEvent(opts.trigger, 'click', self._onInputClick);
	            addEvent(opts.trigger, 'focus', self._onInputFocus);
	            addEvent(opts.trigger, 'blur', self._onInputBlur);
	        } else {
	            this.show();
	        }
	    };


	    /**
	     * public Pikaday API
	     */
	    Pikaday.prototype = {


	        /**
	         * configure functionality
	         */
	        config: function(options)
	        {
	            if (!this._o) {
	                this._o = extend({}, defaults, true);
	            }

	            var opts = extend(this._o, options, true);

	            opts.isRTL = !!opts.isRTL;

	            opts.field = (opts.field && opts.field.nodeName) ? opts.field : null;

	            opts.theme = (typeof opts.theme) === 'string' && opts.theme ? opts.theme : null;

	            opts.bound = !!(opts.bound !== undefined ? opts.field && opts.bound : opts.field);

	            opts.trigger = (opts.trigger && opts.trigger.nodeName) ? opts.trigger : opts.field;

	            opts.disableWeekends = !!opts.disableWeekends;

	            opts.disableDayFn = (typeof opts.disableDayFn) === 'function' ? opts.disableDayFn : null;

	            var nom = parseInt(opts.numberOfMonths, 10) || 1;
	            opts.numberOfMonths = nom > 4 ? 4 : nom;

	            if (!isDate(opts.minDate)) {
	                opts.minDate = false;
	            }
	            if (!isDate(opts.maxDate)) {
	                opts.maxDate = false;
	            }
	            if ((opts.minDate && opts.maxDate) && opts.maxDate < opts.minDate) {
	                opts.maxDate = opts.minDate = false;
	            }
	            if (opts.minDate) {
	                this.setMinDate(opts.minDate);
	            }
	            if (opts.maxDate) {
	                this.setMaxDate(opts.maxDate);
	            }

	            if (isArray(opts.yearRange)) {
	                var fallback = new Date().getFullYear() - 10;
	                opts.yearRange[0] = parseInt(opts.yearRange[0], 10) || fallback;
	                opts.yearRange[1] = parseInt(opts.yearRange[1], 10) || fallback;
	            } else {
	                opts.yearRange = Math.abs(parseInt(opts.yearRange, 10)) || defaults.yearRange;
	                if (opts.yearRange > 100) {
	                    opts.yearRange = 100;
	                }
	            }

	            return opts;
	        },

	        /**
	         * return a formatted string of the current selection (using Moment.js if available)
	         */
	        toString: function(format)
	        {
	            return !isDate(this._d) ? '' : hasMoment ? moment(this._d).format(format || this._o.format) : this._d.toDateString();
	        },

	        /**
	         * return a Moment.js object of the current selection (if available)
	         */
	        getMoment: function()
	        {
	            return hasMoment ? moment(this._d) : null;
	        },

	        /**
	         * set the current selection from a Moment.js object (if available)
	         */
	        setMoment: function(date, preventOnSelect)
	        {
	            if (hasMoment && moment.isMoment(date)) {
	                this.setDate(date.toDate(), preventOnSelect);
	            }
	        },

	        /**
	         * return a Date object of the current selection
	         */
	        getDate: function()
	        {
	            return isDate(this._d) ? new Date(this._d.getTime()) : null;
	        },

	        /**
	         * set the current selection
	         */
	        setDate: function(date, preventOnSelect)
	        {
	            if (!date) {
	                this._d = null;

	                if (this._o.field) {
	                    this._o.field.value = '';
	                    fireEvent(this._o.field, 'change', { firedBy: this });
	                }

	                return this.draw();
	            }
	            if (typeof date === 'string') {
	                date = new Date(Date.parse(date));
	            }
	            if (!isDate(date)) {
	                return;
	            }

	            var min = this._o.minDate,
	                max = this._o.maxDate;

	            if (isDate(min) && date < min) {
	                date = min;
	            } else if (isDate(max) && date > max) {
	                date = max;
	            }

	            this._d = new Date(date.getTime());
	            setToStartOfDay(this._d);
	            this.gotoDate(this._d);

	            if (this._o.field) {
	                this._o.field.value = this.toString();
	                fireEvent(this._o.field, 'change', { firedBy: this });
	            }
	            if (!preventOnSelect && typeof this._o.onSelect === 'function') {
	                this._o.onSelect.call(this, this.getDate());
	            }
	        },

	        /**
	         * change view to a specific date
	         */
	        gotoDate: function(date)
	        {
	            var newCalendar = true;

	            if (!isDate(date)) {
	                return;
	            }

	            if (this.calendars) {
	                var firstVisibleDate = new Date(this.calendars[0].year, this.calendars[0].month, 1),
	                    lastVisibleDate = new Date(this.calendars[this.calendars.length-1].year, this.calendars[this.calendars.length-1].month, 1),
	                    visibleDate = date.getTime();
	                // get the end of the month
	                lastVisibleDate.setMonth(lastVisibleDate.getMonth()+1);
	                lastVisibleDate.setDate(lastVisibleDate.getDate()-1);
	                newCalendar = (visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate);
	            }

	            if (newCalendar) {
	                this.calendars = [{
	                    month: date.getMonth(),
	                    year: date.getFullYear()
	                }];
	                if (this._o.mainCalendar === 'right') {
	                    this.calendars[0].month += 1 - this._o.numberOfMonths;
	                }
	            }

	            this.adjustCalendars();
	        },

	        adjustCalendars: function() {
	            this.calendars[0] = adjustCalendar(this.calendars[0]);
	            for (var c = 1; c < this._o.numberOfMonths; c++) {
	                this.calendars[c] = adjustCalendar({
	                    month: this.calendars[0].month + c,
	                    year: this.calendars[0].year
	                });
	            }
	            this.draw();
	        },

	        gotoToday: function()
	        {
	            this.gotoDate(new Date());
	        },

	        /**
	         * change view to a specific month (zero-index, e.g. 0: January)
	         */
	        gotoMonth: function(month)
	        {
	            if (!isNaN(month)) {
	                this.calendars[0].month = parseInt(month, 10);
	                this.adjustCalendars();
	            }
	        },

	        nextMonth: function()
	        {
	            this.calendars[0].month++;
	            this.adjustCalendars();
	        },

	        prevMonth: function()
	        {
	            this.calendars[0].month--;
	            this.adjustCalendars();
	        },

	        /**
	         * change view to a specific full year (e.g. "2012")
	         */
	        gotoYear: function(year)
	        {
	            if (!isNaN(year)) {
	                this.calendars[0].year = parseInt(year, 10);
	                this.adjustCalendars();
	            }
	        },

	        /**
	         * change the minDate
	         */
	        setMinDate: function(value)
	        {
	            setToStartOfDay(value);
	            this._o.minDate = value;
	            this._o.minYear  = value.getFullYear();
	            this._o.minMonth = value.getMonth();
	            this.draw();
	        },

	        /**
	         * change the maxDate
	         */
	        setMaxDate: function(value)
	        {
	            setToStartOfDay(value);
	            this._o.maxDate = value;
	            this._o.maxYear = value.getFullYear();
	            this._o.maxMonth = value.getMonth();
	            this.draw();
	        },

	        setStartRange: function(value)
	        {
	            this._o.startRange = value;
	        },

	        setEndRange: function(value)
	        {
	            this._o.endRange = value;
	        },

	        /**
	         * refresh the HTML
	         */
	        draw: function(force)
	        {
	            if (!this._v && !force) {
	                return;
	            }
	            var opts = this._o,
	                minYear = opts.minYear,
	                maxYear = opts.maxYear,
	                minMonth = opts.minMonth,
	                maxMonth = opts.maxMonth,
	                html = '';

	            if (this._y <= minYear) {
	                this._y = minYear;
	                if (!isNaN(minMonth) && this._m < minMonth) {
	                    this._m = minMonth;
	                }
	            }
	            if (this._y >= maxYear) {
	                this._y = maxYear;
	                if (!isNaN(maxMonth) && this._m > maxMonth) {
	                    this._m = maxMonth;
	                }
	            }

	            for (var c = 0; c < opts.numberOfMonths; c++) {
	                html += '<div class="pika-lendar">' + renderTitle(this, c, this.calendars[c].year, this.calendars[c].month, this.calendars[0].year) + this.render(this.calendars[c].year, this.calendars[c].month) + '</div>';
	            }

	            this.el.innerHTML = html;

	            if (opts.bound) {
	                if(opts.field.type !== 'hidden') {
	                    sto(function() {
	                        opts.trigger.focus();
	                    }, 1);
	                }
	            }

	            if (typeof this._o.onDraw === 'function') {
	                var self = this;
	                sto(function() {
	                    self._o.onDraw.call(self);
	                }, 0);
	            }
	        },

	        adjustPosition: function()
	        {
	            var field, pEl, width, height, viewportWidth, viewportHeight, scrollTop, left, top, clientRect;

	            if (this._o.container) return;

	            this.el.style.position = 'absolute';

	            field = this._o.trigger;
	            pEl = field;
	            width = this.el.offsetWidth;
	            height = this.el.offsetHeight;
	            viewportWidth = window.innerWidth || document.documentElement.clientWidth;
	            viewportHeight = window.innerHeight || document.documentElement.clientHeight;
	            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;

	            if (typeof field.getBoundingClientRect === 'function') {
	                clientRect = field.getBoundingClientRect();
	                left = clientRect.left + window.pageXOffset;
	                top = clientRect.bottom + window.pageYOffset;
	            } else {
	                left = pEl.offsetLeft;
	                top  = pEl.offsetTop + pEl.offsetHeight;
	                while((pEl = pEl.offsetParent)) {
	                    left += pEl.offsetLeft;
	                    top  += pEl.offsetTop;
	                }
	            }

	            // default position is bottom & left
	            if ((this._o.reposition && left + width > viewportWidth) ||
	                (
	                    this._o.position.indexOf('right') > -1 &&
	                    left - width + field.offsetWidth > 0
	                )
	            ) {
	                left = left - width + field.offsetWidth;
	            }
	            if ((this._o.reposition && top + height > viewportHeight + scrollTop) ||
	                (
	                    this._o.position.indexOf('top') > -1 &&
	                    top - height - field.offsetHeight > 0
	                )
	            ) {
	                top = top - height - field.offsetHeight;
	            }

	            this.el.style.left = left + 'px';
	            this.el.style.top = top + 'px';
	        },

	        /**
	         * render HTML for a particular month
	         */
	        render: function(year, month)
	        {
	            var opts   = this._o,
	                now    = new Date(),
	                days   = getDaysInMonth(year, month),
	                before = new Date(year, month, 1).getDay(),
	                data   = [],
	                row    = [];
	            setToStartOfDay(now);
	            if (opts.firstDay > 0) {
	                before -= opts.firstDay;
	                if (before < 0) {
	                    before += 7;
	                }
	            }
	            var cells = days + before,
	                after = cells;
	            while(after > 7) {
	                after -= 7;
	            }
	            cells += 7 - after;
	            for (var i = 0, r = 0; i < cells; i++)
	            {
	                var day = new Date(year, month, 1 + (i - before)),
	                    isSelected = isDate(this._d) ? compareDates(day, this._d) : false,
	                    isToday = compareDates(day, now),
	                    isEmpty = i < before || i >= (days + before),
	                    isStartRange = opts.startRange && compareDates(opts.startRange, day),
	                    isEndRange = opts.endRange && compareDates(opts.endRange, day),
	                    isInRange = opts.startRange && opts.endRange && opts.startRange < day && day < opts.endRange,
	                    isDisabled = (opts.minDate && day < opts.minDate) ||
	                                 (opts.maxDate && day > opts.maxDate) ||
	                                 (opts.disableWeekends && isWeekend(day)) ||
	                                 (opts.disableDayFn && opts.disableDayFn(day)),
	                    dayConfig = {
	                        day: 1 + (i - before),
	                        month: month,
	                        year: year,
	                        isSelected: isSelected,
	                        isToday: isToday,
	                        isDisabled: isDisabled,
	                        isEmpty: isEmpty,
	                        isStartRange: isStartRange,
	                        isEndRange: isEndRange,
	                        isInRange: isInRange
	                    };

	                row.push(renderDay(dayConfig));

	                if (++r === 7) {
	                    if (opts.showWeekNumber) {
	                        row.unshift(renderWeek(i - before, month, year));
	                    }
	                    data.push(renderRow(row, opts.isRTL));
	                    row = [];
	                    r = 0;
	                }
	            }
	            return renderTable(opts, data);
	        },

	        isVisible: function()
	        {
	            return this._v;
	        },

	        show: function()
	        {
	            if (!this._v) {
	                removeClass(this.el, 'is-hidden');
	                this._v = true;
	                this.draw();
	                if (this._o.bound) {
	                    addEvent(document, 'click', this._onClick);
	                    this.adjustPosition();
	                }
	                if (typeof this._o.onOpen === 'function') {
	                    this._o.onOpen.call(this);
	                }
	            }
	        },

	        hide: function()
	        {
	            var v = this._v;
	            if (v !== false) {
	                if (this._o.bound) {
	                    removeEvent(document, 'click', this._onClick);
	                }
	                this.el.style.position = 'static'; // reset
	                this.el.style.left = 'auto';
	                this.el.style.top = 'auto';
	                addClass(this.el, 'is-hidden');
	                this._v = false;
	                if (v !== undefined && typeof this._o.onClose === 'function') {
	                    this._o.onClose.call(this);
	                }
	            }
	        },

	        /**
	         * GAME OVER
	         */
	        destroy: function()
	        {
	            this.hide();
	            removeEvent(this.el, 'mousedown', this._onMouseDown, true);
	            removeEvent(this.el, 'touchend', this._onMouseDown, true);
	            removeEvent(this.el, 'change', this._onChange);
	            if (this._o.field) {
	                removeEvent(this._o.field, 'change', this._onInputChange);
	                if (this._o.bound) {
	                    removeEvent(this._o.trigger, 'click', this._onInputClick);
	                    removeEvent(this._o.trigger, 'focus', this._onInputFocus);
	                    removeEvent(this._o.trigger, 'blur', this._onInputBlur);
	                }
	            }
	            if (this.el.parentNode) {
	                this.el.parentNode.removeChild(this.el);
	            }
	        }

	    };

	    return Pikaday;

	}));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * FullCalendar v2.5.0
	 * Docs & License: http://fullcalendar.io/
	 * (c) 2015 Adam Shaw
	 */

	(function(factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(1), __webpack_require__(2) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}
		else if (typeof exports === 'object') { // Node/CommonJS
			module.exports = factory(require('jquery'), require('moment'));
		}
		else {
			factory(jQuery, moment);
		}
	})(function($, moment) {

	;;

	var FC = $.fullCalendar = {
		version: "2.5.0",
		internalApiVersion: 1
	};
	var fcViews = FC.views = {};


	$.fn.fullCalendar = function(options) {
		var args = Array.prototype.slice.call(arguments, 1); // for a possible method call
		var res = this; // what this function will return (this jQuery object by default)

		this.each(function(i, _element) { // loop each DOM element involved
			var element = $(_element);
			var calendar = element.data('fullCalendar'); // get the existing calendar object (if any)
			var singleRes; // the returned value of this single method call

			// a method call
			if (typeof options === 'string') {
				if (calendar && $.isFunction(calendar[options])) {
					singleRes = calendar[options].apply(calendar, args);
					if (!i) {
						res = singleRes; // record the first method call result
					}
					if (options === 'destroy') { // for the destroy method, must remove Calendar object data
						element.removeData('fullCalendar');
					}
				}
			}
			// a new calendar initialization
			else if (!calendar) { // don't initialize twice
				calendar = new Calendar(element, options);
				element.data('fullCalendar', calendar);
				calendar.render();
			}
		});
		
		return res;
	};


	var complexOptions = [ // names of options that are objects whose properties should be combined
		'header',
		'buttonText',
		'buttonIcons',
		'themeButtonIcons'
	];


	// Merges an array of option objects into a single object
	function mergeOptions(optionObjs) {
		return mergeProps(optionObjs, complexOptions);
	}


	// Given options specified for the calendar's constructor, massages any legacy options into a non-legacy form.
	// Converts View-Option-Hashes into the View-Specific-Options format.
	function massageOverrides(input) {
		var overrides = { views: input.views || {} }; // the output. ensure a `views` hash
		var subObj;

		// iterate through all option override properties (except `views`)
		$.each(input, function(name, val) {
			if (name != 'views') {

				// could the value be a legacy View-Option-Hash?
				if (
					$.isPlainObject(val) &&
					!/(time|duration|interval)$/i.test(name) && // exclude duration options. might be given as objects
					$.inArray(name, complexOptions) == -1 // complex options aren't allowed to be View-Option-Hashes
				) {
					subObj = null;

					// iterate through the properties of this possible View-Option-Hash value
					$.each(val, function(subName, subVal) {

						// is the property targeting a view?
						if (/^(month|week|day|default|basic(Week|Day)?|agenda(Week|Day)?)$/.test(subName)) {
							if (!overrides.views[subName]) { // ensure the view-target entry exists
								overrides.views[subName] = {};
							}
							overrides.views[subName][name] = subVal; // record the value in the `views` object
						}
						else { // a non-View-Option-Hash property
							if (!subObj) {
								subObj = {};
							}
							subObj[subName] = subVal; // accumulate these unrelated values for later
						}
					});

					if (subObj) { // non-View-Option-Hash properties? transfer them as-is
						overrides[name] = subObj;
					}
				}
				else {
					overrides[name] = val; // transfer normal options as-is
				}
			}
		});

		return overrides;
	}

	;;

	// exports
	FC.intersectRanges = intersectRanges;
	FC.applyAll = applyAll;
	FC.debounce = debounce;
	FC.isInt = isInt;
	FC.htmlEscape = htmlEscape;
	FC.cssToStr = cssToStr;
	FC.proxy = proxy;
	FC.capitaliseFirstLetter = capitaliseFirstLetter;


	/* FullCalendar-specific DOM Utilities
	----------------------------------------------------------------------------------------------------------------------*/


	// Given the scrollbar widths of some other container, create borders/margins on rowEls in order to match the left
	// and right space that was offset by the scrollbars. A 1-pixel border first, then margin beyond that.
	function compensateScroll(rowEls, scrollbarWidths) {
		if (scrollbarWidths.left) {
			rowEls.css({
				'border-left-width': 1,
				'margin-left': scrollbarWidths.left - 1
			});
		}
		if (scrollbarWidths.right) {
			rowEls.css({
				'border-right-width': 1,
				'margin-right': scrollbarWidths.right - 1
			});
		}
	}


	// Undoes compensateScroll and restores all borders/margins
	function uncompensateScroll(rowEls) {
		rowEls.css({
			'margin-left': '',
			'margin-right': '',
			'border-left-width': '',
			'border-right-width': ''
		});
	}


	// Make the mouse cursor express that an event is not allowed in the current area
	function disableCursor() {
		$('body').addClass('fc-not-allowed');
	}


	// Returns the mouse cursor to its original look
	function enableCursor() {
		$('body').removeClass('fc-not-allowed');
	}


	// Given a total available height to fill, have `els` (essentially child rows) expand to accomodate.
	// By default, all elements that are shorter than the recommended height are expanded uniformly, not considering
	// any other els that are already too tall. if `shouldRedistribute` is on, it considers these tall rows and 
	// reduces the available height.
	function distributeHeight(els, availableHeight, shouldRedistribute) {

		// *FLOORING NOTE*: we floor in certain places because zoom can give inaccurate floating-point dimensions,
		// and it is better to be shorter than taller, to avoid creating unnecessary scrollbars.

		var minOffset1 = Math.floor(availableHeight / els.length); // for non-last element
		var minOffset2 = Math.floor(availableHeight - minOffset1 * (els.length - 1)); // for last element *FLOORING NOTE*
		var flexEls = []; // elements that are allowed to expand. array of DOM nodes
		var flexOffsets = []; // amount of vertical space it takes up
		var flexHeights = []; // actual css height
		var usedHeight = 0;

		undistributeHeight(els); // give all elements their natural height

		// find elements that are below the recommended height (expandable).
		// important to query for heights in a single first pass (to avoid reflow oscillation).
		els.each(function(i, el) {
			var minOffset = i === els.length - 1 ? minOffset2 : minOffset1;
			var naturalOffset = $(el).outerHeight(true);

			if (naturalOffset < minOffset) {
				flexEls.push(el);
				flexOffsets.push(naturalOffset);
				flexHeights.push($(el).height());
			}
			else {
				// this element stretches past recommended height (non-expandable). mark the space as occupied.
				usedHeight += naturalOffset;
			}
		});

		// readjust the recommended height to only consider the height available to non-maxed-out rows.
		if (shouldRedistribute) {
			availableHeight -= usedHeight;
			minOffset1 = Math.floor(availableHeight / flexEls.length);
			minOffset2 = Math.floor(availableHeight - minOffset1 * (flexEls.length - 1)); // *FLOORING NOTE*
		}

		// assign heights to all expandable elements
		$(flexEls).each(function(i, el) {
			var minOffset = i === flexEls.length - 1 ? minOffset2 : minOffset1;
			var naturalOffset = flexOffsets[i];
			var naturalHeight = flexHeights[i];
			var newHeight = minOffset - (naturalOffset - naturalHeight); // subtract the margin/padding

			if (naturalOffset < minOffset) { // we check this again because redistribution might have changed things
				$(el).height(newHeight);
			}
		});
	}


	// Undoes distrubuteHeight, restoring all els to their natural height
	function undistributeHeight(els) {
		els.height('');
	}


	// Given `els`, a jQuery set of <td> cells, find the cell with the largest natural width and set the widths of all the
	// cells to be that width.
	// PREREQUISITE: if you want a cell to take up width, it needs to have a single inner element w/ display:inline
	function matchCellWidths(els) {
		var maxInnerWidth = 0;

		els.find('> *').each(function(i, innerEl) {
			var innerWidth = $(innerEl).outerWidth();
			if (innerWidth > maxInnerWidth) {
				maxInnerWidth = innerWidth;
			}
		});

		maxInnerWidth++; // sometimes not accurate of width the text needs to stay on one line. insurance

		els.width(maxInnerWidth);

		return maxInnerWidth;
	}


	// Turns a container element into a scroller if its contents is taller than the allotted height.
	// Returns true if the element is now a scroller, false otherwise.
	// NOTE: this method is best because it takes weird zooming dimensions into account
	function setPotentialScroller(containerEl, height) {
		containerEl.height(height).addClass('fc-scroller');

		// are scrollbars needed?
		if (containerEl[0].scrollHeight - 1 > containerEl[0].clientHeight) { // !!! -1 because IE is often off-by-one :(
			return true;
		}

		unsetScroller(containerEl); // undo
		return false;
	}


	// Takes an element that might have been a scroller, and turns it back into a normal element.
	function unsetScroller(containerEl) {
		containerEl.height('').removeClass('fc-scroller');
	}


	/* General DOM Utilities
	----------------------------------------------------------------------------------------------------------------------*/

	FC.getOuterRect = getOuterRect;
	FC.getClientRect = getClientRect;
	FC.getContentRect = getContentRect;
	FC.getScrollbarWidths = getScrollbarWidths;


	// borrowed from https://github.com/jquery/jquery-ui/blob/1.11.0/ui/core.js#L51
	function getScrollParent(el) {
		var position = el.css('position'),
			scrollParent = el.parents().filter(function() {
				var parent = $(this);
				return (/(auto|scroll)/).test(
					parent.css('overflow') + parent.css('overflow-y') + parent.css('overflow-x')
				);
			}).eq(0);

		return position === 'fixed' || !scrollParent.length ? $(el[0].ownerDocument || document) : scrollParent;
	}


	// Queries the outer bounding area of a jQuery element.
	// Returns a rectangle with absolute coordinates: left, right (exclusive), top, bottom (exclusive).
	function getOuterRect(el) {
		var offset = el.offset();

		return {
			left: offset.left,
			right: offset.left + el.outerWidth(),
			top: offset.top,
			bottom: offset.top + el.outerHeight()
		};
	}


	// Queries the area within the margin/border/scrollbars of a jQuery element. Does not go within the padding.
	// Returns a rectangle with absolute coordinates: left, right (exclusive), top, bottom (exclusive).
	// NOTE: should use clientLeft/clientTop, but very unreliable cross-browser.
	function getClientRect(el) {
		var offset = el.offset();
		var scrollbarWidths = getScrollbarWidths(el);
		var left = offset.left + getCssFloat(el, 'border-left-width') + scrollbarWidths.left;
		var top = offset.top + getCssFloat(el, 'border-top-width') + scrollbarWidths.top;

		return {
			left: left,
			right: left + el[0].clientWidth, // clientWidth includes padding but NOT scrollbars
			top: top,
			bottom: top + el[0].clientHeight // clientHeight includes padding but NOT scrollbars
		};
	}


	// Queries the area within the margin/border/padding of a jQuery element. Assumed not to have scrollbars.
	// Returns a rectangle with absolute coordinates: left, right (exclusive), top, bottom (exclusive).
	function getContentRect(el) {
		var offset = el.offset(); // just outside of border, margin not included
		var left = offset.left + getCssFloat(el, 'border-left-width') + getCssFloat(el, 'padding-left');
		var top = offset.top + getCssFloat(el, 'border-top-width') + getCssFloat(el, 'padding-top');

		return {
			left: left,
			right: left + el.width(),
			top: top,
			bottom: top + el.height()
		};
	}


	// Returns the computed left/right/top/bottom scrollbar widths for the given jQuery element.
	// NOTE: should use clientLeft/clientTop, but very unreliable cross-browser.
	function getScrollbarWidths(el) {
		var leftRightWidth = el.innerWidth() - el[0].clientWidth; // the paddings cancel out, leaving the scrollbars
		var widths = {
			left: 0,
			right: 0,
			top: 0,
			bottom: el.innerHeight() - el[0].clientHeight // the paddings cancel out, leaving the bottom scrollbar
		};

		if (getIsLeftRtlScrollbars() && el.css('direction') == 'rtl') { // is the scrollbar on the left side?
			widths.left = leftRightWidth;
		}
		else {
			widths.right = leftRightWidth;
		}

		return widths;
	}


	// Logic for determining if, when the element is right-to-left, the scrollbar appears on the left side

	var _isLeftRtlScrollbars = null;

	function getIsLeftRtlScrollbars() { // responsible for caching the computation
		if (_isLeftRtlScrollbars === null) {
			_isLeftRtlScrollbars = computeIsLeftRtlScrollbars();
		}
		return _isLeftRtlScrollbars;
	}

	function computeIsLeftRtlScrollbars() { // creates an offscreen test element, then removes it
		var el = $('<div><div/></div>')
			.css({
				position: 'absolute',
				top: -1000,
				left: 0,
				border: 0,
				padding: 0,
				overflow: 'scroll',
				direction: 'rtl'
			})
			.appendTo('body');
		var innerEl = el.children();
		var res = innerEl.offset().left > el.offset().left; // is the inner div shifted to accommodate a left scrollbar?
		el.remove();
		return res;
	}


	// Retrieves a jQuery element's computed CSS value as a floating-point number.
	// If the queried value is non-numeric (ex: IE can return "medium" for border width), will just return zero.
	function getCssFloat(el, prop) {
		return parseFloat(el.css(prop)) || 0;
	}


	// Returns a boolean whether this was a left mouse click and no ctrl key (which means right click on Mac)
	function isPrimaryMouseButton(ev) {
		return ev.which == 1 && !ev.ctrlKey;
	}


	/* Geometry
	----------------------------------------------------------------------------------------------------------------------*/

	FC.intersectRects = intersectRects;

	// Returns a new rectangle that is the intersection of the two rectangles. If they don't intersect, returns false
	function intersectRects(rect1, rect2) {
		var res = {
			left: Math.max(rect1.left, rect2.left),
			right: Math.min(rect1.right, rect2.right),
			top: Math.max(rect1.top, rect2.top),
			bottom: Math.min(rect1.bottom, rect2.bottom)
		};

		if (res.left < res.right && res.top < res.bottom) {
			return res;
		}
		return false;
	}


	// Returns a new point that will have been moved to reside within the given rectangle
	function constrainPoint(point, rect) {
		return {
			left: Math.min(Math.max(point.left, rect.left), rect.right),
			top: Math.min(Math.max(point.top, rect.top), rect.bottom)
		};
	}


	// Returns a point that is the center of the given rectangle
	function getRectCenter(rect) {
		return {
			left: (rect.left + rect.right) / 2,
			top: (rect.top + rect.bottom) / 2
		};
	}


	// Subtracts point2's coordinates from point1's coordinates, returning a delta
	function diffPoints(point1, point2) {
		return {
			left: point1.left - point2.left,
			top: point1.top - point2.top
		};
	}


	/* Object Ordering by Field
	----------------------------------------------------------------------------------------------------------------------*/

	FC.parseFieldSpecs = parseFieldSpecs;
	FC.compareByFieldSpecs = compareByFieldSpecs;
	FC.compareByFieldSpec = compareByFieldSpec;
	FC.flexibleCompare = flexibleCompare;


	function parseFieldSpecs(input) {
		var specs = [];
		var tokens = [];
		var i, token;

		if (typeof input === 'string') {
			tokens = input.split(/\s*,\s*/);
		}
		else if (typeof input === 'function') {
			tokens = [ input ];
		}
		else if ($.isArray(input)) {
			tokens = input;
		}

		for (i = 0; i < tokens.length; i++) {
			token = tokens[i];

			if (typeof token === 'string') {
				specs.push(
					token.charAt(0) == '-' ?
						{ field: token.substring(1), order: -1 } :
						{ field: token, order: 1 }
				);
			}
			else if (typeof token === 'function') {
				specs.push({ func: token });
			}
		}

		return specs;
	}


	function compareByFieldSpecs(obj1, obj2, fieldSpecs) {
		var i;
		var cmp;

		for (i = 0; i < fieldSpecs.length; i++) {
			cmp = compareByFieldSpec(obj1, obj2, fieldSpecs[i]);
			if (cmp) {
				return cmp;
			}
		}

		return 0;
	}


	function compareByFieldSpec(obj1, obj2, fieldSpec) {
		if (fieldSpec.func) {
			return fieldSpec.func(obj1, obj2);
		}
		return flexibleCompare(obj1[fieldSpec.field], obj2[fieldSpec.field]) *
			(fieldSpec.order || 1);
	}


	function flexibleCompare(a, b) {
		if (!a && !b) {
			return 0;
		}
		if (b == null) {
			return -1;
		}
		if (a == null) {
			return 1;
		}
		if ($.type(a) === 'string' || $.type(b) === 'string') {
			return String(a).localeCompare(String(b));
		}
		return a - b;
	}


	/* FullCalendar-specific Misc Utilities
	----------------------------------------------------------------------------------------------------------------------*/


	// Computes the intersection of the two ranges. Returns undefined if no intersection.
	// Expects all dates to be normalized to the same timezone beforehand.
	// TODO: move to date section?
	function intersectRanges(subjectRange, constraintRange) {
		var subjectStart = subjectRange.start;
		var subjectEnd = subjectRange.end;
		var constraintStart = constraintRange.start;
		var constraintEnd = constraintRange.end;
		var segStart, segEnd;
		var isStart, isEnd;

		if (subjectEnd > constraintStart && subjectStart < constraintEnd) { // in bounds at all?

			if (subjectStart >= constraintStart) {
				segStart = subjectStart.clone();
				isStart = true;
			}
			else {
				segStart = constraintStart.clone();
				isStart =  false;
			}

			if (subjectEnd <= constraintEnd) {
				segEnd = subjectEnd.clone();
				isEnd = true;
			}
			else {
				segEnd = constraintEnd.clone();
				isEnd = false;
			}

			return {
				start: segStart,
				end: segEnd,
				isStart: isStart,
				isEnd: isEnd
			};
		}
	}


	/* Date Utilities
	----------------------------------------------------------------------------------------------------------------------*/

	FC.computeIntervalUnit = computeIntervalUnit;
	FC.divideRangeByDuration = divideRangeByDuration;
	FC.divideDurationByDuration = divideDurationByDuration;
	FC.multiplyDuration = multiplyDuration;
	FC.durationHasTime = durationHasTime;

	var dayIDs = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ];
	var intervalUnits = [ 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond' ];


	// Diffs the two moments into a Duration where full-days are recorded first, then the remaining time.
	// Moments will have their timezones normalized.
	function diffDayTime(a, b) {
		return moment.duration({
			days: a.clone().stripTime().diff(b.clone().stripTime(), 'days'),
			ms: a.time() - b.time() // time-of-day from day start. disregards timezone
		});
	}


	// Diffs the two moments via their start-of-day (regardless of timezone). Produces whole-day durations.
	function diffDay(a, b) {
		return moment.duration({
			days: a.clone().stripTime().diff(b.clone().stripTime(), 'days')
		});
	}


	// Diffs two moments, producing a duration, made of a whole-unit-increment of the given unit. Uses rounding.
	function diffByUnit(a, b, unit) {
		return moment.duration(
			Math.round(a.diff(b, unit, true)), // returnFloat=true
			unit
		);
	}


	// Computes the unit name of the largest whole-unit period of time.
	// For example, 48 hours will be "days" whereas 49 hours will be "hours".
	// Accepts start/end, a range object, or an original duration object.
	function computeIntervalUnit(start, end) {
		var i, unit;
		var val;

		for (i = 0; i < intervalUnits.length; i++) {
			unit = intervalUnits[i];
			val = computeRangeAs(unit, start, end);

			if (val >= 1 && isInt(val)) {
				break;
			}
		}

		return unit; // will be "milliseconds" if nothing else matches
	}


	// Computes the number of units (like "hours") in the given range.
	// Range can be a {start,end} object, separate start/end args, or a Duration.
	// Results are based on Moment's .as() and .diff() methods, so results can depend on internal handling
	// of month-diffing logic (which tends to vary from version to version).
	function computeRangeAs(unit, start, end) {

		if (end != null) { // given start, end
			return end.diff(start, unit, true);
		}
		else if (moment.isDuration(start)) { // given duration
			return start.as(unit);
		}
		else { // given { start, end } range object
			return start.end.diff(start.start, unit, true);
		}
	}


	// Intelligently divides a range (specified by a start/end params) by a duration
	function divideRangeByDuration(start, end, dur) {
		var months;

		if (durationHasTime(dur)) {
			return (end - start) / dur;
		}
		months = dur.asMonths();
		if (Math.abs(months) >= 1 && isInt(months)) {
			return end.diff(start, 'months', true) / months;
		}
		return end.diff(start, 'days', true) / dur.asDays();
	}


	// Intelligently divides one duration by another
	function divideDurationByDuration(dur1, dur2) {
		var months1, months2;

		if (durationHasTime(dur1) || durationHasTime(dur2)) {
			return dur1 / dur2;
		}
		months1 = dur1.asMonths();
		months2 = dur2.asMonths();
		if (
			Math.abs(months1) >= 1 && isInt(months1) &&
			Math.abs(months2) >= 1 && isInt(months2)
		) {
			return months1 / months2;
		}
		return dur1.asDays() / dur2.asDays();
	}


	// Intelligently multiplies a duration by a number
	function multiplyDuration(dur, n) {
		var months;

		if (durationHasTime(dur)) {
			return moment.duration(dur * n);
		}
		months = dur.asMonths();
		if (Math.abs(months) >= 1 && isInt(months)) {
			return moment.duration({ months: months * n });
		}
		return moment.duration({ days: dur.asDays() * n });
	}


	// Returns a boolean about whether the given duration has any time parts (hours/minutes/seconds/ms)
	function durationHasTime(dur) {
		return Boolean(dur.hours() || dur.minutes() || dur.seconds() || dur.milliseconds());
	}


	function isNativeDate(input) {
		return  Object.prototype.toString.call(input) === '[object Date]' || input instanceof Date;
	}


	// Returns a boolean about whether the given input is a time string, like "06:40:00" or "06:00"
	function isTimeString(str) {
		return /^\d+\:\d+(?:\:\d+\.?(?:\d{3})?)?$/.test(str);
	}


	/* Logging and Debug
	----------------------------------------------------------------------------------------------------------------------*/

	FC.log = function() {
		var console = window.console;

		if (console && console.log) {
			return console.log.apply(console, arguments);
		}
	};

	FC.warn = function() {
		var console = window.console;

		if (console && console.warn) {
			return console.warn.apply(console, arguments);
		}
		else {
			return FC.log.apply(FC, arguments);
		}
	};


	/* General Utilities
	----------------------------------------------------------------------------------------------------------------------*/

	var hasOwnPropMethod = {}.hasOwnProperty;


	// Merges an array of objects into a single object.
	// The second argument allows for an array of property names who's object values will be merged together.
	function mergeProps(propObjs, complexProps) {
		var dest = {};
		var i, name;
		var complexObjs;
		var j, val;
		var props;

		if (complexProps) {
			for (i = 0; i < complexProps.length; i++) {
				name = complexProps[i];
				complexObjs = [];

				// collect the trailing object values, stopping when a non-object is discovered
				for (j = propObjs.length - 1; j >= 0; j--) {
					val = propObjs[j][name];

					if (typeof val === 'object') {
						complexObjs.unshift(val);
					}
					else if (val !== undefined) {
						dest[name] = val; // if there were no objects, this value will be used
						break;
					}
				}

				// if the trailing values were objects, use the merged value
				if (complexObjs.length) {
					dest[name] = mergeProps(complexObjs);
				}
			}
		}

		// copy values into the destination, going from last to first
		for (i = propObjs.length - 1; i >= 0; i--) {
			props = propObjs[i];

			for (name in props) {
				if (!(name in dest)) { // if already assigned by previous props or complex props, don't reassign
					dest[name] = props[name];
				}
			}
		}

		return dest;
	}


	// Create an object that has the given prototype. Just like Object.create
	function createObject(proto) {
		var f = function() {};
		f.prototype = proto;
		return new f();
	}


	function copyOwnProps(src, dest) {
		for (var name in src) {
			if (hasOwnProp(src, name)) {
				dest[name] = src[name];
			}
		}
	}


	// Copies over certain methods with the same names as Object.prototype methods. Overcomes an IE<=8 bug:
	// https://developer.mozilla.org/en-US/docs/ECMAScript_DontEnum_attribute#JScript_DontEnum_Bug
	function copyNativeMethods(src, dest) {
		var names = [ 'constructor', 'toString', 'valueOf' ];
		var i, name;

		for (i = 0; i < names.length; i++) {
			name = names[i];

			if (src[name] !== Object.prototype[name]) {
				dest[name] = src[name];
			}
		}
	}


	function hasOwnProp(obj, name) {
		return hasOwnPropMethod.call(obj, name);
	}


	// Is the given value a non-object non-function value?
	function isAtomic(val) {
		return /undefined|null|boolean|number|string/.test($.type(val));
	}


	function applyAll(functions, thisObj, args) {
		if ($.isFunction(functions)) {
			functions = [ functions ];
		}
		if (functions) {
			var i;
			var ret;
			for (i=0; i<functions.length; i++) {
				ret = functions[i].apply(thisObj, args) || ret;
			}
			return ret;
		}
	}


	function firstDefined() {
		for (var i=0; i<arguments.length; i++) {
			if (arguments[i] !== undefined) {
				return arguments[i];
			}
		}
	}


	function htmlEscape(s) {
		return (s + '').replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/'/g, '&#039;')
			.replace(/"/g, '&quot;')
			.replace(/\n/g, '<br />');
	}


	function stripHtmlEntities(text) {
		return text.replace(/&.*?;/g, '');
	}


	// Given a hash of CSS properties, returns a string of CSS.
	// Uses property names as-is (no camel-case conversion). Will not make statements for null/undefined values.
	function cssToStr(cssProps) {
		var statements = [];

		$.each(cssProps, function(name, val) {
			if (val != null) {
				statements.push(name + ':' + val);
			}
		});

		return statements.join(';');
	}


	function capitaliseFirstLetter(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}


	function compareNumbers(a, b) { // for .sort()
		return a - b;
	}


	function isInt(n) {
		return n % 1 === 0;
	}


	// Returns a method bound to the given object context.
	// Just like one of the jQuery.proxy signatures, but without the undesired behavior of treating the same method with
	// different contexts as identical when binding/unbinding events.
	function proxy(obj, methodName) {
		var method = obj[methodName];

		return function() {
			return method.apply(obj, arguments);
		};
	}


	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds.
	// https://github.com/jashkenas/underscore/blob/1.6.0/underscore.js#L714
	function debounce(func, wait) {
		var timeoutId;
		var args;
		var context;
		var timestamp; // of most recent call
		var later = function() {
			var last = +new Date() - timestamp;
			if (last < wait && last > 0) {
				timeoutId = setTimeout(later, wait - last);
			}
			else {
				timeoutId = null;
				func.apply(context, args);
				if (!timeoutId) {
					context = args = null;
				}
			}
		};

		return function() {
			context = this;
			args = arguments;
			timestamp = +new Date();
			if (!timeoutId) {
				timeoutId = setTimeout(later, wait);
			}
		};
	}

	;;

	var ambigDateOfMonthRegex = /^\s*\d{4}-\d\d$/;
	var ambigTimeOrZoneRegex =
		/^\s*\d{4}-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?)?$/;
	var newMomentProto = moment.fn; // where we will attach our new methods
	var oldMomentProto = $.extend({}, newMomentProto); // copy of original moment methods
	var allowValueOptimization;
	var setUTCValues; // function defined below
	var setLocalValues; // function defined below


	// Creating
	// -------------------------------------------------------------------------------------------------

	// Creates a new moment, similar to the vanilla moment(...) constructor, but with
	// extra features (ambiguous time, enhanced formatting). When given an existing moment,
	// it will function as a clone (and retain the zone of the moment). Anything else will
	// result in a moment in the local zone.
	FC.moment = function() {
		return makeMoment(arguments);
	};

	// Sames as FC.moment, but forces the resulting moment to be in the UTC timezone.
	FC.moment.utc = function() {
		var mom = makeMoment(arguments, true);

		// Force it into UTC because makeMoment doesn't guarantee it
		// (if given a pre-existing moment for example)
		if (mom.hasTime()) { // don't give ambiguously-timed moments a UTC zone
			mom.utc();
		}

		return mom;
	};

	// Same as FC.moment, but when given an ISO8601 string, the timezone offset is preserved.
	// ISO8601 strings with no timezone offset will become ambiguously zoned.
	FC.moment.parseZone = function() {
		return makeMoment(arguments, true, true);
	};

	// Builds an enhanced moment from args. When given an existing moment, it clones. When given a
	// native Date, or called with no arguments (the current time), the resulting moment will be local.
	// Anything else needs to be "parsed" (a string or an array), and will be affected by:
	//    parseAsUTC - if there is no zone information, should we parse the input in UTC?
	//    parseZone - if there is zone information, should we force the zone of the moment?
	function makeMoment(args, parseAsUTC, parseZone) {
		var input = args[0];
		var isSingleString = args.length == 1 && typeof input === 'string';
		var isAmbigTime;
		var isAmbigZone;
		var ambigMatch;
		var mom;

		if (moment.isMoment(input)) {
			mom = moment.apply(null, args); // clone it
			transferAmbigs(input, mom); // the ambig flags weren't transfered with the clone
		}
		else if (isNativeDate(input) || input === undefined) {
			mom = moment.apply(null, args); // will be local
		}
		else { // "parsing" is required
			isAmbigTime = false;
			isAmbigZone = false;

			if (isSingleString) {
				if (ambigDateOfMonthRegex.test(input)) {
					// accept strings like '2014-05', but convert to the first of the month
					input += '-01';
					args = [ input ]; // for when we pass it on to moment's constructor
					isAmbigTime = true;
					isAmbigZone = true;
				}
				else if ((ambigMatch = ambigTimeOrZoneRegex.exec(input))) {
					isAmbigTime = !ambigMatch[5]; // no time part?
					isAmbigZone = true;
				}
			}
			else if ($.isArray(input)) {
				// arrays have no timezone information, so assume ambiguous zone
				isAmbigZone = true;
			}
			// otherwise, probably a string with a format

			if (parseAsUTC || isAmbigTime) {
				mom = moment.utc.apply(moment, args);
			}
			else {
				mom = moment.apply(null, args);
			}

			if (isAmbigTime) {
				mom._ambigTime = true;
				mom._ambigZone = true; // ambiguous time always means ambiguous zone
			}
			else if (parseZone) { // let's record the inputted zone somehow
				if (isAmbigZone) {
					mom._ambigZone = true;
				}
				else if (isSingleString) {
					if (mom.utcOffset) {
						mom.utcOffset(input); // if not a valid zone, will assign UTC
					}
					else {
						mom.zone(input); // for moment-pre-2.9
					}
				}
			}
		}

		mom._fullCalendar = true; // flag for extended functionality

		return mom;
	}


	// A clone method that works with the flags related to our enhanced functionality.
	// In the future, use moment.momentProperties
	newMomentProto.clone = function() {
		var mom = oldMomentProto.clone.apply(this, arguments);

		// these flags weren't transfered with the clone
		transferAmbigs(this, mom);
		if (this._fullCalendar) {
			mom._fullCalendar = true;
		}

		return mom;
	};


	// Week Number
	// -------------------------------------------------------------------------------------------------


	// Returns the week number, considering the locale's custom week number calcuation
	// `weeks` is an alias for `week`
	newMomentProto.week = newMomentProto.weeks = function(input) {
		var weekCalc = (this._locale || this._lang) // works pre-moment-2.8
			._fullCalendar_weekCalc;

		if (input == null && typeof weekCalc === 'function') { // custom function only works for getter
			return weekCalc(this);
		}
		else if (weekCalc === 'ISO') {
			return oldMomentProto.isoWeek.apply(this, arguments); // ISO getter/setter
		}

		return oldMomentProto.week.apply(this, arguments); // local getter/setter
	};


	// Time-of-day
	// -------------------------------------------------------------------------------------------------

	// GETTER
	// Returns a Duration with the hours/minutes/seconds/ms values of the moment.
	// If the moment has an ambiguous time, a duration of 00:00 will be returned.
	//
	// SETTER
	// You can supply a Duration, a Moment, or a Duration-like argument.
	// When setting the time, and the moment has an ambiguous time, it then becomes unambiguous.
	newMomentProto.time = function(time) {

		// Fallback to the original method (if there is one) if this moment wasn't created via FullCalendar.
		// `time` is a generic enough method name where this precaution is necessary to avoid collisions w/ other plugins.
		if (!this._fullCalendar) {
			return oldMomentProto.time.apply(this, arguments);
		}

		if (time == null) { // getter
			return moment.duration({
				hours: this.hours(),
				minutes: this.minutes(),
				seconds: this.seconds(),
				milliseconds: this.milliseconds()
			});
		}
		else { // setter

			this._ambigTime = false; // mark that the moment now has a time

			if (!moment.isDuration(time) && !moment.isMoment(time)) {
				time = moment.duration(time);
			}

			// The day value should cause overflow (so 24 hours becomes 00:00:00 of next day).
			// Only for Duration times, not Moment times.
			var dayHours = 0;
			if (moment.isDuration(time)) {
				dayHours = Math.floor(time.asDays()) * 24;
			}

			// We need to set the individual fields.
			// Can't use startOf('day') then add duration. In case of DST at start of day.
			return this.hours(dayHours + time.hours())
				.minutes(time.minutes())
				.seconds(time.seconds())
				.milliseconds(time.milliseconds());
		}
	};

	// Converts the moment to UTC, stripping out its time-of-day and timezone offset,
	// but preserving its YMD. A moment with a stripped time will display no time
	// nor timezone offset when .format() is called.
	newMomentProto.stripTime = function() {
		var a;

		if (!this._ambigTime) {

			// get the values before any conversion happens
			a = this.toArray(); // array of y/m/d/h/m/s/ms

			// TODO: use keepLocalTime in the future
			this.utc(); // set the internal UTC flag (will clear the ambig flags)
			setUTCValues(this, a.slice(0, 3)); // set the year/month/date. time will be zero

			// Mark the time as ambiguous. This needs to happen after the .utc() call, which might call .utcOffset(),
			// which clears all ambig flags. Same with setUTCValues with moment-timezone.
			this._ambigTime = true;
			this._ambigZone = true; // if ambiguous time, also ambiguous timezone offset
		}

		return this; // for chaining
	};

	// Returns if the moment has a non-ambiguous time (boolean)
	newMomentProto.hasTime = function() {
		return !this._ambigTime;
	};


	// Timezone
	// -------------------------------------------------------------------------------------------------

	// Converts the moment to UTC, stripping out its timezone offset, but preserving its
	// YMD and time-of-day. A moment with a stripped timezone offset will display no
	// timezone offset when .format() is called.
	// TODO: look into Moment's keepLocalTime functionality
	newMomentProto.stripZone = function() {
		var a, wasAmbigTime;

		if (!this._ambigZone) {

			// get the values before any conversion happens
			a = this.toArray(); // array of y/m/d/h/m/s/ms
			wasAmbigTime = this._ambigTime;

			this.utc(); // set the internal UTC flag (might clear the ambig flags, depending on Moment internals)
			setUTCValues(this, a); // will set the year/month/date/hours/minutes/seconds/ms

			// the above call to .utc()/.utcOffset() unfortunately might clear the ambig flags, so restore
			this._ambigTime = wasAmbigTime || false;

			// Mark the zone as ambiguous. This needs to happen after the .utc() call, which might call .utcOffset(),
			// which clears the ambig flags. Same with setUTCValues with moment-timezone.
			this._ambigZone = true;
		}

		return this; // for chaining
	};

	// Returns of the moment has a non-ambiguous timezone offset (boolean)
	newMomentProto.hasZone = function() {
		return !this._ambigZone;
	};


	// this method implicitly marks a zone
	newMomentProto.local = function() {
		var a = this.toArray(); // year,month,date,hours,minutes,seconds,ms as an array
		var wasAmbigZone = this._ambigZone;

		oldMomentProto.local.apply(this, arguments);

		// ensure non-ambiguous
		// this probably already happened via local() -> utcOffset(), but don't rely on Moment's internals
		this._ambigTime = false;
		this._ambigZone = false;

		if (wasAmbigZone) {
			// If the moment was ambiguously zoned, the date fields were stored as UTC.
			// We want to preserve these, but in local time.
			// TODO: look into Moment's keepLocalTime functionality
			setLocalValues(this, a);
		}

		return this; // for chaining
	};


	// implicitly marks a zone
	newMomentProto.utc = function() {
		oldMomentProto.utc.apply(this, arguments);

		// ensure non-ambiguous
		// this probably already happened via utc() -> utcOffset(), but don't rely on Moment's internals
		this._ambigTime = false;
		this._ambigZone = false;

		return this;
	};


	// methods for arbitrarily manipulating timezone offset.
	// should clear time/zone ambiguity when called.
	$.each([
		'zone', // only in moment-pre-2.9. deprecated afterwards
		'utcOffset'
	], function(i, name) {
		if (oldMomentProto[name]) { // original method exists?

			// this method implicitly marks a zone (will probably get called upon .utc() and .local())
			newMomentProto[name] = function(tzo) {

				if (tzo != null) { // setter
					// these assignments needs to happen before the original zone method is called.
					// I forget why, something to do with a browser crash.
					this._ambigTime = false;
					this._ambigZone = false;
				}

				return oldMomentProto[name].apply(this, arguments);
			};
		}
	});


	// Formatting
	// -------------------------------------------------------------------------------------------------

	newMomentProto.format = function() {
		if (this._fullCalendar && arguments[0]) { // an enhanced moment? and a format string provided?
			return formatDate(this, arguments[0]); // our extended formatting
		}
		if (this._ambigTime) {
			return oldMomentFormat(this, 'YYYY-MM-DD');
		}
		if (this._ambigZone) {
			return oldMomentFormat(this, 'YYYY-MM-DD[T]HH:mm:ss');
		}
		return oldMomentProto.format.apply(this, arguments);
	};

	newMomentProto.toISOString = function() {
		if (this._ambigTime) {
			return oldMomentFormat(this, 'YYYY-MM-DD');
		}
		if (this._ambigZone) {
			return oldMomentFormat(this, 'YYYY-MM-DD[T]HH:mm:ss');
		}
		return oldMomentProto.toISOString.apply(this, arguments);
	};


	// Querying
	// -------------------------------------------------------------------------------------------------

	// Is the moment within the specified range? `end` is exclusive.
	// FYI, this method is not a standard Moment method, so always do our enhanced logic.
	newMomentProto.isWithin = function(start, end) {
		var a = commonlyAmbiguate([ this, start, end ]);
		return a[0] >= a[1] && a[0] < a[2];
	};

	// When isSame is called with units, timezone ambiguity is normalized before the comparison happens.
	// If no units specified, the two moments must be identically the same, with matching ambig flags.
	newMomentProto.isSame = function(input, units) {
		var a;

		// only do custom logic if this is an enhanced moment
		if (!this._fullCalendar) {
			return oldMomentProto.isSame.apply(this, arguments);
		}

		if (units) {
			a = commonlyAmbiguate([ this, input ], true); // normalize timezones but don't erase times
			return oldMomentProto.isSame.call(a[0], a[1], units);
		}
		else {
			input = FC.moment.parseZone(input); // normalize input
			return oldMomentProto.isSame.call(this, input) &&
				Boolean(this._ambigTime) === Boolean(input._ambigTime) &&
				Boolean(this._ambigZone) === Boolean(input._ambigZone);
		}
	};

	// Make these query methods work with ambiguous moments
	$.each([
		'isBefore',
		'isAfter'
	], function(i, methodName) {
		newMomentProto[methodName] = function(input, units) {
			var a;

			// only do custom logic if this is an enhanced moment
			if (!this._fullCalendar) {
				return oldMomentProto[methodName].apply(this, arguments);
			}

			a = commonlyAmbiguate([ this, input ]);
			return oldMomentProto[methodName].call(a[0], a[1], units);
		};
	});


	// Misc Internals
	// -------------------------------------------------------------------------------------------------

	// given an array of moment-like inputs, return a parallel array w/ moments similarly ambiguated.
	// for example, of one moment has ambig time, but not others, all moments will have their time stripped.
	// set `preserveTime` to `true` to keep times, but only normalize zone ambiguity.
	// returns the original moments if no modifications are necessary.
	function commonlyAmbiguate(inputs, preserveTime) {
		var anyAmbigTime = false;
		var anyAmbigZone = false;
		var len = inputs.length;
		var moms = [];
		var i, mom;

		// parse inputs into real moments and query their ambig flags
		for (i = 0; i < len; i++) {
			mom = inputs[i];
			if (!moment.isMoment(mom)) {
				mom = FC.moment.parseZone(mom);
			}
			anyAmbigTime = anyAmbigTime || mom._ambigTime;
			anyAmbigZone = anyAmbigZone || mom._ambigZone;
			moms.push(mom);
		}

		// strip each moment down to lowest common ambiguity
		// use clones to avoid modifying the original moments
		for (i = 0; i < len; i++) {
			mom = moms[i];
			if (!preserveTime && anyAmbigTime && !mom._ambigTime) {
				moms[i] = mom.clone().stripTime();
			}
			else if (anyAmbigZone && !mom._ambigZone) {
				moms[i] = mom.clone().stripZone();
			}
		}

		return moms;
	}

	// Transfers all the flags related to ambiguous time/zone from the `src` moment to the `dest` moment
	// TODO: look into moment.momentProperties for this.
	function transferAmbigs(src, dest) {
		if (src._ambigTime) {
			dest._ambigTime = true;
		}
		else if (dest._ambigTime) {
			dest._ambigTime = false;
		}

		if (src._ambigZone) {
			dest._ambigZone = true;
		}
		else if (dest._ambigZone) {
			dest._ambigZone = false;
		}
	}


	// Sets the year/month/date/etc values of the moment from the given array.
	// Inefficient because it calls each individual setter.
	function setMomentValues(mom, a) {
		mom.year(a[0] || 0)
			.month(a[1] || 0)
			.date(a[2] || 0)
			.hours(a[3] || 0)
			.minutes(a[4] || 0)
			.seconds(a[5] || 0)
			.milliseconds(a[6] || 0);
	}

	// Can we set the moment's internal date directly?
	allowValueOptimization = '_d' in moment() && 'updateOffset' in moment;

	// Utility function. Accepts a moment and an array of the UTC year/month/date/etc values to set.
	// Assumes the given moment is already in UTC mode.
	setUTCValues = allowValueOptimization ? function(mom, a) {
		// simlate what moment's accessors do
		mom._d.setTime(Date.UTC.apply(Date, a));
		moment.updateOffset(mom, false); // keepTime=false
	} : setMomentValues;

	// Utility function. Accepts a moment and an array of the local year/month/date/etc values to set.
	// Assumes the given moment is already in local mode.
	setLocalValues = allowValueOptimization ? function(mom, a) {
		// simlate what moment's accessors do
		mom._d.setTime(+new Date( // FYI, there is now way to apply an array of args to a constructor
			a[0] || 0,
			a[1] || 0,
			a[2] || 0,
			a[3] || 0,
			a[4] || 0,
			a[5] || 0,
			a[6] || 0
		));
		moment.updateOffset(mom, false); // keepTime=false
	} : setMomentValues;

	;;

	// Single Date Formatting
	// -------------------------------------------------------------------------------------------------


	// call this if you want Moment's original format method to be used
	function oldMomentFormat(mom, formatStr) {
		return oldMomentProto.format.call(mom, formatStr); // oldMomentProto defined in moment-ext.js
	}


	// Formats `date` with a Moment formatting string, but allow our non-zero areas and
	// additional token.
	function formatDate(date, formatStr) {
		return formatDateWithChunks(date, getFormatStringChunks(formatStr));
	}


	function formatDateWithChunks(date, chunks) {
		var s = '';
		var i;

		for (i=0; i<chunks.length; i++) {
			s += formatDateWithChunk(date, chunks[i]);
		}

		return s;
	}


	// addition formatting tokens we want recognized
	var tokenOverrides = {
		t: function(date) { // "a" or "p"
			return oldMomentFormat(date, 'a').charAt(0);
		},
		T: function(date) { // "A" or "P"
			return oldMomentFormat(date, 'A').charAt(0);
		}
	};


	function formatDateWithChunk(date, chunk) {
		var token;
		var maybeStr;

		if (typeof chunk === 'string') { // a literal string
			return chunk;
		}
		else if ((token = chunk.token)) { // a token, like "YYYY"
			if (tokenOverrides[token]) {
				return tokenOverrides[token](date); // use our custom token
			}
			return oldMomentFormat(date, token);
		}
		else if (chunk.maybe) { // a grouping of other chunks that must be non-zero
			maybeStr = formatDateWithChunks(date, chunk.maybe);
			if (maybeStr.match(/[1-9]/)) {
				return maybeStr;
			}
		}

		return '';
	}


	// Date Range Formatting
	// -------------------------------------------------------------------------------------------------
	// TODO: make it work with timezone offset

	// Using a formatting string meant for a single date, generate a range string, like
	// "Sep 2 - 9 2013", that intelligently inserts a separator where the dates differ.
	// If the dates are the same as far as the format string is concerned, just return a single
	// rendering of one date, without any separator.
	function formatRange(date1, date2, formatStr, separator, isRTL) {
		var localeData;

		date1 = FC.moment.parseZone(date1);
		date2 = FC.moment.parseZone(date2);

		localeData = (date1.localeData || date1.lang).call(date1); // works with moment-pre-2.8

		// Expand localized format strings, like "LL" -> "MMMM D YYYY"
		formatStr = localeData.longDateFormat(formatStr) || formatStr;
		// BTW, this is not important for `formatDate` because it is impossible to put custom tokens
		// or non-zero areas in Moment's localized format strings.

		separator = separator || ' - ';

		return formatRangeWithChunks(
			date1,
			date2,
			getFormatStringChunks(formatStr),
			separator,
			isRTL
		);
	}
	FC.formatRange = formatRange; // expose


	function formatRangeWithChunks(date1, date2, chunks, separator, isRTL) {
		var unzonedDate1 = date1.clone().stripZone(); // for formatSimilarChunk
		var unzonedDate2 = date2.clone().stripZone(); // "
		var chunkStr; // the rendering of the chunk
		var leftI;
		var leftStr = '';
		var rightI;
		var rightStr = '';
		var middleI;
		var middleStr1 = '';
		var middleStr2 = '';
		var middleStr = '';

		// Start at the leftmost side of the formatting string and continue until you hit a token
		// that is not the same between dates.
		for (leftI=0; leftI<chunks.length; leftI++) {
			chunkStr = formatSimilarChunk(date1, date2, unzonedDate1, unzonedDate2, chunks[leftI]);
			if (chunkStr === false) {
				break;
			}
			leftStr += chunkStr;
		}

		// Similarly, start at the rightmost side of the formatting string and move left
		for (rightI=chunks.length-1; rightI>leftI; rightI--) {
			chunkStr = formatSimilarChunk(date1, date2, unzonedDate1, unzonedDate2,  chunks[rightI]);
			if (chunkStr === false) {
				break;
			}
			rightStr = chunkStr + rightStr;
		}

		// The area in the middle is different for both of the dates.
		// Collect them distinctly so we can jam them together later.
		for (middleI=leftI; middleI<=rightI; middleI++) {
			middleStr1 += formatDateWithChunk(date1, chunks[middleI]);
			middleStr2 += formatDateWithChunk(date2, chunks[middleI]);
		}

		if (middleStr1 || middleStr2) {
			if (isRTL) {
				middleStr = middleStr2 + separator + middleStr1;
			}
			else {
				middleStr = middleStr1 + separator + middleStr2;
			}
		}

		return leftStr + middleStr + rightStr;
	}


	var similarUnitMap = {
		Y: 'year',
		M: 'month',
		D: 'day', // day of month
		d: 'day', // day of week
		// prevents a separator between anything time-related...
		A: 'second', // AM/PM
		a: 'second', // am/pm
		T: 'second', // A/P
		t: 'second', // a/p
		H: 'second', // hour (24)
		h: 'second', // hour (12)
		m: 'second', // minute
		s: 'second' // second
	};
	// TODO: week maybe?


	// Given a formatting chunk, and given that both dates are similar in the regard the
	// formatting chunk is concerned, format date1 against `chunk`. Otherwise, return `false`.
	function formatSimilarChunk(date1, date2, unzonedDate1, unzonedDate2, chunk) {
		var token;
		var unit;

		if (typeof chunk === 'string') { // a literal string
			return chunk;
		}
		else if ((token = chunk.token)) {
			unit = similarUnitMap[token.charAt(0)];

			// are the dates the same for this unit of measurement?
			// use the unzoned dates for this calculation because unreliable when near DST (bug #2396)
			if (unit && unzonedDate1.isSame(unzonedDate2, unit)) {
				return oldMomentFormat(date1, token); // would be the same if we used `date2`
				// BTW, don't support custom tokens
			}
		}

		return false; // the chunk is NOT the same for the two dates
		// BTW, don't support splitting on non-zero areas
	}


	// Chunking Utils
	// -------------------------------------------------------------------------------------------------


	var formatStringChunkCache = {};


	function getFormatStringChunks(formatStr) {
		if (formatStr in formatStringChunkCache) {
			return formatStringChunkCache[formatStr];
		}
		return (formatStringChunkCache[formatStr] = chunkFormatString(formatStr));
	}


	// Break the formatting string into an array of chunks
	function chunkFormatString(formatStr) {
		var chunks = [];
		var chunker = /\[([^\]]*)\]|\(([^\)]*)\)|(LTS|LT|(\w)\4*o?)|([^\w\[\(]+)/g; // TODO: more descrimination
		var match;

		while ((match = chunker.exec(formatStr))) {
			if (match[1]) { // a literal string inside [ ... ]
				chunks.push(match[1]);
			}
			else if (match[2]) { // non-zero formatting inside ( ... )
				chunks.push({ maybe: chunkFormatString(match[2]) });
			}
			else if (match[3]) { // a formatting token
				chunks.push({ token: match[3] });
			}
			else if (match[5]) { // an unenclosed literal string
				chunks.push(match[5]);
			}
		}

		return chunks;
	}

	;;

	FC.Class = Class; // export

	// Class that all other classes will inherit from
	function Class() { }


	// Called on a class to create a subclass.
	// Last argument contains instance methods. Any argument before the last are considered mixins.
	Class.extend = function() {
		var len = arguments.length;
		var i;
		var members;

		for (i = 0; i < len; i++) {
			members = arguments[i];
			if (i < len - 1) { // not the last argument?
				mixIntoClass(this, members);
			}
		}

		return extendClass(this, members || {}); // members will be undefined if no arguments
	};


	// Adds new member variables/methods to the class's prototype.
	// Can be called with another class, or a plain object hash containing new members.
	Class.mixin = function(members) {
		mixIntoClass(this, members);
	};


	function extendClass(superClass, members) {
		var subClass;

		// ensure a constructor for the subclass, forwarding all arguments to the super-constructor if it doesn't exist
		if (hasOwnProp(members, 'constructor')) {
			subClass = members.constructor;
		}
		if (typeof subClass !== 'function') {
			subClass = members.constructor = function() {
				superClass.apply(this, arguments);
			};
		}

		// build the base prototype for the subclass, which is an new object chained to the superclass's prototype
		subClass.prototype = createObject(superClass.prototype);

		// copy each member variable/method onto the the subclass's prototype
		copyOwnProps(members, subClass.prototype);
		copyNativeMethods(members, subClass.prototype); // hack for IE8

		// copy over all class variables/methods to the subclass, such as `extend` and `mixin`
		copyOwnProps(superClass, subClass);

		return subClass;
	}


	function mixIntoClass(theClass, members) {
		copyOwnProps(members.prototype || members, theClass.prototype); // TODO: copyNativeMethods?
	}
	;;

	var Emitter = FC.Emitter = Class.extend({

		callbackHash: null,


		on: function(name, callback) {
			this.getCallbacks(name).add(callback);
			return this; // for chaining
		},


		off: function(name, callback) {
			this.getCallbacks(name).remove(callback);
			return this; // for chaining
		},


		trigger: function(name) { // args...
			var args = Array.prototype.slice.call(arguments, 1);

			this.triggerWith(name, this, args);

			return this; // for chaining
		},


		triggerWith: function(name, context, args) {
			var callbacks = this.getCallbacks(name);

			callbacks.fireWith(context, args);

			return this; // for chaining
		},


		getCallbacks: function(name) {
			var callbacks;

			if (!this.callbackHash) {
				this.callbackHash = {};
			}

			callbacks = this.callbackHash[name];
			if (!callbacks) {
				callbacks = this.callbackHash[name] = $.Callbacks();
			}

			return callbacks;
		}

	});
	;;

	/* A rectangular panel that is absolutely positioned over other content
	------------------------------------------------------------------------------------------------------------------------
	Options:
		- className (string)
		- content (HTML string or jQuery element set)
		- parentEl
		- top
		- left
		- right (the x coord of where the right edge should be. not a "CSS" right)
		- autoHide (boolean)
		- show (callback)
		- hide (callback)
	*/

	var Popover = Class.extend({

		isHidden: true,
		options: null,
		el: null, // the container element for the popover. generated by this object
		documentMousedownProxy: null, // document mousedown handler bound to `this`
		margin: 10, // the space required between the popover and the edges of the scroll container


		constructor: function(options) {
			this.options = options || {};
		},


		// Shows the popover on the specified position. Renders it if not already
		show: function() {
			if (this.isHidden) {
				if (!this.el) {
					this.render();
				}
				this.el.show();
				this.position();
				this.isHidden = false;
				this.trigger('show');
			}
		},


		// Hides the popover, through CSS, but does not remove it from the DOM
		hide: function() {
			if (!this.isHidden) {
				this.el.hide();
				this.isHidden = true;
				this.trigger('hide');
			}
		},


		// Creates `this.el` and renders content inside of it
		render: function() {
			var _this = this;
			var options = this.options;

			this.el = $('<div class="fc-popover"/>')
				.addClass(options.className || '')
				.css({
					// position initially to the top left to avoid creating scrollbars
					top: 0,
					left: 0
				})
				.append(options.content)
				.appendTo(options.parentEl);

			// when a click happens on anything inside with a 'fc-close' className, hide the popover
			this.el.on('click', '.fc-close', function() {
				_this.hide();
			});

			if (options.autoHide) {
				$(document).on('mousedown', this.documentMousedownProxy = proxy(this, 'documentMousedown'));
			}
		},


		// Triggered when the user clicks *anywhere* in the document, for the autoHide feature
		documentMousedown: function(ev) {
			// only hide the popover if the click happened outside the popover
			if (this.el && !$(ev.target).closest(this.el).length) {
				this.hide();
			}
		},


		// Hides and unregisters any handlers
		removeElement: function() {
			this.hide();

			if (this.el) {
				this.el.remove();
				this.el = null;
			}

			$(document).off('mousedown', this.documentMousedownProxy);
		},


		// Positions the popover optimally, using the top/left/right options
		position: function() {
			var options = this.options;
			var origin = this.el.offsetParent().offset();
			var width = this.el.outerWidth();
			var height = this.el.outerHeight();
			var windowEl = $(window);
			var viewportEl = getScrollParent(this.el);
			var viewportTop;
			var viewportLeft;
			var viewportOffset;
			var top; // the "position" (not "offset") values for the popover
			var left; //

			// compute top and left
			top = options.top || 0;
			if (options.left !== undefined) {
				left = options.left;
			}
			else if (options.right !== undefined) {
				left = options.right - width; // derive the left value from the right value
			}
			else {
				left = 0;
			}

			if (viewportEl.is(window) || viewportEl.is(document)) { // normalize getScrollParent's result
				viewportEl = windowEl;
				viewportTop = 0; // the window is always at the top left
				viewportLeft = 0; // (and .offset() won't work if called here)
			}
			else {
				viewportOffset = viewportEl.offset();
				viewportTop = viewportOffset.top;
				viewportLeft = viewportOffset.left;
			}

			// if the window is scrolled, it causes the visible area to be further down
			viewportTop += windowEl.scrollTop();
			viewportLeft += windowEl.scrollLeft();

			// constrain to the view port. if constrained by two edges, give precedence to top/left
			if (options.viewportConstrain !== false) {
				top = Math.min(top, viewportTop + viewportEl.outerHeight() - height - this.margin);
				top = Math.max(top, viewportTop + this.margin);
				left = Math.min(left, viewportLeft + viewportEl.outerWidth() - width - this.margin);
				left = Math.max(left, viewportLeft + this.margin);
			}

			this.el.css({
				top: top - origin.top,
				left: left - origin.left
			});
		},


		// Triggers a callback. Calls a function in the option hash of the same name.
		// Arguments beyond the first `name` are forwarded on.
		// TODO: better code reuse for this. Repeat code
		trigger: function(name) {
			if (this.options[name]) {
				this.options[name].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		}

	});

	;;

	/*
	A cache for the left/right/top/bottom/width/height values for one or more elements.
	Works with both offset (from topleft document) and position (from offsetParent).

	options:
	- els
	- isHorizontal
	- isVertical
	*/
	var CoordCache = FC.CoordCache = Class.extend({

		els: null, // jQuery set (assumed to be siblings)
		forcedOffsetParentEl: null, // options can override the natural offsetParent
		origin: null, // {left,top} position of offsetParent of els
		boundingRect: null, // constrain cordinates to this rectangle. {left,right,top,bottom} or null
		isHorizontal: false, // whether to query for left/right/width
		isVertical: false, // whether to query for top/bottom/height

		// arrays of coordinates (offsets from topleft of document)
		lefts: null,
		rights: null,
		tops: null,
		bottoms: null,


		constructor: function(options) {
			this.els = $(options.els);
			this.isHorizontal = options.isHorizontal;
			this.isVertical = options.isVertical;
			this.forcedOffsetParentEl = options.offsetParent ? $(options.offsetParent) : null;
		},


		// Queries the els for coordinates and stores them.
		// Call this method before using and of the get* methods below.
		build: function() {
			var offsetParentEl = this.forcedOffsetParentEl || this.els.eq(0).offsetParent();

			this.origin = offsetParentEl.offset();
			this.boundingRect = this.queryBoundingRect();

			if (this.isHorizontal) {
				this.buildElHorizontals();
			}
			if (this.isVertical) {
				this.buildElVerticals();
			}
		},


		// Destroys all internal data about coordinates, freeing memory
		clear: function() {
			this.origin = null;
			this.boundingRect = null;
			this.lefts = null;
			this.rights = null;
			this.tops = null;
			this.bottoms = null;
		},


		// Compute and return what the elements' bounding rectangle is, from the user's perspective.
		// Right now, only returns a rectangle if constrained by an overflow:scroll element.
		queryBoundingRect: function() {
			var scrollParentEl = getScrollParent(this.els.eq(0));

			if (!scrollParentEl.is(document)) {
				return getClientRect(scrollParentEl);
			}
		},


		// Populates the left/right internal coordinate arrays
		buildElHorizontals: function() {
			var lefts = [];
			var rights = [];

			this.els.each(function(i, node) {
				var el = $(node);
				var left = el.offset().left;
				var width = el.outerWidth();

				lefts.push(left);
				rights.push(left + width);
			});

			this.lefts = lefts;
			this.rights = rights;
		},


		// Populates the top/bottom internal coordinate arrays
		buildElVerticals: function() {
			var tops = [];
			var bottoms = [];

			this.els.each(function(i, node) {
				var el = $(node);
				var top = el.offset().top;
				var height = el.outerHeight();

				tops.push(top);
				bottoms.push(top + height);
			});

			this.tops = tops;
			this.bottoms = bottoms;
		},


		// Given a left offset (from document left), returns the index of the el that it horizontally intersects.
		// If no intersection is made, or outside of the boundingRect, returns undefined.
		getHorizontalIndex: function(leftOffset) {
			var boundingRect = this.boundingRect;
			var lefts = this.lefts;
			var rights = this.rights;
			var len = lefts.length;
			var i;

			if (!boundingRect || (leftOffset >= boundingRect.left && leftOffset < boundingRect.right)) {
				for (i = 0; i < len; i++) {
					if (leftOffset >= lefts[i] && leftOffset < rights[i]) {
						return i;
					}
				}
			}
		},


		// Given a top offset (from document top), returns the index of the el that it vertically intersects.
		// If no intersection is made, or outside of the boundingRect, returns undefined.
		getVerticalIndex: function(topOffset) {
			var boundingRect = this.boundingRect;
			var tops = this.tops;
			var bottoms = this.bottoms;
			var len = tops.length;
			var i;

			if (!boundingRect || (topOffset >= boundingRect.top && topOffset < boundingRect.bottom)) {
				for (i = 0; i < len; i++) {
					if (topOffset >= tops[i] && topOffset < bottoms[i]) {
						return i;
					}
				}
			}
		},


		// Gets the left offset (from document left) of the element at the given index
		getLeftOffset: function(leftIndex) {
			return this.lefts[leftIndex];
		},


		// Gets the left position (from offsetParent left) of the element at the given index
		getLeftPosition: function(leftIndex) {
			return this.lefts[leftIndex] - this.origin.left;
		},


		// Gets the right offset (from document left) of the element at the given index.
		// This value is NOT relative to the document's right edge, like the CSS concept of "right" would be.
		getRightOffset: function(leftIndex) {
			return this.rights[leftIndex];
		},


		// Gets the right position (from offsetParent left) of the element at the given index.
		// This value is NOT relative to the offsetParent's right edge, like the CSS concept of "right" would be.
		getRightPosition: function(leftIndex) {
			return this.rights[leftIndex] - this.origin.left;
		},


		// Gets the width of the element at the given index
		getWidth: function(leftIndex) {
			return this.rights[leftIndex] - this.lefts[leftIndex];
		},


		// Gets the top offset (from document top) of the element at the given index
		getTopOffset: function(topIndex) {
			return this.tops[topIndex];
		},


		// Gets the top position (from offsetParent top) of the element at the given position
		getTopPosition: function(topIndex) {
			return this.tops[topIndex] - this.origin.top;
		},

		// Gets the bottom offset (from the document top) of the element at the given index.
		// This value is NOT relative to the offsetParent's bottom edge, like the CSS concept of "bottom" would be.
		getBottomOffset: function(topIndex) {
			return this.bottoms[topIndex];
		},


		// Gets the bottom position (from the offsetParent top) of the element at the given index.
		// This value is NOT relative to the offsetParent's bottom edge, like the CSS concept of "bottom" would be.
		getBottomPosition: function(topIndex) {
			return this.bottoms[topIndex] - this.origin.top;
		},


		// Gets the height of the element at the given index
		getHeight: function(topIndex) {
			return this.bottoms[topIndex] - this.tops[topIndex];
		}

	});

	;;

	/* Tracks a drag's mouse movement, firing various handlers
	----------------------------------------------------------------------------------------------------------------------*/
	// TODO: use Emitter

	var DragListener = FC.DragListener = Class.extend({

		options: null,

		isListening: false,
		isDragging: false,

		// coordinates of the initial mousedown
		originX: null,
		originY: null,

		// handler attached to the document, bound to the DragListener's `this`
		mousemoveProxy: null,
		mouseupProxy: null,

		// for IE8 bug-fighting behavior, for now
		subjectEl: null, // the element being draged. optional
		subjectHref: null,

		scrollEl: null,
		scrollBounds: null, // { top, bottom, left, right }
		scrollTopVel: null, // pixels per second
		scrollLeftVel: null, // pixels per second
		scrollIntervalId: null, // ID of setTimeout for scrolling animation loop
		scrollHandlerProxy: null, // this-scoped function for handling when scrollEl is scrolled

		scrollSensitivity: 30, // pixels from edge for scrolling to start
		scrollSpeed: 200, // pixels per second, at maximum speed
		scrollIntervalMs: 50, // millisecond wait between scroll increment


		constructor: function(options) {
			options = options || {};
			this.options = options;
			this.subjectEl = options.subjectEl;
		},


		// Call this when the user does a mousedown. Will probably lead to startListening
		mousedown: function(ev) {
			if (isPrimaryMouseButton(ev)) {

				ev.preventDefault(); // prevents native selection in most browsers

				this.startListening(ev);

				// start the drag immediately if there is no minimum distance for a drag start
				if (!this.options.distance) {
					this.startDrag(ev);
				}
			}
		},


		// Call this to start tracking mouse movements
		startListening: function(ev) {
			var scrollParent;

			if (!this.isListening) {

				// grab scroll container and attach handler
				if (ev && this.options.scroll) {
					scrollParent = getScrollParent($(ev.target));
					if (!scrollParent.is(window) && !scrollParent.is(document)) {
						this.scrollEl = scrollParent;

						// scope to `this`, and use `debounce` to make sure rapid calls don't happen
						this.scrollHandlerProxy = debounce(proxy(this, 'scrollHandler'), 100);
						this.scrollEl.on('scroll', this.scrollHandlerProxy);
					}
				}

				$(document)
					.on('mousemove', this.mousemoveProxy = proxy(this, 'mousemove'))
					.on('mouseup', this.mouseupProxy = proxy(this, 'mouseup'))
					.on('selectstart', this.preventDefault); // prevents native selection in IE<=8

				if (ev) {
					this.originX = ev.pageX;
					this.originY = ev.pageY;
				}
				else {
					// if no starting information was given, origin will be the topleft corner of the screen.
					// if so, dx/dy in the future will be the absolute coordinates.
					this.originX = 0;
					this.originY = 0;
				}

				this.isListening = true;
				this.listenStart(ev);
			}
		},


		// Called when drag listening has started (but a real drag has not necessarily began)
		listenStart: function(ev) {
			this.trigger('listenStart', ev);
		},


		// Called when the user moves the mouse
		mousemove: function(ev) {
			var dx = ev.pageX - this.originX;
			var dy = ev.pageY - this.originY;
			var minDistance;
			var distanceSq; // current distance from the origin, squared

			if (!this.isDragging) { // if not already dragging...
				// then start the drag if the minimum distance criteria is met
				minDistance = this.options.distance || 1;
				distanceSq = dx * dx + dy * dy;
				if (distanceSq >= minDistance * minDistance) { // use pythagorean theorem
					this.startDrag(ev);
				}
			}

			if (this.isDragging) {
				this.drag(dx, dy, ev); // report a drag, even if this mousemove initiated the drag
			}
		},


		// Call this to initiate a legitimate drag.
		// This function is called internally from this class, but can also be called explicitly from outside
		startDrag: function(ev) {

			if (!this.isListening) { // startDrag must have manually initiated
				this.startListening();
			}

			if (!this.isDragging) {
				this.isDragging = true;
				this.dragStart(ev);
			}
		},


		// Called when the actual drag has started (went beyond minDistance)
		dragStart: function(ev) {
			var subjectEl = this.subjectEl;

			this.trigger('dragStart', ev);

			// remove a mousedown'd <a>'s href so it is not visited (IE8 bug)
			if ((this.subjectHref = subjectEl ? subjectEl.attr('href') : null)) {
				subjectEl.removeAttr('href');
			}
		},


		// Called while the mouse is being moved and when we know a legitimate drag is taking place
		drag: function(dx, dy, ev) {
			this.trigger('drag', dx, dy, ev);
			this.updateScroll(ev); // will possibly cause scrolling
		},


		// Called when the user does a mouseup
		mouseup: function(ev) {
			this.stopListening(ev);
		},


		// Called when the drag is over. Will not cause listening to stop however.
		// A concluding 'cellOut' event will NOT be triggered.
		stopDrag: function(ev) {
			if (this.isDragging) {
				this.stopScrolling();
				this.dragStop(ev);
				this.isDragging = false;
			}
		},


		// Called when dragging has been stopped
		dragStop: function(ev) {
			var _this = this;

			this.trigger('dragStop', ev);

			// restore a mousedown'd <a>'s href (for IE8 bug)
			setTimeout(function() { // must be outside of the click's execution
				if (_this.subjectHref) {
					_this.subjectEl.attr('href', _this.subjectHref);
				}
			}, 0);
		},


		// Call this to stop listening to the user's mouse events
		stopListening: function(ev) {
			this.stopDrag(ev); // if there's a current drag, kill it

			if (this.isListening) {

				// remove the scroll handler if there is a scrollEl
				if (this.scrollEl) {
					this.scrollEl.off('scroll', this.scrollHandlerProxy);
					this.scrollHandlerProxy = null;
				}

				$(document)
					.off('mousemove', this.mousemoveProxy)
					.off('mouseup', this.mouseupProxy)
					.off('selectstart', this.preventDefault);

				this.mousemoveProxy = null;
				this.mouseupProxy = null;

				this.isListening = false;
				this.listenStop(ev);
			}
		},


		// Called when drag listening has stopped
		listenStop: function(ev) {
			this.trigger('listenStop', ev);
		},


		// Triggers a callback. Calls a function in the option hash of the same name.
		// Arguments beyond the first `name` are forwarded on.
		trigger: function(name) {
			if (this.options[name]) {
				this.options[name].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},


		// Stops a given mouse event from doing it's native browser action. In our case, text selection.
		preventDefault: function(ev) {
			ev.preventDefault();
		},


		/* Scrolling
		------------------------------------------------------------------------------------------------------------------*/


		// Computes and stores the bounding rectangle of scrollEl
		computeScrollBounds: function() {
			var el = this.scrollEl;

			this.scrollBounds = el ? getOuterRect(el) : null;
				// TODO: use getClientRect in future. but prevents auto scrolling when on top of scrollbars
		},


		// Called when the dragging is in progress and scrolling should be updated
		updateScroll: function(ev) {
			var sensitivity = this.scrollSensitivity;
			var bounds = this.scrollBounds;
			var topCloseness, bottomCloseness;
			var leftCloseness, rightCloseness;
			var topVel = 0;
			var leftVel = 0;

			if (bounds) { // only scroll if scrollEl exists

				// compute closeness to edges. valid range is from 0.0 - 1.0
				topCloseness = (sensitivity - (ev.pageY - bounds.top)) / sensitivity;
				bottomCloseness = (sensitivity - (bounds.bottom - ev.pageY)) / sensitivity;
				leftCloseness = (sensitivity - (ev.pageX - bounds.left)) / sensitivity;
				rightCloseness = (sensitivity - (bounds.right - ev.pageX)) / sensitivity;

				// translate vertical closeness into velocity.
				// mouse must be completely in bounds for velocity to happen.
				if (topCloseness >= 0 && topCloseness <= 1) {
					topVel = topCloseness * this.scrollSpeed * -1; // negative. for scrolling up
				}
				else if (bottomCloseness >= 0 && bottomCloseness <= 1) {
					topVel = bottomCloseness * this.scrollSpeed;
				}

				// translate horizontal closeness into velocity
				if (leftCloseness >= 0 && leftCloseness <= 1) {
					leftVel = leftCloseness * this.scrollSpeed * -1; // negative. for scrolling left
				}
				else if (rightCloseness >= 0 && rightCloseness <= 1) {
					leftVel = rightCloseness * this.scrollSpeed;
				}
			}

			this.setScrollVel(topVel, leftVel);
		},


		// Sets the speed-of-scrolling for the scrollEl
		setScrollVel: function(topVel, leftVel) {

			this.scrollTopVel = topVel;
			this.scrollLeftVel = leftVel;

			this.constrainScrollVel(); // massages into realistic values

			// if there is non-zero velocity, and an animation loop hasn't already started, then START
			if ((this.scrollTopVel || this.scrollLeftVel) && !this.scrollIntervalId) {
				this.scrollIntervalId = setInterval(
					proxy(this, 'scrollIntervalFunc'), // scope to `this`
					this.scrollIntervalMs
				);
			}
		},


		// Forces scrollTopVel and scrollLeftVel to be zero if scrolling has already gone all the way
		constrainScrollVel: function() {
			var el = this.scrollEl;

			if (this.scrollTopVel < 0) { // scrolling up?
				if (el.scrollTop() <= 0) { // already scrolled all the way up?
					this.scrollTopVel = 0;
				}
			}
			else if (this.scrollTopVel > 0) { // scrolling down?
				if (el.scrollTop() + el[0].clientHeight >= el[0].scrollHeight) { // already scrolled all the way down?
					this.scrollTopVel = 0;
				}
			}

			if (this.scrollLeftVel < 0) { // scrolling left?
				if (el.scrollLeft() <= 0) { // already scrolled all the left?
					this.scrollLeftVel = 0;
				}
			}
			else if (this.scrollLeftVel > 0) { // scrolling right?
				if (el.scrollLeft() + el[0].clientWidth >= el[0].scrollWidth) { // already scrolled all the way right?
					this.scrollLeftVel = 0;
				}
			}
		},


		// This function gets called during every iteration of the scrolling animation loop
		scrollIntervalFunc: function() {
			var el = this.scrollEl;
			var frac = this.scrollIntervalMs / 1000; // considering animation frequency, what the vel should be mult'd by

			// change the value of scrollEl's scroll
			if (this.scrollTopVel) {
				el.scrollTop(el.scrollTop() + this.scrollTopVel * frac);
			}
			if (this.scrollLeftVel) {
				el.scrollLeft(el.scrollLeft() + this.scrollLeftVel * frac);
			}

			this.constrainScrollVel(); // since the scroll values changed, recompute the velocities

			// if scrolled all the way, which causes the vels to be zero, stop the animation loop
			if (!this.scrollTopVel && !this.scrollLeftVel) {
				this.stopScrolling();
			}
		},


		// Kills any existing scrolling animation loop
		stopScrolling: function() {
			if (this.scrollIntervalId) {
				clearInterval(this.scrollIntervalId);
				this.scrollIntervalId = null;

				// when all done with scrolling, recompute positions since they probably changed
				this.scrollStop();
			}
		},


		// Get called when the scrollEl is scrolled (NOTE: this is delayed via debounce)
		scrollHandler: function() {
			// recompute all coordinates, but *only* if this is *not* part of our scrolling animation
			if (!this.scrollIntervalId) {
				this.scrollStop();
			}
		},


		// Called when scrolling has stopped, whether through auto scroll, or the user scrolling
		scrollStop: function() {
		}

	});

	;;

	/* Tracks mouse movements over a component and raises events about which hit the mouse is over.
	------------------------------------------------------------------------------------------------------------------------
	options:
	- subjectEl
	- subjectCenter
	*/

	var HitDragListener = DragListener.extend({

		component: null, // converts coordinates to hits
			// methods: prepareHits, releaseHits, queryHit

		origHit: null, // the hit the mouse was over when listening started
		hit: null, // the hit the mouse is over
		coordAdjust: null, // delta that will be added to the mouse coordinates when computing collisions


		constructor: function(component, options) {
			DragListener.call(this, options); // call the super-constructor

			this.component = component;
		},


		// Called when drag listening starts (but a real drag has not necessarily began).
		// ev might be undefined if dragging was started manually.
		listenStart: function(ev) {
			var subjectEl = this.subjectEl;
			var subjectRect;
			var origPoint;
			var point;

			DragListener.prototype.listenStart.apply(this, arguments); // call the super-method

			this.computeCoords();

			if (ev) {
				origPoint = { left: ev.pageX, top: ev.pageY };
				point = origPoint;

				// constrain the point to bounds of the element being dragged
				if (subjectEl) {
					subjectRect = getOuterRect(subjectEl); // used for centering as well
					point = constrainPoint(point, subjectRect);
				}

				this.origHit = this.queryHit(point.left, point.top);

				// treat the center of the subject as the collision point?
				if (subjectEl && this.options.subjectCenter) {

					// only consider the area the subject overlaps the hit. best for large subjects.
					// TODO: skip this if hit didn't supply left/right/top/bottom
					if (this.origHit) {
						subjectRect = intersectRects(this.origHit, subjectRect) ||
							subjectRect; // in case there is no intersection
					}

					point = getRectCenter(subjectRect);
				}

				this.coordAdjust = diffPoints(point, origPoint); // point - origPoint
			}
			else {
				this.origHit = null;
				this.coordAdjust = null;
			}
		},


		// Recomputes the drag-critical positions of elements
		computeCoords: function() {
			this.component.prepareHits();
			this.computeScrollBounds(); // why is this here???
		},


		// Called when the actual drag has started
		dragStart: function(ev) {
			var hit;

			DragListener.prototype.dragStart.apply(this, arguments); // call the super-method

			// might be different from this.origHit if the min-distance is large
			hit = this.queryHit(ev.pageX, ev.pageY);

			// report the initial hit the mouse is over
			// especially important if no min-distance and drag starts immediately
			if (hit) {
				this.hitOver(hit);
			}
		},


		// Called when the drag moves
		drag: function(dx, dy, ev) {
			var hit;

			DragListener.prototype.drag.apply(this, arguments); // call the super-method

			hit = this.queryHit(ev.pageX, ev.pageY);

			if (!isHitsEqual(hit, this.hit)) { // a different hit than before?
				if (this.hit) {
					this.hitOut();
				}
				if (hit) {
					this.hitOver(hit);
				}
			}
		},


		// Called when dragging has been stopped
		dragStop: function() {
			this.hitDone();
			DragListener.prototype.dragStop.apply(this, arguments); // call the super-method
		},


		// Called when a the mouse has just moved over a new hit
		hitOver: function(hit) {
			var isOrig = isHitsEqual(hit, this.origHit);

			this.hit = hit;

			this.trigger('hitOver', this.hit, isOrig, this.origHit);
		},


		// Called when the mouse has just moved out of a hit
		hitOut: function() {
			if (this.hit) {
				this.trigger('hitOut', this.hit);
				this.hitDone();
				this.hit = null;
			}
		},


		// Called after a hitOut. Also called before a dragStop
		hitDone: function() {
			if (this.hit) {
				this.trigger('hitDone', this.hit);
			}
		},


		// Called when drag listening has stopped
		listenStop: function() {
			DragListener.prototype.listenStop.apply(this, arguments); // call the super-method

			this.origHit = null;
			this.hit = null;

			this.component.releaseHits();
		},


		// Called when scrolling has stopped, whether through auto scroll, or the user scrolling
		scrollStop: function() {
			DragListener.prototype.scrollStop.apply(this, arguments); // call the super-method

			this.computeCoords(); // hits' absolute positions will be in new places. recompute
		},


		// Gets the hit underneath the coordinates for the given mouse event
		queryHit: function(left, top) {

			if (this.coordAdjust) {
				left += this.coordAdjust.left;
				top += this.coordAdjust.top;
			}

			return this.component.queryHit(left, top);
		}

	});


	// Returns `true` if the hits are identically equal. `false` otherwise. Must be from the same component.
	// Two null values will be considered equal, as two "out of the component" states are the same.
	function isHitsEqual(hit0, hit1) {

		if (!hit0 && !hit1) {
			return true;
		}

		if (hit0 && hit1) {
			return hit0.component === hit1.component &&
				isHitPropsWithin(hit0, hit1) &&
				isHitPropsWithin(hit1, hit0); // ensures all props are identical
		}

		return false;
	}


	// Returns true if all of subHit's non-standard properties are within superHit
	function isHitPropsWithin(subHit, superHit) {
		for (var propName in subHit) {
			if (!/^(component|left|right|top|bottom)$/.test(propName)) {
				if (subHit[propName] !== superHit[propName]) {
					return false;
				}
			}
		}
		return true;
	}

	;;

	/* Creates a clone of an element and lets it track the mouse as it moves
	----------------------------------------------------------------------------------------------------------------------*/

	var MouseFollower = Class.extend({

		options: null,

		sourceEl: null, // the element that will be cloned and made to look like it is dragging
		el: null, // the clone of `sourceEl` that will track the mouse
		parentEl: null, // the element that `el` (the clone) will be attached to

		// the initial position of el, relative to the offset parent. made to match the initial offset of sourceEl
		top0: null,
		left0: null,

		// the initial position of the mouse
		mouseY0: null,
		mouseX0: null,

		// the number of pixels the mouse has moved from its initial position
		topDelta: null,
		leftDelta: null,

		mousemoveProxy: null, // document mousemove handler, bound to the MouseFollower's `this`

		isFollowing: false,
		isHidden: false,
		isAnimating: false, // doing the revert animation?

		constructor: function(sourceEl, options) {
			this.options = options = options || {};
			this.sourceEl = sourceEl;
			this.parentEl = options.parentEl ? $(options.parentEl) : sourceEl.parent(); // default to sourceEl's parent
		},


		// Causes the element to start following the mouse
		start: function(ev) {
			if (!this.isFollowing) {
				this.isFollowing = true;

				this.mouseY0 = ev.pageY;
				this.mouseX0 = ev.pageX;
				this.topDelta = 0;
				this.leftDelta = 0;

				if (!this.isHidden) {
					this.updatePosition();
				}

				$(document).on('mousemove', this.mousemoveProxy = proxy(this, 'mousemove'));
			}
		},


		// Causes the element to stop following the mouse. If shouldRevert is true, will animate back to original position.
		// `callback` gets invoked when the animation is complete. If no animation, it is invoked immediately.
		stop: function(shouldRevert, callback) {
			var _this = this;
			var revertDuration = this.options.revertDuration;

			function complete() {
				this.isAnimating = false;
				_this.removeElement();

				this.top0 = this.left0 = null; // reset state for future updatePosition calls

				if (callback) {
					callback();
				}
			}

			if (this.isFollowing && !this.isAnimating) { // disallow more than one stop animation at a time
				this.isFollowing = false;

				$(document).off('mousemove', this.mousemoveProxy);

				if (shouldRevert && revertDuration && !this.isHidden) { // do a revert animation?
					this.isAnimating = true;
					this.el.animate({
						top: this.top0,
						left: this.left0
					}, {
						duration: revertDuration,
						complete: complete
					});
				}
				else {
					complete();
				}
			}
		},


		// Gets the tracking element. Create it if necessary
		getEl: function() {
			var el = this.el;

			if (!el) {
				this.sourceEl.width(); // hack to force IE8 to compute correct bounding box
				el = this.el = this.sourceEl.clone()
					.css({
						position: 'absolute',
						visibility: '', // in case original element was hidden (commonly through hideEvents())
						display: this.isHidden ? 'none' : '', // for when initially hidden
						margin: 0,
						right: 'auto', // erase and set width instead
						bottom: 'auto', // erase and set height instead
						width: this.sourceEl.width(), // explicit height in case there was a 'right' value
						height: this.sourceEl.height(), // explicit width in case there was a 'bottom' value
						opacity: this.options.opacity || '',
						zIndex: this.options.zIndex
					})
					.appendTo(this.parentEl);
			}

			return el;
		},


		// Removes the tracking element if it has already been created
		removeElement: function() {
			if (this.el) {
				this.el.remove();
				this.el = null;
			}
		},


		// Update the CSS position of the tracking element
		updatePosition: function() {
			var sourceOffset;
			var origin;

			this.getEl(); // ensure this.el

			// make sure origin info was computed
			if (this.top0 === null) {
				this.sourceEl.width(); // hack to force IE8 to compute correct bounding box
				sourceOffset = this.sourceEl.offset();
				origin = this.el.offsetParent().offset();
				this.top0 = sourceOffset.top - origin.top;
				this.left0 = sourceOffset.left - origin.left;
			}

			this.el.css({
				top: this.top0 + this.topDelta,
				left: this.left0 + this.leftDelta
			});
		},


		// Gets called when the user moves the mouse
		mousemove: function(ev) {
			this.topDelta = ev.pageY - this.mouseY0;
			this.leftDelta = ev.pageX - this.mouseX0;

			if (!this.isHidden) {
				this.updatePosition();
			}
		},


		// Temporarily makes the tracking element invisible. Can be called before following starts
		hide: function() {
			if (!this.isHidden) {
				this.isHidden = true;
				if (this.el) {
					this.el.hide();
				}
			}
		},


		// Show the tracking element after it has been temporarily hidden
		show: function() {
			if (this.isHidden) {
				this.isHidden = false;
				this.updatePosition();
				this.getEl().show();
			}
		}

	});

	;;

	/* An abstract class comprised of a "grid" of areas that each represent a specific datetime
	----------------------------------------------------------------------------------------------------------------------*/

	var Grid = FC.Grid = Class.extend({

		view: null, // a View object
		isRTL: null, // shortcut to the view's isRTL option

		start: null,
		end: null,

		el: null, // the containing element
		elsByFill: null, // a hash of jQuery element sets used for rendering each fill. Keyed by fill name.

		externalDragStartProxy: null, // binds the Grid's scope to externalDragStart (in DayGrid.events)

		// derived from options
		eventTimeFormat: null,
		displayEventTime: null,
		displayEventEnd: null,

		minResizeDuration: null, // TODO: hack. set by subclasses. minumum event resize duration

		// if defined, holds the unit identified (ex: "year" or "month") that determines the level of granularity
		// of the date areas. if not defined, assumes to be day and time granularity.
		// TODO: port isTimeScale into same system?
		largeUnit: null,


		constructor: function(view) {
			this.view = view;
			this.isRTL = view.opt('isRTL');

			this.elsByFill = {};
			this.externalDragStartProxy = proxy(this, 'externalDragStart');
		},


		/* Options
		------------------------------------------------------------------------------------------------------------------*/


		// Generates the format string used for event time text, if not explicitly defined by 'timeFormat'
		computeEventTimeFormat: function() {
			return this.view.opt('smallTimeFormat');
		},


		// Determines whether events should have their end times displayed, if not explicitly defined by 'displayEventTime'.
		// Only applies to non-all-day events.
		computeDisplayEventTime: function() {
			return true;
		},


		// Determines whether events should have their end times displayed, if not explicitly defined by 'displayEventEnd'
		computeDisplayEventEnd: function() {
			return true;
		},


		/* Dates
		------------------------------------------------------------------------------------------------------------------*/


		// Tells the grid about what period of time to display.
		// Any date-related internal data should be generated.
		setRange: function(range) {
			this.start = range.start.clone();
			this.end = range.end.clone();

			this.rangeUpdated();
			this.processRangeOptions();
		},


		// Called when internal variables that rely on the range should be updated
		rangeUpdated: function() {
		},


		// Updates values that rely on options and also relate to range
		processRangeOptions: function() {
			var view = this.view;
			var displayEventTime;
			var displayEventEnd;

			this.eventTimeFormat =
				view.opt('eventTimeFormat') ||
				view.opt('timeFormat') || // deprecated
				this.computeEventTimeFormat();

			displayEventTime = view.opt('displayEventTime');
			if (displayEventTime == null) {
				displayEventTime = this.computeDisplayEventTime(); // might be based off of range
			}

			displayEventEnd = view.opt('displayEventEnd');
			if (displayEventEnd == null) {
				displayEventEnd = this.computeDisplayEventEnd(); // might be based off of range
			}

			this.displayEventTime = displayEventTime;
			this.displayEventEnd = displayEventEnd;
		},


		// Converts a span (has unzoned start/end and any other grid-specific location information)
		// into an array of segments (pieces of events whose format is decided by the grid).
		spanToSegs: function(span) {
			// subclasses must implement
		},


		// Diffs the two dates, returning a duration, based on granularity of the grid
		// TODO: port isTimeScale into this system?
		diffDates: function(a, b) {
			if (this.largeUnit) {
				return diffByUnit(a, b, this.largeUnit);
			}
			else {
				return diffDayTime(a, b);
			}
		},


		/* Hit Area
		------------------------------------------------------------------------------------------------------------------*/


		// Called before one or more queryHit calls might happen. Should prepare any cached coordinates for queryHit
		prepareHits: function() {
		},


		// Called when queryHit calls have subsided. Good place to clear any coordinate caches.
		releaseHits: function() {
		},


		// Given coordinates from the topleft of the document, return data about the date-related area underneath.
		// Can return an object with arbitrary properties (although top/right/left/bottom are encouraged).
		// Must have a `grid` property, a reference to this current grid. TODO: avoid this
		// The returned object will be processed by getHitSpan and getHitEl.
		queryHit: function(leftOffset, topOffset) {
		},


		// Given position-level information about a date-related area within the grid,
		// should return an object with at least a start/end date. Can provide other information as well.
		getHitSpan: function(hit) {
		},


		// Given position-level information about a date-related area within the grid,
		// should return a jQuery element that best represents it. passed to dayClick callback.
		getHitEl: function(hit) {
		},


		/* Rendering
		------------------------------------------------------------------------------------------------------------------*/


		// Sets the container element that the grid should render inside of.
		// Does other DOM-related initializations.
		setElement: function(el) {
			var _this = this;

			this.el = el;

			// attach a handler to the grid's root element.
			// jQuery will take care of unregistering them when removeElement gets called.
			el.on('mousedown', function(ev) {
				if (
					!$(ev.target).is('.fc-event-container *, .fc-more') && // not an an event element, or "more.." link
					!$(ev.target).closest('.fc-popover').length // not on a popover (like the "more.." events one)
				) {
					_this.dayMousedown(ev);
				}
			});

			// attach event-element-related handlers. in Grid.events
			// same garbage collection note as above.
			this.bindSegHandlers();

			this.bindGlobalHandlers();
		},


		// Removes the grid's container element from the DOM. Undoes any other DOM-related attachments.
		// DOES NOT remove any content beforehand (doesn't clear events or call unrenderDates), unlike View
		removeElement: function() {
			this.unbindGlobalHandlers();

			this.el.remove();

			// NOTE: we don't null-out this.el for the same reasons we don't do it within View::removeElement
		},


		// Renders the basic structure of grid view before any content is rendered
		renderSkeleton: function() {
			// subclasses should implement
		},


		// Renders the grid's date-related content (like areas that represent days/times).
		// Assumes setRange has already been called and the skeleton has already been rendered.
		renderDates: function() {
			// subclasses should implement
		},


		// Unrenders the grid's date-related content
		unrenderDates: function() {
			// subclasses should implement
		},


		/* Handlers
		------------------------------------------------------------------------------------------------------------------*/


		// Binds DOM handlers to elements that reside outside the grid, such as the document
		bindGlobalHandlers: function() {
			$(document).on('dragstart sortstart', this.externalDragStartProxy); // jqui
		},


		// Unbinds DOM handlers from elements that reside outside the grid
		unbindGlobalHandlers: function() {
			$(document).off('dragstart sortstart', this.externalDragStartProxy); // jqui
		},


		// Process a mousedown on an element that represents a day. For day clicking and selecting.
		dayMousedown: function(ev) {
			var _this = this;
			var view = this.view;
			var isSelectable = view.opt('selectable');
			var dayClickHit; // null if invalid dayClick
			var selectionSpan; // null if invalid selection

			// this listener tracks a mousedown on a day element, and a subsequent drag.
			// if the drag ends on the same day, it is a 'dayClick'.
			// if 'selectable' is enabled, this listener also detects selections.
			var dragListener = new HitDragListener(this, {
				//distance: 5, // needs more work if we want dayClick to fire correctly
				scroll: view.opt('dragScroll'),
				dragStart: function() {
					view.unselect(); // since we could be rendering a new selection, we want to clear any old one
				},
				hitOver: function(hit, isOrig, origHit) {
					if (origHit) { // click needs to have started on a hit
						dayClickHit = isOrig ? hit : null; // single-hit selection is a day click
						if (isSelectable) {
							selectionSpan = _this.computeSelection(
								_this.getHitSpan(origHit),
								_this.getHitSpan(hit)
							);
							if (selectionSpan) {
								_this.renderSelection(selectionSpan);
							}
							else if (selectionSpan === false) {
								disableCursor();
							}
						}
					}
				},
				hitOut: function() {
					dayClickHit = null;
					selectionSpan = null;
					_this.unrenderSelection();
					enableCursor();
				},
				listenStop: function(ev) {
					if (dayClickHit) {
						view.triggerDayClick(
							_this.getHitSpan(dayClickHit),
							_this.getHitEl(dayClickHit),
							ev
						);
					}
					if (selectionSpan) {
						// the selection will already have been rendered. just report it
						view.reportSelection(selectionSpan, ev);
					}
					enableCursor();
				}
			});

			dragListener.mousedown(ev); // start listening, which will eventually initiate a dragStart
		},


		/* Event Helper
		------------------------------------------------------------------------------------------------------------------*/
		// TODO: should probably move this to Grid.events, like we did event dragging / resizing


		// Renders a mock event at the given event location, which contains zoned start/end properties.
		renderEventLocationHelper: function(eventLocation, sourceSeg) {
			var fakeEvent = this.fabricateHelperEvent(eventLocation, sourceSeg);

			this.renderHelper(fakeEvent, sourceSeg); // do the actual rendering
		},


		// Builds a fake event given zoned event date properties and a segment is should be inspired from.
		// The range's end can be null, in which case the mock event that is rendered will have a null end time.
		// `sourceSeg` is the internal segment object involved in the drag. If null, something external is dragging.
		fabricateHelperEvent: function(eventLocation, sourceSeg) {
			var fakeEvent = sourceSeg ? createObject(sourceSeg.event) : {}; // mask the original event object if possible

			fakeEvent.start = eventLocation.start.clone();
			fakeEvent.end = eventLocation.end ? eventLocation.end.clone() : null;
			fakeEvent.allDay = null; // force it to be freshly computed by normalizeEventDates
			this.view.calendar.normalizeEventDates(fakeEvent);

			// this extra className will be useful for differentiating real events from mock events in CSS
			fakeEvent.className = (fakeEvent.className || []).concat('fc-helper');

			// if something external is being dragged in, don't render a resizer
			if (!sourceSeg) {
				fakeEvent.editable = false;
			}

			return fakeEvent;
		},


		// Renders a mock event. Given zoned event date properties.
		renderHelper: function(eventLocation, sourceSeg) {
			// subclasses must implement
		},


		// Unrenders a mock event
		unrenderHelper: function() {
			// subclasses must implement
		},


		/* Selection
		------------------------------------------------------------------------------------------------------------------*/


		// Renders a visual indication of a selection. Will highlight by default but can be overridden by subclasses.
		// Given a span (unzoned start/end and other misc data)
		renderSelection: function(span) {
			this.renderHighlight(span);
		},


		// Unrenders any visual indications of a selection. Will unrender a highlight by default.
		unrenderSelection: function() {
			this.unrenderHighlight();
		},


		// Given the first and last date-spans of a selection, returns another date-span object.
		// Subclasses can override and provide additional data in the span object. Will be passed to renderSelection().
		// Will return false if the selection is invalid and this should be indicated to the user.
		// Will return null/undefined if a selection invalid but no error should be reported.
		computeSelection: function(span0, span1) {
			var span = this.computeSelectionSpan(span0, span1);

			if (span && !this.view.calendar.isSelectionSpanAllowed(span)) {
				return false;
			}

			return span;
		},


		// Given two spans, must return the combination of the two.
		// TODO: do this separation of concerns (combining VS validation) for event dnd/resize too.
		computeSelectionSpan: function(span0, span1) {
			var dates = [ span0.start, span0.end, span1.start, span1.end ];

			dates.sort(compareNumbers); // sorts chronologically. works with Moments

			return { start: dates[0].clone(), end: dates[3].clone() };
		},


		/* Highlight
		------------------------------------------------------------------------------------------------------------------*/


		// Renders an emphasis on the given date range. Given a span (unzoned start/end and other misc data)
		renderHighlight: function(span) {
			this.renderFill('highlight', this.spanToSegs(span));
		},


		// Unrenders the emphasis on a date range
		unrenderHighlight: function() {
			this.unrenderFill('highlight');
		},


		// Generates an array of classNames for rendering the highlight. Used by the fill system.
		highlightSegClasses: function() {
			return [ 'fc-highlight' ];
		},


		/* Fill System (highlight, background events, business hours)
		------------------------------------------------------------------------------------------------------------------*/


		// Renders a set of rectangles over the given segments of time.
		// MUST RETURN a subset of segs, the segs that were actually rendered.
		// Responsible for populating this.elsByFill. TODO: better API for expressing this requirement
		renderFill: function(type, segs) {
			// subclasses must implement
		},


		// Unrenders a specific type of fill that is currently rendered on the grid
		unrenderFill: function(type) {
			var el = this.elsByFill[type];

			if (el) {
				el.remove();
				delete this.elsByFill[type];
			}
		},


		// Renders and assigns an `el` property for each fill segment. Generic enough to work with different types.
		// Only returns segments that successfully rendered.
		// To be harnessed by renderFill (implemented by subclasses).
		// Analagous to renderFgSegEls.
		renderFillSegEls: function(type, segs) {
			var _this = this;
			var segElMethod = this[type + 'SegEl'];
			var html = '';
			var renderedSegs = [];
			var i;

			if (segs.length) {

				// build a large concatenation of segment HTML
				for (i = 0; i < segs.length; i++) {
					html += this.fillSegHtml(type, segs[i]);
				}

				// Grab individual elements from the combined HTML string. Use each as the default rendering.
				// Then, compute the 'el' for each segment.
				$(html).each(function(i, node) {
					var seg = segs[i];
					var el = $(node);

					// allow custom filter methods per-type
					if (segElMethod) {
						el = segElMethod.call(_this, seg, el);
					}

					if (el) { // custom filters did not cancel the render
						el = $(el); // allow custom filter to return raw DOM node

						// correct element type? (would be bad if a non-TD were inserted into a table for example)
						if (el.is(_this.fillSegTag)) {
							seg.el = el;
							renderedSegs.push(seg);
						}
					}
				});
			}

			return renderedSegs;
		},


		fillSegTag: 'div', // subclasses can override


		// Builds the HTML needed for one fill segment. Generic enought o work with different types.
		fillSegHtml: function(type, seg) {

			// custom hooks per-type
			var classesMethod = this[type + 'SegClasses'];
			var cssMethod = this[type + 'SegCss'];

			var classes = classesMethod ? classesMethod.call(this, seg) : [];
			var css = cssToStr(cssMethod ? cssMethod.call(this, seg) : {});

			return '<' + this.fillSegTag +
				(classes.length ? ' class="' + classes.join(' ') + '"' : '') +
				(css ? ' style="' + css + '"' : '') +
				' />';
		},



		/* Generic rendering utilities for subclasses
		------------------------------------------------------------------------------------------------------------------*/


		// Computes HTML classNames for a single-day element
		getDayClasses: function(date) {
			var view = this.view;
			var today = view.calendar.getNow().stripTime();
			var classes = [ 'fc-' + dayIDs[date.day()] ];

			if (
				view.intervalDuration.as('months') == 1 &&
				date.month() != view.intervalStart.month()
			) {
				classes.push('fc-other-month');
			}

			if (date.isSame(today, 'day')) {
				classes.push(
					'fc-today',
					view.highlightStateClass
				);
			}
			else if (date < today) {
				classes.push('fc-past');
			}
			else {
				classes.push('fc-future');
			}

			return classes;
		}

	});

	;;

	/* Event-rendering and event-interaction methods for the abstract Grid class
	----------------------------------------------------------------------------------------------------------------------*/

	Grid.mixin({

		mousedOverSeg: null, // the segment object the user's mouse is over. null if over nothing
		isDraggingSeg: false, // is a segment being dragged? boolean
		isResizingSeg: false, // is a segment being resized? boolean
		isDraggingExternal: false, // jqui-dragging an external element? boolean
		segs: null, // the event segments currently rendered in the grid


		// Renders the given events onto the grid
		renderEvents: function(events) {
			var bgEvents = [];
			var fgEvents = [];
			var i;

			for (i = 0; i < events.length; i++) {
				(isBgEvent(events[i]) ? bgEvents : fgEvents).push(events[i]);
			}

			this.segs = [].concat( // record all segs
				this.renderBgEvents(bgEvents),
				this.renderFgEvents(fgEvents)
			);
		},


		renderBgEvents: function(events) {
			var segs = this.eventsToSegs(events);

			// renderBgSegs might return a subset of segs, segs that were actually rendered
			return this.renderBgSegs(segs) || segs;
		},


		renderFgEvents: function(events) {
			var segs = this.eventsToSegs(events);

			// renderFgSegs might return a subset of segs, segs that were actually rendered
			return this.renderFgSegs(segs) || segs;
		},


		// Unrenders all events currently rendered on the grid
		unrenderEvents: function() {
			this.triggerSegMouseout(); // trigger an eventMouseout if user's mouse is over an event

			this.unrenderFgSegs();
			this.unrenderBgSegs();

			this.segs = null;
		},


		// Retrieves all rendered segment objects currently rendered on the grid
		getEventSegs: function() {
			return this.segs || [];
		},


		/* Foreground Segment Rendering
		------------------------------------------------------------------------------------------------------------------*/


		// Renders foreground event segments onto the grid. May return a subset of segs that were rendered.
		renderFgSegs: function(segs) {
			// subclasses must implement
		},


		// Unrenders all currently rendered foreground segments
		unrenderFgSegs: function() {
			// subclasses must implement
		},


		// Renders and assigns an `el` property for each foreground event segment.
		// Only returns segments that successfully rendered.
		// A utility that subclasses may use.
		renderFgSegEls: function(segs, disableResizing) {
			var view = this.view;
			var html = '';
			var renderedSegs = [];
			var i;

			if (segs.length) { // don't build an empty html string

				// build a large concatenation of event segment HTML
				for (i = 0; i < segs.length; i++) {
					html += this.fgSegHtml(segs[i], disableResizing);
				}

				// Grab individual elements from the combined HTML string. Use each as the default rendering.
				// Then, compute the 'el' for each segment. An el might be null if the eventRender callback returned false.
				$(html).each(function(i, node) {
					var seg = segs[i];
					var el = view.resolveEventEl(seg.event, $(node));

					if (el) {
						el.data('fc-seg', seg); // used by handlers
						seg.el = el;
						renderedSegs.push(seg);
					}
				});
			}

			return renderedSegs;
		},


		// Generates the HTML for the default rendering of a foreground event segment. Used by renderFgSegEls()
		fgSegHtml: function(seg, disableResizing) {
			// subclasses should implement
		},


		/* Background Segment Rendering
		------------------------------------------------------------------------------------------------------------------*/


		// Renders the given background event segments onto the grid.
		// Returns a subset of the segs that were actually rendered.
		renderBgSegs: function(segs) {
			return this.renderFill('bgEvent', segs);
		},


		// Unrenders all the currently rendered background event segments
		unrenderBgSegs: function() {
			this.unrenderFill('bgEvent');
		},


		// Renders a background event element, given the default rendering. Called by the fill system.
		bgEventSegEl: function(seg, el) {
			return this.view.resolveEventEl(seg.event, el); // will filter through eventRender
		},


		// Generates an array of classNames to be used for the default rendering of a background event.
		// Called by the fill system.
		bgEventSegClasses: function(seg) {
			var event = seg.event;
			var source = event.source || {};

			return [ 'fc-bgevent' ].concat(
				event.className,
				source.className || []
			);
		},


		// Generates a semicolon-separated CSS string to be used for the default rendering of a background event.
		// Called by the fill system.
		// TODO: consolidate with getEventSkinCss?
		bgEventSegCss: function(seg) {
			var view = this.view;
			var event = seg.event;
			var source = event.source || {};

			return {
				'background-color':
					event.backgroundColor ||
					event.color ||
					source.backgroundColor ||
					source.color ||
					view.opt('eventBackgroundColor') ||
					view.opt('eventColor')
			};
		},


		// Generates an array of classNames to be used for the rendering business hours overlay. Called by the fill system.
		businessHoursSegClasses: function(seg) {
			return [ 'fc-nonbusiness', 'fc-bgevent' ];
		},


		/* Handlers
		------------------------------------------------------------------------------------------------------------------*/


		// Attaches event-element-related handlers to the container element and leverage bubbling
		bindSegHandlers: function() {
			var _this = this;
			var view = this.view;

			$.each(
				{
					mouseenter: function(seg, ev) {
						_this.triggerSegMouseover(seg, ev);
					},
					mouseleave: function(seg, ev) {
						_this.triggerSegMouseout(seg, ev);
					},
					click: function(seg, ev) {
						return view.trigger('eventClick', this, seg.event, ev); // can return `false` to cancel
					},
					mousedown: function(seg, ev) {
						if ($(ev.target).is('.fc-resizer') && view.isEventResizable(seg.event)) {
							_this.segResizeMousedown(seg, ev, $(ev.target).is('.fc-start-resizer'));
						}
						else if (view.isEventDraggable(seg.event)) {
							_this.segDragMousedown(seg, ev);
						}
					}
				},
				function(name, func) {
					// attach the handler to the container element and only listen for real event elements via bubbling
					_this.el.on(name, '.fc-event-container > *', function(ev) {
						var seg = $(this).data('fc-seg'); // grab segment data. put there by View::renderEvents

						// only call the handlers if there is not a drag/resize in progress
						if (seg && !_this.isDraggingSeg && !_this.isResizingSeg) {
							return func.call(this, seg, ev); // `this` will be the event element
						}
					});
				}
			);
		},


		// Updates internal state and triggers handlers for when an event element is moused over
		triggerSegMouseover: function(seg, ev) {
			if (!this.mousedOverSeg) {
				this.mousedOverSeg = seg;
				this.view.trigger('eventMouseover', seg.el[0], seg.event, ev);
			}
		},


		// Updates internal state and triggers handlers for when an event element is moused out.
		// Can be given no arguments, in which case it will mouseout the segment that was previously moused over.
		triggerSegMouseout: function(seg, ev) {
			ev = ev || {}; // if given no args, make a mock mouse event

			if (this.mousedOverSeg) {
				seg = seg || this.mousedOverSeg; // if given no args, use the currently moused-over segment
				this.mousedOverSeg = null;
				this.view.trigger('eventMouseout', seg.el[0], seg.event, ev);
			}
		},


		/* Event Dragging
		------------------------------------------------------------------------------------------------------------------*/


		// Called when the user does a mousedown on an event, which might lead to dragging.
		// Generic enough to work with any type of Grid.
		segDragMousedown: function(seg, ev) {
			var _this = this;
			var view = this.view;
			var calendar = view.calendar;
			var el = seg.el;
			var event = seg.event;
			var dropLocation; // zoned event date properties

			// A clone of the original element that will move with the mouse
			var mouseFollower = new MouseFollower(seg.el, {
				parentEl: view.el,
				opacity: view.opt('dragOpacity'),
				revertDuration: view.opt('dragRevertDuration'),
				zIndex: 2 // one above the .fc-view
			});

			// Tracks mouse movement over the *view's* coordinate map. Allows dragging and dropping between subcomponents
			// of the view.
			var dragListener = new HitDragListener(view, {
				distance: 5,
				scroll: view.opt('dragScroll'),
				subjectEl: el,
				subjectCenter: true,
				listenStart: function(ev) {
					mouseFollower.hide(); // don't show until we know this is a real drag
					mouseFollower.start(ev);
				},
				dragStart: function(ev) {
					_this.triggerSegMouseout(seg, ev); // ensure a mouseout on the manipulated event has been reported
					_this.segDragStart(seg, ev);
					view.hideEvent(event); // hide all event segments. our mouseFollower will take over
				},
				hitOver: function(hit, isOrig, origHit) {

					// starting hit could be forced (DayGrid.limit)
					if (seg.hit) {
						origHit = seg.hit;
					}

					// since we are querying the parent view, might not belong to this grid
					dropLocation = _this.computeEventDrop(
						origHit.component.getHitSpan(origHit),
						hit.component.getHitSpan(hit),
						event
					);

					if (dropLocation &&!calendar.isEventSpanAllowed(_this.eventToSpan(dropLocation), event)) {
						disableCursor();
						dropLocation = null;
					}

					// if a valid drop location, have the subclass render a visual indication
					if (dropLocation && view.renderDrag(dropLocation, seg)) {
						mouseFollower.hide(); // if the subclass is already using a mock event "helper", hide our own
					}
					else {
						mouseFollower.show(); // otherwise, have the helper follow the mouse (no snapping)
					}

					if (isOrig) {
						dropLocation = null; // needs to have moved hits to be a valid drop
					}
				},
				hitOut: function() { // called before mouse moves to a different hit OR moved out of all hits
					view.unrenderDrag(); // unrender whatever was done in renderDrag
					mouseFollower.show(); // show in case we are moving out of all hits
					dropLocation = null;
				},
				hitDone: function() { // Called after a hitOut OR before a dragStop
					enableCursor();
				},
				dragStop: function(ev) {
					// do revert animation if hasn't changed. calls a callback when finished (whether animation or not)
					mouseFollower.stop(!dropLocation, function() {
						view.unrenderDrag();
						view.showEvent(event);
						_this.segDragStop(seg, ev);

						if (dropLocation) {
							view.reportEventDrop(event, dropLocation, this.largeUnit, el, ev);
						}
					});
				},
				listenStop: function() {
					mouseFollower.stop(); // put in listenStop in case there was a mousedown but the drag never started
				}
			});

			dragListener.mousedown(ev); // start listening, which will eventually lead to a dragStart
		},


		// Called before event segment dragging starts
		segDragStart: function(seg, ev) {
			this.isDraggingSeg = true;
			this.view.trigger('eventDragStart', seg.el[0], seg.event, ev, {}); // last argument is jqui dummy
		},


		// Called after event segment dragging stops
		segDragStop: function(seg, ev) {
			this.isDraggingSeg = false;
			this.view.trigger('eventDragStop', seg.el[0], seg.event, ev, {}); // last argument is jqui dummy
		},


		// Given the spans an event drag began, and the span event was dropped, calculates the new zoned start/end/allDay
		// values for the event. Subclasses may override and set additional properties to be used by renderDrag.
		// A falsy returned value indicates an invalid drop.
		computeEventDrop: function(startSpan, endSpan, event) {
			var calendar = this.view.calendar;
			var dragStart = startSpan.start;
			var dragEnd = endSpan.start;
			var delta;
			var dropLocation; // zoned event date properties

			if (dragStart.hasTime() === dragEnd.hasTime()) {
				delta = this.diffDates(dragEnd, dragStart);

				// if an all-day event was in a timed area and it was dragged to a different time,
				// guarantee an end and adjust start/end to have times
				if (event.allDay && durationHasTime(delta)) {
					dropLocation = {
						start: event.start.clone(),
						end: calendar.getEventEnd(event), // will be an ambig day
						allDay: false // for normalizeEventTimes
					};
					calendar.normalizeEventTimes(dropLocation);
				}
				// othewise, work off existing values
				else {
					dropLocation = {
						start: event.start.clone(),
						end: event.end ? event.end.clone() : null,
						allDay: event.allDay // keep it the same
					};
				}

				dropLocation.start.add(delta);
				if (dropLocation.end) {
					dropLocation.end.add(delta);
				}
			}
			else {
				// if switching from day <-> timed, start should be reset to the dropped date, and the end cleared
				dropLocation = {
					start: dragEnd.clone(),
					end: null, // end should be cleared
					allDay: !dragEnd.hasTime()
				};
			}

			return dropLocation;
		},


		// Utility for apply dragOpacity to a jQuery set
		applyDragOpacity: function(els) {
			var opacity = this.view.opt('dragOpacity');

			if (opacity != null) {
				els.each(function(i, node) {
					// Don't use jQuery (will set an IE filter), do it the old fashioned way.
					// In IE8, a helper element will disappears if there's a filter.
					node.style.opacity = opacity;
				});
			}
		},


		/* External Element Dragging
		------------------------------------------------------------------------------------------------------------------*/


		// Called when a jQuery UI drag is initiated anywhere in the DOM
		externalDragStart: function(ev, ui) {
			var view = this.view;
			var el;
			var accept;

			if (view.opt('droppable')) { // only listen if this setting is on
				el = $((ui ? ui.item : null) || ev.target);

				// Test that the dragged element passes the dropAccept selector or filter function.
				// FYI, the default is "*" (matches all)
				accept = view.opt('dropAccept');
				if ($.isFunction(accept) ? accept.call(el[0], el) : el.is(accept)) {
					if (!this.isDraggingExternal) { // prevent double-listening if fired twice
						this.listenToExternalDrag(el, ev, ui);
					}
				}
			}
		},


		// Called when a jQuery UI drag starts and it needs to be monitored for dropping
		listenToExternalDrag: function(el, ev, ui) {
			var _this = this;
			var meta = getDraggedElMeta(el); // extra data about event drop, including possible event to create
			var dropLocation; // a null value signals an unsuccessful drag

			// listener that tracks mouse movement over date-associated pixel regions
			var dragListener = new HitDragListener(this, {
				listenStart: function() {
					_this.isDraggingExternal = true;
				},
				hitOver: function(hit) {
					dropLocation = _this.computeExternalDrop(
						hit.component.getHitSpan(hit), // since we are querying the parent view, might not belong to this grid
						meta
					);
					if (dropLocation) {
						_this.renderDrag(dropLocation); // called without a seg parameter
					}
					else { // invalid hit
						disableCursor();
					}
				},
				hitOut: function() {
					dropLocation = null; // signal unsuccessful
					_this.unrenderDrag();
					enableCursor();
				},
				dragStop: function() {
					_this.unrenderDrag();
					enableCursor();

					if (dropLocation) { // element was dropped on a valid hit
						_this.view.reportExternalDrop(meta, dropLocation, el, ev, ui);
					}
				},
				listenStop: function() {
					_this.isDraggingExternal = false;
				}
			});

			dragListener.startDrag(ev); // start listening immediately
		},


		// Given a hit to be dropped upon, and misc data associated with the jqui drag (guaranteed to be a plain object),
		// returns the zoned start/end dates for the event that would result from the hypothetical drop. end might be null.
		// Returning a null value signals an invalid drop hit.
		computeExternalDrop: function(span, meta) {
			var calendar = this.view.calendar;
			var dropLocation = {
				start: calendar.applyTimezone(span.start), // simulate a zoned event start date
				end: null
			};

			// if dropped on an all-day span, and element's metadata specified a time, set it
			if (meta.startTime && !dropLocation.start.hasTime()) {
				dropLocation.start.time(meta.startTime);
			}

			if (meta.duration) {
				dropLocation.end = dropLocation.start.clone().add(meta.duration);
			}

			if (!calendar.isExternalSpanAllowed(this.eventToSpan(dropLocation), dropLocation, meta.eventProps)) {
				return null;
			}

			return dropLocation;
		},



		/* Drag Rendering (for both events and an external elements)
		------------------------------------------------------------------------------------------------------------------*/


		// Renders a visual indication of an event or external element being dragged.
		// `dropLocation` contains hypothetical start/end/allDay values the event would have if dropped. end can be null.
		// `seg` is the internal segment object that is being dragged. If dragging an external element, `seg` is null.
		// A truthy returned value indicates this method has rendered a helper element.
		renderDrag: function(dropLocation, seg) {
			// subclasses must implement
		},


		// Unrenders a visual indication of an event or external element being dragged
		unrenderDrag: function() {
			// subclasses must implement
		},


		/* Resizing
		------------------------------------------------------------------------------------------------------------------*/


		// Called when the user does a mousedown on an event's resizer, which might lead to resizing.
		// Generic enough to work with any type of Grid.
		segResizeMousedown: function(seg, ev, isStart) {
			var _this = this;
			var view = this.view;
			var calendar = view.calendar;
			var el = seg.el;
			var event = seg.event;
			var eventEnd = calendar.getEventEnd(event);
			var resizeLocation; // zoned event date properties. falsy if invalid resize

			// Tracks mouse movement over the *grid's* coordinate map
			var dragListener = new HitDragListener(this, {
				distance: 5,
				scroll: view.opt('dragScroll'),
				subjectEl: el,
				dragStart: function(ev) {
					_this.triggerSegMouseout(seg, ev); // ensure a mouseout on the manipulated event has been reported
					_this.segResizeStart(seg, ev);
				},
				hitOver: function(hit, isOrig, origHit) {
					var origHitSpan = _this.getHitSpan(origHit);
					var hitSpan = _this.getHitSpan(hit);

					resizeLocation = isStart ?
						_this.computeEventStartResize(origHitSpan, hitSpan, event) :
						_this.computeEventEndResize(origHitSpan, hitSpan, event);

					if (resizeLocation) {
						if (!calendar.isEventSpanAllowed(_this.eventToSpan(resizeLocation), event)) {
							disableCursor();
							resizeLocation = null;
						}
						// no change? (TODO: how does this work with timezones?)
						else if (resizeLocation.start.isSame(event.start) && resizeLocation.end.isSame(eventEnd)) {
							resizeLocation = null;
						}
					}

					if (resizeLocation) {
						view.hideEvent(event);
						_this.renderEventResize(resizeLocation, seg);
					}
				},
				hitOut: function() { // called before mouse moves to a different hit OR moved out of all hits
					resizeLocation = null;
				},
				hitDone: function() { // resets the rendering to show the original event
					_this.unrenderEventResize();
					view.showEvent(event);
					enableCursor();
				},
				dragStop: function(ev) {
					_this.segResizeStop(seg, ev);

					if (resizeLocation) { // valid date to resize to?
						view.reportEventResize(event, resizeLocation, this.largeUnit, el, ev);
					}
				}
			});

			dragListener.mousedown(ev); // start listening, which will eventually lead to a dragStart
		},


		// Called before event segment resizing starts
		segResizeStart: function(seg, ev) {
			this.isResizingSeg = true;
			this.view.trigger('eventResizeStart', seg.el[0], seg.event, ev, {}); // last argument is jqui dummy
		},


		// Called after event segment resizing stops
		segResizeStop: function(seg, ev) {
			this.isResizingSeg = false;
			this.view.trigger('eventResizeStop', seg.el[0], seg.event, ev, {}); // last argument is jqui dummy
		},


		// Returns new date-information for an event segment being resized from its start
		computeEventStartResize: function(startSpan, endSpan, event) {
			return this.computeEventResize('start', startSpan, endSpan, event);
		},


		// Returns new date-information for an event segment being resized from its end
		computeEventEndResize: function(startSpan, endSpan, event) {
			return this.computeEventResize('end', startSpan, endSpan, event);
		},


		// Returns new zoned date information for an event segment being resized from its start OR end
		// `type` is either 'start' or 'end'
		computeEventResize: function(type, startSpan, endSpan, event) {
			var calendar = this.view.calendar;
			var delta = this.diffDates(endSpan[type], startSpan[type]);
			var resizeLocation; // zoned event date properties
			var defaultDuration;

			// build original values to work from, guaranteeing a start and end
			resizeLocation = {
				start: event.start.clone(),
				end: calendar.getEventEnd(event),
				allDay: event.allDay
			};

			// if an all-day event was in a timed area and was resized to a time, adjust start/end to have times
			if (resizeLocation.allDay && durationHasTime(delta)) {
				resizeLocation.allDay = false;
				calendar.normalizeEventTimes(resizeLocation);
			}

			resizeLocation[type].add(delta); // apply delta to start or end

			// if the event was compressed too small, find a new reasonable duration for it
			if (!resizeLocation.start.isBefore(resizeLocation.end)) {

				defaultDuration =
					this.minResizeDuration || // TODO: hack
					(event.allDay ?
						calendar.defaultAllDayEventDuration :
						calendar.defaultTimedEventDuration);

				if (type == 'start') { // resizing the start?
					resizeLocation.start = resizeLocation.end.clone().subtract(defaultDuration);
				}
				else { // resizing the end?
					resizeLocation.end = resizeLocation.start.clone().add(defaultDuration);
				}
			}

			return resizeLocation;
		},


		// Renders a visual indication of an event being resized.
		// `range` has the updated dates of the event. `seg` is the original segment object involved in the drag.
		renderEventResize: function(range, seg) {
			// subclasses must implement
		},


		// Unrenders a visual indication of an event being resized.
		unrenderEventResize: function() {
			// subclasses must implement
		},


		/* Rendering Utils
		------------------------------------------------------------------------------------------------------------------*/


		// Compute the text that should be displayed on an event's element.
		// `range` can be the Event object itself, or something range-like, with at least a `start`.
		// If event times are disabled, or the event has no time, will return a blank string.
		// If not specified, formatStr will default to the eventTimeFormat setting,
		// and displayEnd will default to the displayEventEnd setting.
		getEventTimeText: function(range, formatStr, displayEnd) {

			if (formatStr == null) {
				formatStr = this.eventTimeFormat;
			}

			if (displayEnd == null) {
				displayEnd = this.displayEventEnd;
			}

			if (this.displayEventTime && range.start.hasTime()) {
				if (displayEnd && range.end) {
					return this.view.formatRange(range, formatStr);
				}
				else {
					return range.start.format(formatStr);
				}
			}

			return '';
		},


		// Generic utility for generating the HTML classNames for an event segment's element
		getSegClasses: function(seg, isDraggable, isResizable) {
			var event = seg.event;
			var classes = [
				'fc-event',
				seg.isStart ? 'fc-start' : 'fc-not-start',
				seg.isEnd ? 'fc-end' : 'fc-not-end'
			].concat(
				event.className,
				event.source ? event.source.className : []
			);

			if (isDraggable) {
				classes.push('fc-draggable');
			}
			if (isResizable) {
				classes.push('fc-resizable');
			}

			return classes;
		},


		// Utility for generating event skin-related CSS properties
		getEventSkinCss: function(event) {
			var view = this.view;
			var source = event.source || {};
			var eventColor = event.color;
			var sourceColor = source.color;
			var optionColor = view.opt('eventColor');

			return {
				'background-color':
					event.backgroundColor ||
					eventColor ||
					source.backgroundColor ||
					sourceColor ||
					view.opt('eventBackgroundColor') ||
					optionColor,
				'border-color':
					event.borderColor ||
					eventColor ||
					source.borderColor ||
					sourceColor ||
					view.opt('eventBorderColor') ||
					optionColor,
				color:
					event.textColor ||
					source.textColor ||
					view.opt('eventTextColor')
			};
		},


		/* Converting events -> eventRange -> eventSpan -> eventSegs
		------------------------------------------------------------------------------------------------------------------*/


		// Generates an array of segments for the given single event
		eventToSegs: function(event) {
			return this.eventsToSegs([ event ]);
		},


		// Generates a single span (always unzoned) by using the given event's dates.
		// Does not do any inverting for inverse-background events.
		eventToSpan: function(event) {
			var range = this.eventToRange(event);
			this.transformEventSpan(range, event); // convert it to a span, in-place
			return range;
		},


		// Converts an array of event objects into an array of event segment objects.
		// A custom `segSliceFunc` may be given for arbitrarily slicing up events.
		// Doesn't guarantee an order for the resulting array.
		eventsToSegs: function(allEvents, segSliceFunc) {
			var _this = this;
			var eventsById = groupEventsById(allEvents);
			var segs = [];

			$.each(eventsById, function(id, events) {
				var ranges = [];
				var i;

				for (i = 0; i < events.length; i++) {
					ranges.push(_this.eventToRange(events[i]));
				}

				// inverse-background events (utilize only the first event in calculations)
				if (isInverseBgEvent(events[0])) {
					ranges = _this.invertRanges(ranges);

					for (i = 0; i < ranges.length; i++) {
						_this.generateEventSegs(ranges[i], events[0], segSliceFunc, segs);
					}
				}
				// normal event ranges
				else {
					for (i = 0; i < ranges.length; i++) {
						_this.generateEventSegs(ranges[i], events[i], segSliceFunc, segs);
					}
				}
			});

			return segs;
		},


		// Generates the unzoned start/end dates an event appears to occupy
		eventToRange: function(event) {
			return {
				start: event.start.clone().stripZone(),
				end: this.view.calendar.getEventEnd(event).stripZone()
			};
		},


		// Given an event's span (unzoned start/end and other misc data), and the event itself,
		// slice into segments (using the segSliceFunc function if specified) and append to the `out` array.
		// SIDE EFFECT: will mutate the given `range`.
		generateEventSegs: function(range, event, segSliceFunc, out) {
			var segs;
			var i;

			this.transformEventSpan(range, event); // converts the range to a span

			segs = segSliceFunc ? segSliceFunc(range) : this.spanToSegs(range);

			for (i = 0; i < segs.length; i++) {
				this.transformEventSeg(segs[i], range, event);
				out.push(segs[i]);
			}
		},


		// Given a range (unzoned start/end) that is about to become a span,
		// attach any event-derived properties to it.
		transformEventSpan: function(range, event) {
			// subclasses can implement
		},


		// Given a segment object, attach any extra properties, based off of its source span and event.
		transformEventSeg: function(seg, span, event) {
			seg.event = event;
			seg.eventStartMS = +span.start; // TODO: not the best name after making spans unzoned
			seg.eventDurationMS = span.end - span.start;
		},


		// Produces a new array of range objects that will cover all the time NOT covered by the given ranges.
		// SIDE EFFECT: will mutate the given array and will use its date references.
		invertRanges: function(ranges) {
			var view = this.view;
			var viewStart = view.start.clone(); // need a copy
			var viewEnd = view.end.clone(); // need a copy
			var inverseRanges = [];
			var start = viewStart; // the end of the previous range. the start of the new range
			var i, range;

			// ranges need to be in order. required for our date-walking algorithm
			ranges.sort(compareRanges);

			for (i = 0; i < ranges.length; i++) {
				range = ranges[i];

				// add the span of time before the event (if there is any)
				if (range.start > start) { // compare millisecond time (skip any ambig logic)
					inverseRanges.push({
						start: start,
						end: range.start
					});
				}

				start = range.end;
			}

			// add the span of time after the last event (if there is any)
			if (start < viewEnd) { // compare millisecond time (skip any ambig logic)
				inverseRanges.push({
					start: start,
					end: viewEnd
				});
			}

			return inverseRanges;
		},


		sortEventSegs: function(segs) {
			segs.sort(proxy(this, 'compareEventSegs'));
		},


		// A cmp function for determining which segments should take visual priority
		compareEventSegs: function(seg1, seg2) {
			return seg1.eventStartMS - seg2.eventStartMS || // earlier events go first
				seg2.eventDurationMS - seg1.eventDurationMS || // tie? longer events go first
				seg2.event.allDay - seg1.event.allDay || // tie? put all-day events first (booleans cast to 0/1)
				compareByFieldSpecs(seg1.event, seg2.event, this.view.eventOrderSpecs);
		}

	});


	/* Utilities
	----------------------------------------------------------------------------------------------------------------------*/


	function isBgEvent(event) { // returns true if background OR inverse-background
		var rendering = getEventRendering(event);
		return rendering === 'background' || rendering === 'inverse-background';
	}


	function isInverseBgEvent(event) {
		return getEventRendering(event) === 'inverse-background';
	}


	function getEventRendering(event) {
		return firstDefined((event.source || {}).rendering, event.rendering);
	}


	function groupEventsById(events) {
		var eventsById = {};
		var i, event;

		for (i = 0; i < events.length; i++) {
			event = events[i];
			(eventsById[event._id] || (eventsById[event._id] = [])).push(event);
		}

		return eventsById;
	}


	// A cmp function for determining which non-inverted "ranges" (see above) happen earlier
	function compareRanges(range1, range2) {
		return range1.start - range2.start; // earlier ranges go first
	}


	/* External-Dragging-Element Data
	----------------------------------------------------------------------------------------------------------------------*/

	// Require all HTML5 data-* attributes used by FullCalendar to have this prefix.
	// A value of '' will query attributes like data-event. A value of 'fc' will query attributes like data-fc-event.
	FC.dataAttrPrefix = '';

	// Given a jQuery element that might represent a dragged FullCalendar event, returns an intermediate data structure
	// to be used for Event Object creation.
	// A defined `.eventProps`, even when empty, indicates that an event should be created.
	function getDraggedElMeta(el) {
		var prefix = FC.dataAttrPrefix;
		var eventProps; // properties for creating the event, not related to date/time
		var startTime; // a Duration
		var duration;
		var stick;

		if (prefix) { prefix += '-'; }
		eventProps = el.data(prefix + 'event') || null;

		if (eventProps) {
			if (typeof eventProps === 'object') {
				eventProps = $.extend({}, eventProps); // make a copy
			}
			else { // something like 1 or true. still signal event creation
				eventProps = {};
			}

			// pluck special-cased date/time properties
			startTime = eventProps.start;
			if (startTime == null) { startTime = eventProps.time; } // accept 'time' as well
			duration = eventProps.duration;
			stick = eventProps.stick;
			delete eventProps.start;
			delete eventProps.time;
			delete eventProps.duration;
			delete eventProps.stick;
		}

		// fallback to standalone attribute values for each of the date/time properties
		if (startTime == null) { startTime = el.data(prefix + 'start'); }
		if (startTime == null) { startTime = el.data(prefix + 'time'); } // accept 'time' as well
		if (duration == null) { duration = el.data(prefix + 'duration'); }
		if (stick == null) { stick = el.data(prefix + 'stick'); }

		// massage into correct data types
		startTime = startTime != null ? moment.duration(startTime) : null;
		duration = duration != null ? moment.duration(duration) : null;
		stick = Boolean(stick);

		return { eventProps: eventProps, startTime: startTime, duration: duration, stick: stick };
	}


	;;

	/*
	A set of rendering and date-related methods for a visual component comprised of one or more rows of day columns.
	Prerequisite: the object being mixed into needs to be a *Grid*
	*/
	var DayTableMixin = FC.DayTableMixin = {

		breakOnWeeks: false, // should create a new row for each week?
		dayDates: null, // whole-day dates for each column. left to right
		dayIndices: null, // for each day from start, the offset
		daysPerRow: null,
		rowCnt: null,
		colCnt: null,
		colHeadFormat: null,


		// Populates internal variables used for date calculation and rendering
		updateDayTable: function() {
			var view = this.view;
			var date = this.start.clone();
			var dayIndex = -1;
			var dayIndices = [];
			var dayDates = [];
			var daysPerRow;
			var firstDay;
			var rowCnt;

			while (date.isBefore(this.end)) { // loop each day from start to end
				if (view.isHiddenDay(date)) {
					dayIndices.push(dayIndex + 0.5); // mark that it's between indices
				}
				else {
					dayIndex++;
					dayIndices.push(dayIndex);
					dayDates.push(date.clone());
				}
				date.add(1, 'days');
			}

			if (this.breakOnWeeks) {
				// count columns until the day-of-week repeats
				firstDay = dayDates[0].day();
				for (daysPerRow = 1; daysPerRow < dayDates.length; daysPerRow++) {
					if (dayDates[daysPerRow].day() == firstDay) {
						break;
					}
				}
				rowCnt = Math.ceil(dayDates.length / daysPerRow);
			}
			else {
				rowCnt = 1;
				daysPerRow = dayDates.length;
			}

			this.dayDates = dayDates;
			this.dayIndices = dayIndices;
			this.daysPerRow = daysPerRow;
			this.rowCnt = rowCnt;
			
			this.updateDayTableCols();
		},


		// Computes and assigned the colCnt property and updates any options that may be computed from it
		updateDayTableCols: function() {
			this.colCnt = this.computeColCnt();
			this.colHeadFormat = this.view.opt('columnFormat') || this.computeColHeadFormat();
		},


		// Determines how many columns there should be in the table
		computeColCnt: function() {
			return this.daysPerRow;
		},


		// Computes the ambiguously-timed moment for the given cell
		getCellDate: function(row, col) {
			return this.dayDates[
					this.getCellDayIndex(row, col)
				].clone();
		},


		// Computes the ambiguously-timed date range for the given cell
		getCellRange: function(row, col) {
			var start = this.getCellDate(row, col);
			var end = start.clone().add(1, 'days');

			return { start: start, end: end };
		},


		// Returns the number of day cells, chronologically, from the first of the grid (0-based)
		getCellDayIndex: function(row, col) {
			return row * this.daysPerRow + this.getColDayIndex(col);
		},


		// Returns the numner of day cells, chronologically, from the first cell in *any given row*
		getColDayIndex: function(col) {
			if (this.isRTL) {
				return this.colCnt - 1 - col;
			}
			else {
				return col;
			}
		},


		// Given a date, returns its chronolocial cell-index from the first cell of the grid.
		// If the date lies between cells (because of hiddenDays), returns a floating-point value between offsets.
		// If before the first offset, returns a negative number.
		// If after the last offset, returns an offset past the last cell offset.
		// Only works for *start* dates of cells. Will not work for exclusive end dates for cells.
		getDateDayIndex: function(date) {
			var dayIndices = this.dayIndices;
			var dayOffset = date.diff(this.start, 'days');

			if (dayOffset < 0) {
				return dayIndices[0] - 1;
			}
			else if (dayOffset >= dayIndices.length) {
				return dayIndices[dayIndices.length - 1] + 1;
			}
			else {
				return dayIndices[dayOffset];
			}
		},


		/* Options
		------------------------------------------------------------------------------------------------------------------*/


		// Computes a default column header formatting string if `colFormat` is not explicitly defined
		computeColHeadFormat: function() {
			// if more than one week row, or if there are a lot of columns with not much space,
			// put just the day numbers will be in each cell
			if (this.rowCnt > 1 || this.colCnt > 10) {
				return 'ddd'; // "Sat"
			}
			// multiple days, so full single date string WON'T be in title text
			else if (this.colCnt > 1) {
				return this.view.opt('dayOfMonthFormat'); // "Sat 12/10"
			}
			// single day, so full single date string will probably be in title text
			else {
				return 'dddd'; // "Saturday"
			}
		},


		/* Slicing
		------------------------------------------------------------------------------------------------------------------*/


		// Slices up a date range into a segment for every week-row it intersects with
		sliceRangeByRow: function(range) {
			var daysPerRow = this.daysPerRow;
			var normalRange = this.view.computeDayRange(range); // make whole-day range, considering nextDayThreshold
			var rangeFirst = this.getDateDayIndex(normalRange.start); // inclusive first index
			var rangeLast = this.getDateDayIndex(normalRange.end.clone().subtract(1, 'days')); // inclusive last index
			var segs = [];
			var row;
			var rowFirst, rowLast; // inclusive day-index range for current row
			var segFirst, segLast; // inclusive day-index range for segment

			for (row = 0; row < this.rowCnt; row++) {
				rowFirst = row * daysPerRow;
				rowLast = rowFirst + daysPerRow - 1;

				// intersect segment's offset range with the row's
				segFirst = Math.max(rangeFirst, rowFirst);
				segLast = Math.min(rangeLast, rowLast);

				// deal with in-between indices
				segFirst = Math.ceil(segFirst); // in-between starts round to next cell
				segLast = Math.floor(segLast); // in-between ends round to prev cell

				if (segFirst <= segLast) { // was there any intersection with the current row?
					segs.push({
						row: row,

						// normalize to start of row
						firstRowDayIndex: segFirst - rowFirst,
						lastRowDayIndex: segLast - rowFirst,

						// must be matching integers to be the segment's start/end
						isStart: segFirst === rangeFirst,
						isEnd: segLast === rangeLast
					});
				}
			}

			return segs;
		},


		// Slices up a date range into a segment for every day-cell it intersects with.
		// TODO: make more DRY with sliceRangeByRow somehow.
		sliceRangeByDay: function(range) {
			var daysPerRow = this.daysPerRow;
			var normalRange = this.view.computeDayRange(range); // make whole-day range, considering nextDayThreshold
			var rangeFirst = this.getDateDayIndex(normalRange.start); // inclusive first index
			var rangeLast = this.getDateDayIndex(normalRange.end.clone().subtract(1, 'days')); // inclusive last index
			var segs = [];
			var row;
			var rowFirst, rowLast; // inclusive day-index range for current row
			var i;
			var segFirst, segLast; // inclusive day-index range for segment

			for (row = 0; row < this.rowCnt; row++) {
				rowFirst = row * daysPerRow;
				rowLast = rowFirst + daysPerRow - 1;

				for (i = rowFirst; i <= rowLast; i++) {

					// intersect segment's offset range with the row's
					segFirst = Math.max(rangeFirst, i);
					segLast = Math.min(rangeLast, i);

					// deal with in-between indices
					segFirst = Math.ceil(segFirst); // in-between starts round to next cell
					segLast = Math.floor(segLast); // in-between ends round to prev cell

					if (segFirst <= segLast) { // was there any intersection with the current row?
						segs.push({
							row: row,

							// normalize to start of row
							firstRowDayIndex: segFirst - rowFirst,
							lastRowDayIndex: segLast - rowFirst,

							// must be matching integers to be the segment's start/end
							isStart: segFirst === rangeFirst,
							isEnd: segLast === rangeLast
						});
					}
				}
			}

			return segs;
		},


		/* Header Rendering
		------------------------------------------------------------------------------------------------------------------*/


		renderHeadHtml: function() {
			var view = this.view;

			return '' +
				'<div class="fc-row ' + view.widgetHeaderClass + '">' +
					'<table>' +
						'<thead>' +
							this.renderHeadTrHtml() +
						'</thead>' +
					'</table>' +
				'</div>';
		},


		renderHeadIntroHtml: function() {
			return this.renderIntroHtml(); // fall back to generic
		},


		renderHeadTrHtml: function() {
			return '' +
				'<tr>' +
					(this.isRTL ? '' : this.renderHeadIntroHtml()) +
					this.renderHeadDateCellsHtml() +
					(this.isRTL ? this.renderHeadIntroHtml() : '') +
				'</tr>';
		},


		renderHeadDateCellsHtml: function() {
			var htmls = [];
			var col, date;

			for (col = 0; col < this.colCnt; col++) {
				date = this.getCellDate(0, col);
				htmls.push(this.renderHeadDateCellHtml(date));
			}

			return htmls.join('');
		},


		renderHeadDateCellHtml: function(date, colspan) {
			var view = this.view;

			return '' +
				'<th class="fc-day-header ' + view.widgetHeaderClass + ' fc-' + dayIDs[date.day()] + '"' +
					(colspan > 1 ? ' colspan="' + colspan + '"' : '') +
					'>' +
					htmlEscape(date.format(this.colHeadFormat)) +
				'</th>';
		},


		/* Background Rendering
		------------------------------------------------------------------------------------------------------------------*/


		renderBgTrHtml: function(row) {
			return '' +
				'<tr>' +
					(this.isRTL ? '' : this.renderBgIntroHtml(row)) +
					this.renderBgCellsHtml(row) +
					(this.isRTL ? this.renderBgIntroHtml(row) : '') +
				'</tr>';
		},


		renderBgIntroHtml: function(row) {
			return this.renderIntroHtml(); // fall back to generic
		},


		renderBgCellsHtml: function(row) {
			var htmls = [];
			var col, date;

			for (col = 0; col < this.colCnt; col++) {
				date = this.getCellDate(row, col);
				htmls.push(this.renderBgCellHtml(date));
			}

			return htmls.join('');
		},


		renderBgCellHtml: function(date) {
			var view = this.view;
			var classes = this.getDayClasses(date);

			classes.unshift('fc-day', view.widgetContentClass);

			return '<td class="' + classes.join(' ') + '"' +
				' data-date="' + date.format('YYYY-MM-DD') + '"' + // if date has a time, won't format it
				'></td>';
		},


		/* Generic
		------------------------------------------------------------------------------------------------------------------*/


		// Generates the default HTML intro for any row. User classes should override
		renderIntroHtml: function() {
		},


		/* Utils
		------------------------------------------------------------------------------------------------------------------*/


		// Applies the generic "intro" and "outro" HTML to the given cells.
		// Intro means the leftmost cell when the calendar is LTR and the rightmost cell when RTL. Vice-versa for outro.
		bookendCells: function(trEl) {
			var introHtml = this.renderIntroHtml();

			if (introHtml) {
				if (this.isRTL) {
					trEl.append(introHtml);
				}
				else {
					trEl.prepend(introHtml);
				}
			}
		}

	};

	;;

	/* A component that renders a grid of whole-days that runs horizontally. There can be multiple rows, one per week.
	----------------------------------------------------------------------------------------------------------------------*/

	var DayGrid = FC.DayGrid = Grid.extend(DayTableMixin, {

		numbersVisible: false, // should render a row for day/week numbers? set by outside view. TODO: make internal
		bottomCoordPadding: 0, // hack for extending the hit area for the last row of the coordinate grid

		rowEls: null, // set of fake row elements
		cellEls: null, // set of whole-day elements comprising the row's background
		helperEls: null, // set of cell skeleton elements for rendering the mock event "helper"

		rowCoordCache: null,
		colCoordCache: null,


		// Renders the rows and columns into the component's `this.el`, which should already be assigned.
		// isRigid determins whether the individual rows should ignore the contents and be a constant height.
		// Relies on the view's colCnt and rowCnt. In the future, this component should probably be self-sufficient.
		renderDates: function(isRigid) {
			var view = this.view;
			var rowCnt = this.rowCnt;
			var colCnt = this.colCnt;
			var html = '';
			var row;
			var col;

			for (row = 0; row < rowCnt; row++) {
				html += this.renderDayRowHtml(row, isRigid);
			}
			this.el.html(html);

			this.rowEls = this.el.find('.fc-row');
			this.cellEls = this.el.find('.fc-day');

			this.rowCoordCache = new CoordCache({
				els: this.rowEls,
				isVertical: true
			});
			this.colCoordCache = new CoordCache({
				els: this.cellEls.slice(0, this.colCnt), // only the first row
				isHorizontal: true
			});

			// trigger dayRender with each cell's element
			for (row = 0; row < rowCnt; row++) {
				for (col = 0; col < colCnt; col++) {
					view.trigger(
						'dayRender',
						null,
						this.getCellDate(row, col),
						this.getCellEl(row, col)
					);
				}
			}
		},


		unrenderDates: function() {
			this.removeSegPopover();
		},


		renderBusinessHours: function() {
			var events = this.view.calendar.getBusinessHoursEvents(true); // wholeDay=true
			var segs = this.eventsToSegs(events);

			this.renderFill('businessHours', segs, 'bgevent');
		},


		// Generates the HTML for a single row, which is a div that wraps a table.
		// `row` is the row number.
		renderDayRowHtml: function(row, isRigid) {
			var view = this.view;
			var classes = [ 'fc-row', 'fc-week', view.widgetContentClass ];

			if (isRigid) {
				classes.push('fc-rigid');
			}

			return '' +
				'<div class="' + classes.join(' ') + '">' +
					'<div class="fc-bg">' +
						'<table>' +
							this.renderBgTrHtml(row) +
						'</table>' +
					'</div>' +
					'<div class="fc-content-skeleton">' +
						'<table>' +
							(this.numbersVisible ?
								'<thead>' +
									this.renderNumberTrHtml(row) +
								'</thead>' :
								''
								) +
						'</table>' +
					'</div>' +
				'</div>';
		},


		/* Grid Number Rendering
		------------------------------------------------------------------------------------------------------------------*/


		renderNumberTrHtml: function(row) {
			return '' +
				'<tr>' +
					(this.isRTL ? '' : this.renderNumberIntroHtml(row)) +
					this.renderNumberCellsHtml(row) +
					(this.isRTL ? this.renderNumberIntroHtml(row) : '') +
				'</tr>';
		},


		renderNumberIntroHtml: function(row) {
			return this.renderIntroHtml();
		},


		renderNumberCellsHtml: function(row) {
			var htmls = [];
			var col, date;

			for (col = 0; col < this.colCnt; col++) {
				date = this.getCellDate(row, col);
				htmls.push(this.renderNumberCellHtml(date));
			}

			return htmls.join('');
		},


		// Generates the HTML for the <td>s of the "number" row in the DayGrid's content skeleton.
		// The number row will only exist if either day numbers or week numbers are turned on.
		renderNumberCellHtml: function(date) {
			var classes;

			if (!this.view.dayNumbersVisible) { // if there are week numbers but not day numbers
				return '<td/>'; //  will create an empty space above events :(
			}

			classes = this.getDayClasses(date);
			classes.unshift('fc-day-number');

			return '' +
				'<td class="' + classes.join(' ') + '" data-date="' + date.format() + '">' +
					date.date() +
				'</td>';
		},


		/* Options
		------------------------------------------------------------------------------------------------------------------*/


		// Computes a default event time formatting string if `timeFormat` is not explicitly defined
		computeEventTimeFormat: function() {
			return this.view.opt('extraSmallTimeFormat'); // like "6p" or "6:30p"
		},


		// Computes a default `displayEventEnd` value if one is not expliclty defined
		computeDisplayEventEnd: function() {
			return this.colCnt == 1; // we'll likely have space if there's only one day
		},


		/* Dates
		------------------------------------------------------------------------------------------------------------------*/


		rangeUpdated: function() {
			this.updateDayTable();
		},


		// Slices up the given span (unzoned start/end with other misc data) into an array of segments
		spanToSegs: function(span) {
			var segs = this.sliceRangeByRow(span);
			var i, seg;

			for (i = 0; i < segs.length; i++) {
				seg = segs[i];
				if (this.isRTL) {
					seg.leftCol = this.daysPerRow - 1 - seg.lastRowDayIndex;
					seg.rightCol = this.daysPerRow - 1 - seg.firstRowDayIndex;
				}
				else {
					seg.leftCol = seg.firstRowDayIndex;
					seg.rightCol = seg.lastRowDayIndex;
				}
			}

			return segs;
		},


		/* Hit System
		------------------------------------------------------------------------------------------------------------------*/


		prepareHits: function() {
			this.colCoordCache.build();
			this.rowCoordCache.build();
			this.rowCoordCache.bottoms[this.rowCnt - 1] += this.bottomCoordPadding; // hack
		},


		releaseHits: function() {
			this.colCoordCache.clear();
			this.rowCoordCache.clear();
		},


		queryHit: function(leftOffset, topOffset) {
			var col = this.colCoordCache.getHorizontalIndex(leftOffset);
			var row = this.rowCoordCache.getVerticalIndex(topOffset);

			if (row != null && col != null) {
				return this.getCellHit(row, col);
			}
		},


		getHitSpan: function(hit) {
			return this.getCellRange(hit.row, hit.col);
		},


		getHitEl: function(hit) {
			return this.getCellEl(hit.row, hit.col);
		},


		/* Cell System
		------------------------------------------------------------------------------------------------------------------*/
		// FYI: the first column is the leftmost column, regardless of date


		getCellHit: function(row, col) {
			return {
				row: row,
				col: col,
				component: this, // needed unfortunately :(
				left: this.colCoordCache.getLeftOffset(col),
				right: this.colCoordCache.getRightOffset(col),
				top: this.rowCoordCache.getTopOffset(row),
				bottom: this.rowCoordCache.getBottomOffset(row)
			};
		},


		getCellEl: function(row, col) {
			return this.cellEls.eq(row * this.colCnt + col);
		},


		/* Event Drag Visualization
		------------------------------------------------------------------------------------------------------------------*/
		// TODO: move to DayGrid.event, similar to what we did with Grid's drag methods


		// Renders a visual indication of an event or external element being dragged.
		// `eventLocation` has zoned start and end (optional)
		renderDrag: function(eventLocation, seg) {

			// always render a highlight underneath
			this.renderHighlight(this.eventToSpan(eventLocation));

			// if a segment from the same calendar but another component is being dragged, render a helper event
			if (seg && !seg.el.closest(this.el).length) {

				this.renderEventLocationHelper(eventLocation, seg);
				this.applyDragOpacity(this.helperEls);

				return true; // a helper has been rendered
			}
		},


		// Unrenders any visual indication of a hovering event
		unrenderDrag: function() {
			this.unrenderHighlight();
			this.unrenderHelper();
		},


		/* Event Resize Visualization
		------------------------------------------------------------------------------------------------------------------*/


		// Renders a visual indication of an event being resized
		renderEventResize: function(eventLocation, seg) {
			this.renderHighlight(this.eventToSpan(eventLocation));
			this.renderEventLocationHelper(eventLocation, seg);
		},


		// Unrenders a visual indication of an event being resized
		unrenderEventResize: function() {
			this.unrenderHighlight();
			this.unrenderHelper();
		},


		/* Event Helper
		------------------------------------------------------------------------------------------------------------------*/


		// Renders a mock "helper" event. `sourceSeg` is the associated internal segment object. It can be null.
		renderHelper: function(event, sourceSeg) {
			var helperNodes = [];
			var segs = this.eventToSegs(event);
			var rowStructs;

			segs = this.renderFgSegEls(segs); // assigns each seg's el and returns a subset of segs that were rendered
			rowStructs = this.renderSegRows(segs);

			// inject each new event skeleton into each associated row
			this.rowEls.each(function(row, rowNode) {
				var rowEl = $(rowNode); // the .fc-row
				var skeletonEl = $('<div class="fc-helper-skeleton"><table/></div>'); // will be absolutely positioned
				var skeletonTop;

				// If there is an original segment, match the top position. Otherwise, put it at the row's top level
				if (sourceSeg && sourceSeg.row === row) {
					skeletonTop = sourceSeg.el.position().top;
				}
				else {
					skeletonTop = rowEl.find('.fc-content-skeleton tbody').position().top;
				}

				skeletonEl.css('top', skeletonTop)
					.find('table')
						.append(rowStructs[row].tbodyEl);

				rowEl.append(skeletonEl);
				helperNodes.push(skeletonEl[0]);
			});

			this.helperEls = $(helperNodes); // array -> jQuery set
		},


		// Unrenders any visual indication of a mock helper event
		unrenderHelper: function() {
			if (this.helperEls) {
				this.helperEls.remove();
				this.helperEls = null;
			}
		},


		/* Fill System (highlight, background events, business hours)
		------------------------------------------------------------------------------------------------------------------*/


		fillSegTag: 'td', // override the default tag name


		// Renders a set of rectangles over the given segments of days.
		// Only returns segments that successfully rendered.
		renderFill: function(type, segs, className) {
			var nodes = [];
			var i, seg;
			var skeletonEl;

			segs = this.renderFillSegEls(type, segs); // assignes `.el` to each seg. returns successfully rendered segs

			for (i = 0; i < segs.length; i++) {
				seg = segs[i];
				skeletonEl = this.renderFillRow(type, seg, className);
				this.rowEls.eq(seg.row).append(skeletonEl);
				nodes.push(skeletonEl[0]);
			}

			this.elsByFill[type] = $(nodes);

			return segs;
		},


		// Generates the HTML needed for one row of a fill. Requires the seg's el to be rendered.
		renderFillRow: function(type, seg, className) {
			var colCnt = this.colCnt;
			var startCol = seg.leftCol;
			var endCol = seg.rightCol + 1;
			var skeletonEl;
			var trEl;

			className = className || type.toLowerCase();

			skeletonEl = $(
				'<div class="fc-' + className + '-skeleton">' +
					'<table><tr/></table>' +
				'</div>'
			);
			trEl = skeletonEl.find('tr');

			if (startCol > 0) {
				trEl.append('<td colspan="' + startCol + '"/>');
			}

			trEl.append(
				seg.el.attr('colspan', endCol - startCol)
			);

			if (endCol < colCnt) {
				trEl.append('<td colspan="' + (colCnt - endCol) + '"/>');
			}

			this.bookendCells(trEl);

			return skeletonEl;
		}

	});

	;;

	/* Event-rendering methods for the DayGrid class
	----------------------------------------------------------------------------------------------------------------------*/

	DayGrid.mixin({

		rowStructs: null, // an array of objects, each holding information about a row's foreground event-rendering


		// Unrenders all events currently rendered on the grid
		unrenderEvents: function() {
			this.removeSegPopover(); // removes the "more.." events popover
			Grid.prototype.unrenderEvents.apply(this, arguments); // calls the super-method
		},


		// Retrieves all rendered segment objects currently rendered on the grid
		getEventSegs: function() {
			return Grid.prototype.getEventSegs.call(this) // get the segments from the super-method
				.concat(this.popoverSegs || []); // append the segments from the "more..." popover
		},


		// Renders the given background event segments onto the grid
		renderBgSegs: function(segs) {

			// don't render timed background events
			var allDaySegs = $.grep(segs, function(seg) {
				return seg.event.allDay;
			});

			return Grid.prototype.renderBgSegs.call(this, allDaySegs); // call the super-method
		},


		// Renders the given foreground event segments onto the grid
		renderFgSegs: function(segs) {
			var rowStructs;

			// render an `.el` on each seg
			// returns a subset of the segs. segs that were actually rendered
			segs = this.renderFgSegEls(segs);

			rowStructs = this.rowStructs = this.renderSegRows(segs);

			// append to each row's content skeleton
			this.rowEls.each(function(i, rowNode) {
				$(rowNode).find('.fc-content-skeleton > table').append(
					rowStructs[i].tbodyEl
				);
			});

			return segs; // return only the segs that were actually rendered
		},


		// Unrenders all currently rendered foreground event segments
		unrenderFgSegs: function() {
			var rowStructs = this.rowStructs || [];
			var rowStruct;

			while ((rowStruct = rowStructs.pop())) {
				rowStruct.tbodyEl.remove();
			}

			this.rowStructs = null;
		},


		// Uses the given events array to generate <tbody> elements that should be appended to each row's content skeleton.
		// Returns an array of rowStruct objects (see the bottom of `renderSegRow`).
		// PRECONDITION: each segment shoud already have a rendered and assigned `.el`
		renderSegRows: function(segs) {
			var rowStructs = [];
			var segRows;
			var row;

			segRows = this.groupSegRows(segs); // group into nested arrays

			// iterate each row of segment groupings
			for (row = 0; row < segRows.length; row++) {
				rowStructs.push(
					this.renderSegRow(row, segRows[row])
				);
			}

			return rowStructs;
		},


		// Builds the HTML to be used for the default element for an individual segment
		fgSegHtml: function(seg, disableResizing) {
			var view = this.view;
			var event = seg.event;
			var isDraggable = view.isEventDraggable(event);
			var isResizableFromStart = !disableResizing && event.allDay &&
				seg.isStart && view.isEventResizableFromStart(event);
			var isResizableFromEnd = !disableResizing && event.allDay &&
				seg.isEnd && view.isEventResizableFromEnd(event);
			var classes = this.getSegClasses(seg, isDraggable, isResizableFromStart || isResizableFromEnd);
			var skinCss = cssToStr(this.getEventSkinCss(event));
			var timeHtml = '';
			var timeText;
			var titleHtml;

			classes.unshift('fc-day-grid-event', 'fc-h-event');

			// Only display a timed events time if it is the starting segment
			if (seg.isStart) {
				timeText = this.getEventTimeText(event);
				if (timeText) {
					timeHtml = '<span class="fc-time">' + htmlEscape(timeText) + '</span>';
				}
			}

			titleHtml =
				'<span class="fc-title">' +
					(htmlEscape(event.title || '') || '&nbsp;') + // we always want one line of height
				'</span>';
			
			return '<a class="' + classes.join(' ') + '"' +
					(event.url ?
						' href="' + htmlEscape(event.url) + '"' :
						''
						) +
					(skinCss ?
						' style="' + skinCss + '"' :
						''
						) +
				'>' +
					'<div class="fc-content">' +
						(this.isRTL ?
							titleHtml + ' ' + timeHtml : // put a natural space in between
							timeHtml + ' ' + titleHtml   //
							) +
					'</div>' +
					(isResizableFromStart ?
						'<div class="fc-resizer fc-start-resizer" />' :
						''
						) +
					(isResizableFromEnd ?
						'<div class="fc-resizer fc-end-resizer" />' :
						''
						) +
				'</a>';
		},


		// Given a row # and an array of segments all in the same row, render a <tbody> element, a skeleton that contains
		// the segments. Returns object with a bunch of internal data about how the render was calculated.
		// NOTE: modifies rowSegs
		renderSegRow: function(row, rowSegs) {
			var colCnt = this.colCnt;
			var segLevels = this.buildSegLevels(rowSegs); // group into sub-arrays of levels
			var levelCnt = Math.max(1, segLevels.length); // ensure at least one level
			var tbody = $('<tbody/>');
			var segMatrix = []; // lookup for which segments are rendered into which level+col cells
			var cellMatrix = []; // lookup for all <td> elements of the level+col matrix
			var loneCellMatrix = []; // lookup for <td> elements that only take up a single column
			var i, levelSegs;
			var col;
			var tr;
			var j, seg;
			var td;

			// populates empty cells from the current column (`col`) to `endCol`
			function emptyCellsUntil(endCol) {
				while (col < endCol) {
					// try to grab a cell from the level above and extend its rowspan. otherwise, create a fresh cell
					td = (loneCellMatrix[i - 1] || [])[col];
					if (td) {
						td.attr(
							'rowspan',
							parseInt(td.attr('rowspan') || 1, 10) + 1
						);
					}
					else {
						td = $('<td/>');
						tr.append(td);
					}
					cellMatrix[i][col] = td;
					loneCellMatrix[i][col] = td;
					col++;
				}
			}

			for (i = 0; i < levelCnt; i++) { // iterate through all levels
				levelSegs = segLevels[i];
				col = 0;
				tr = $('<tr/>');

				segMatrix.push([]);
				cellMatrix.push([]);
				loneCellMatrix.push([]);

				// levelCnt might be 1 even though there are no actual levels. protect against this.
				// this single empty row is useful for styling.
				if (levelSegs) {
					for (j = 0; j < levelSegs.length; j++) { // iterate through segments in level
						seg = levelSegs[j];

						emptyCellsUntil(seg.leftCol);

						// create a container that occupies or more columns. append the event element.
						td = $('<td class="fc-event-container"/>').append(seg.el);
						if (seg.leftCol != seg.rightCol) {
							td.attr('colspan', seg.rightCol - seg.leftCol + 1);
						}
						else { // a single-column segment
							loneCellMatrix[i][col] = td;
						}

						while (col <= seg.rightCol) {
							cellMatrix[i][col] = td;
							segMatrix[i][col] = seg;
							col++;
						}

						tr.append(td);
					}
				}

				emptyCellsUntil(colCnt); // finish off the row
				this.bookendCells(tr);
				tbody.append(tr);
			}

			return { // a "rowStruct"
				row: row, // the row number
				tbodyEl: tbody,
				cellMatrix: cellMatrix,
				segMatrix: segMatrix,
				segLevels: segLevels,
				segs: rowSegs
			};
		},


		// Stacks a flat array of segments, which are all assumed to be in the same row, into subarrays of vertical levels.
		// NOTE: modifies segs
		buildSegLevels: function(segs) {
			var levels = [];
			var i, seg;
			var j;

			// Give preference to elements with certain criteria, so they have
			// a chance to be closer to the top.
			this.sortEventSegs(segs);
			
			for (i = 0; i < segs.length; i++) {
				seg = segs[i];

				// loop through levels, starting with the topmost, until the segment doesn't collide with other segments
				for (j = 0; j < levels.length; j++) {
					if (!isDaySegCollision(seg, levels[j])) {
						break;
					}
				}
				// `j` now holds the desired subrow index
				seg.level = j;

				// create new level array if needed and append segment
				(levels[j] || (levels[j] = [])).push(seg);
			}

			// order segments left-to-right. very important if calendar is RTL
			for (j = 0; j < levels.length; j++) {
				levels[j].sort(compareDaySegCols);
			}

			return levels;
		},


		// Given a flat array of segments, return an array of sub-arrays, grouped by each segment's row
		groupSegRows: function(segs) {
			var segRows = [];
			var i;

			for (i = 0; i < this.rowCnt; i++) {
				segRows.push([]);
			}

			for (i = 0; i < segs.length; i++) {
				segRows[segs[i].row].push(segs[i]);
			}

			return segRows;
		}

	});


	// Computes whether two segments' columns collide. They are assumed to be in the same row.
	function isDaySegCollision(seg, otherSegs) {
		var i, otherSeg;

		for (i = 0; i < otherSegs.length; i++) {
			otherSeg = otherSegs[i];

			if (
				otherSeg.leftCol <= seg.rightCol &&
				otherSeg.rightCol >= seg.leftCol
			) {
				return true;
			}
		}

		return false;
	}


	// A cmp function for determining the leftmost event
	function compareDaySegCols(a, b) {
		return a.leftCol - b.leftCol;
	}

	;;

	/* Methods relate to limiting the number events for a given day on a DayGrid
	----------------------------------------------------------------------------------------------------------------------*/
	// NOTE: all the segs being passed around in here are foreground segs

	DayGrid.mixin({

		segPopover: null, // the Popover that holds events that can't fit in a cell. null when not visible
		popoverSegs: null, // an array of segment objects that the segPopover holds. null when not visible


		removeSegPopover: function() {
			if (this.segPopover) {
				this.segPopover.hide(); // in handler, will call segPopover's removeElement
			}
		},


		// Limits the number of "levels" (vertically stacking layers of events) for each row of the grid.
		// `levelLimit` can be false (don't limit), a number, or true (should be computed).
		limitRows: function(levelLimit) {
			var rowStructs = this.rowStructs || [];
			var row; // row #
			var rowLevelLimit;

			for (row = 0; row < rowStructs.length; row++) {
				this.unlimitRow(row);

				if (!levelLimit) {
					rowLevelLimit = false;
				}
				else if (typeof levelLimit === 'number') {
					rowLevelLimit = levelLimit;
				}
				else {
					rowLevelLimit = this.computeRowLevelLimit(row);
				}

				if (rowLevelLimit !== false) {
					this.limitRow(row, rowLevelLimit);
				}
			}
		},


		// Computes the number of levels a row will accomodate without going outside its bounds.
		// Assumes the row is "rigid" (maintains a constant height regardless of what is inside).
		// `row` is the row number.
		computeRowLevelLimit: function(row) {
			var rowEl = this.rowEls.eq(row); // the containing "fake" row div
			var rowHeight = rowEl.height(); // TODO: cache somehow?
			var trEls = this.rowStructs[row].tbodyEl.children();
			var i, trEl;
			var trHeight;

			function iterInnerHeights(i, childNode) {
				trHeight = Math.max(trHeight, $(childNode).outerHeight());
			}

			// Reveal one level <tr> at a time and stop when we find one out of bounds
			for (i = 0; i < trEls.length; i++) {
				trEl = trEls.eq(i).removeClass('fc-limited'); // reset to original state (reveal)

				// with rowspans>1 and IE8, trEl.outerHeight() would return the height of the largest cell,
				// so instead, find the tallest inner content element.
				trHeight = 0;
				trEl.find('> td > :first-child').each(iterInnerHeights);

				if (trEl.position().top + trHeight > rowHeight) {
					return i;
				}
			}

			return false; // should not limit at all
		},


		// Limits the given grid row to the maximum number of levels and injects "more" links if necessary.
		// `row` is the row number.
		// `levelLimit` is a number for the maximum (inclusive) number of levels allowed.
		limitRow: function(row, levelLimit) {
			var _this = this;
			var rowStruct = this.rowStructs[row];
			var moreNodes = []; // array of "more" <a> links and <td> DOM nodes
			var col = 0; // col #, left-to-right (not chronologically)
			var levelSegs; // array of segment objects in the last allowable level, ordered left-to-right
			var cellMatrix; // a matrix (by level, then column) of all <td> jQuery elements in the row
			var limitedNodes; // array of temporarily hidden level <tr> and segment <td> DOM nodes
			var i, seg;
			var segsBelow; // array of segment objects below `seg` in the current `col`
			var totalSegsBelow; // total number of segments below `seg` in any of the columns `seg` occupies
			var colSegsBelow; // array of segment arrays, below seg, one for each column (offset from segs's first column)
			var td, rowspan;
			var segMoreNodes; // array of "more" <td> cells that will stand-in for the current seg's cell
			var j;
			var moreTd, moreWrap, moreLink;

			// Iterates through empty level cells and places "more" links inside if need be
			function emptyCellsUntil(endCol) { // goes from current `col` to `endCol`
				while (col < endCol) {
					segsBelow = _this.getCellSegs(row, col, levelLimit);
					if (segsBelow.length) {
						td = cellMatrix[levelLimit - 1][col];
						moreLink = _this.renderMoreLink(row, col, segsBelow);
						moreWrap = $('<div/>').append(moreLink);
						td.append(moreWrap);
						moreNodes.push(moreWrap[0]);
					}
					col++;
				}
			}

			if (levelLimit && levelLimit < rowStruct.segLevels.length) { // is it actually over the limit?
				levelSegs = rowStruct.segLevels[levelLimit - 1];
				cellMatrix = rowStruct.cellMatrix;

				limitedNodes = rowStruct.tbodyEl.children().slice(levelLimit) // get level <tr> elements past the limit
					.addClass('fc-limited').get(); // hide elements and get a simple DOM-nodes array

				// iterate though segments in the last allowable level
				for (i = 0; i < levelSegs.length; i++) {
					seg = levelSegs[i];
					emptyCellsUntil(seg.leftCol); // process empty cells before the segment

					// determine *all* segments below `seg` that occupy the same columns
					colSegsBelow = [];
					totalSegsBelow = 0;
					while (col <= seg.rightCol) {
						segsBelow = this.getCellSegs(row, col, levelLimit);
						colSegsBelow.push(segsBelow);
						totalSegsBelow += segsBelow.length;
						col++;
					}

					if (totalSegsBelow) { // do we need to replace this segment with one or many "more" links?
						td = cellMatrix[levelLimit - 1][seg.leftCol]; // the segment's parent cell
						rowspan = td.attr('rowspan') || 1;
						segMoreNodes = [];

						// make a replacement <td> for each column the segment occupies. will be one for each colspan
						for (j = 0; j < colSegsBelow.length; j++) {
							moreTd = $('<td class="fc-more-cell"/>').attr('rowspan', rowspan);
							segsBelow = colSegsBelow[j];
							moreLink = this.renderMoreLink(
								row,
								seg.leftCol + j,
								[ seg ].concat(segsBelow) // count seg as hidden too
							);
							moreWrap = $('<div/>').append(moreLink);
							moreTd.append(moreWrap);
							segMoreNodes.push(moreTd[0]);
							moreNodes.push(moreTd[0]);
						}

						td.addClass('fc-limited').after($(segMoreNodes)); // hide original <td> and inject replacements
						limitedNodes.push(td[0]);
					}
				}

				emptyCellsUntil(this.colCnt); // finish off the level
				rowStruct.moreEls = $(moreNodes); // for easy undoing later
				rowStruct.limitedEls = $(limitedNodes); // for easy undoing later
			}
		},


		// Reveals all levels and removes all "more"-related elements for a grid's row.
		// `row` is a row number.
		unlimitRow: function(row) {
			var rowStruct = this.rowStructs[row];

			if (rowStruct.moreEls) {
				rowStruct.moreEls.remove();
				rowStruct.moreEls = null;
			}

			if (rowStruct.limitedEls) {
				rowStruct.limitedEls.removeClass('fc-limited');
				rowStruct.limitedEls = null;
			}
		},


		// Renders an <a> element that represents hidden event element for a cell.
		// Responsible for attaching click handler as well.
		renderMoreLink: function(row, col, hiddenSegs) {
			var _this = this;
			var view = this.view;

			return $('<a class="fc-more"/>')
				.text(
					this.getMoreLinkText(hiddenSegs.length)
				)
				.on('click', function(ev) {
					var clickOption = view.opt('eventLimitClick');
					var date = _this.getCellDate(row, col);
					var moreEl = $(this);
					var dayEl = _this.getCellEl(row, col);
					var allSegs = _this.getCellSegs(row, col);

					// rescope the segments to be within the cell's date
					var reslicedAllSegs = _this.resliceDaySegs(allSegs, date);
					var reslicedHiddenSegs = _this.resliceDaySegs(hiddenSegs, date);

					if (typeof clickOption === 'function') {
						// the returned value can be an atomic option
						clickOption = view.trigger('eventLimitClick', null, {
							date: date,
							dayEl: dayEl,
							moreEl: moreEl,
							segs: reslicedAllSegs,
							hiddenSegs: reslicedHiddenSegs
						}, ev);
					}

					if (clickOption === 'popover') {
						_this.showSegPopover(row, col, moreEl, reslicedAllSegs);
					}
					else if (typeof clickOption === 'string') { // a view name
						view.calendar.zoomTo(date, clickOption);
					}
				});
		},


		// Reveals the popover that displays all events within a cell
		showSegPopover: function(row, col, moreLink, segs) {
			var _this = this;
			var view = this.view;
			var moreWrap = moreLink.parent(); // the <div> wrapper around the <a>
			var topEl; // the element we want to match the top coordinate of
			var options;

			if (this.rowCnt == 1) {
				topEl = view.el; // will cause the popover to cover any sort of header
			}
			else {
				topEl = this.rowEls.eq(row); // will align with top of row
			}

			options = {
				className: 'fc-more-popover',
				content: this.renderSegPopoverContent(row, col, segs),
				parentEl: this.el,
				top: topEl.offset().top,
				autoHide: true, // when the user clicks elsewhere, hide the popover
				viewportConstrain: view.opt('popoverViewportConstrain'),
				hide: function() {
					// kill everything when the popover is hidden
					_this.segPopover.removeElement();
					_this.segPopover = null;
					_this.popoverSegs = null;
				}
			};

			// Determine horizontal coordinate.
			// We use the moreWrap instead of the <td> to avoid border confusion.
			if (this.isRTL) {
				options.right = moreWrap.offset().left + moreWrap.outerWidth() + 1; // +1 to be over cell border
			}
			else {
				options.left = moreWrap.offset().left - 1; // -1 to be over cell border
			}

			this.segPopover = new Popover(options);
			this.segPopover.show();
		},


		// Builds the inner DOM contents of the segment popover
		renderSegPopoverContent: function(row, col, segs) {
			var view = this.view;
			var isTheme = view.opt('theme');
			var title = this.getCellDate(row, col).format(view.opt('dayPopoverFormat'));
			var content = $(
				'<div class="fc-header ' + view.widgetHeaderClass + '">' +
					'<span class="fc-close ' +
						(isTheme ? 'ui-icon ui-icon-closethick' : 'fc-icon fc-icon-x') +
					'"></span>' +
					'<span class="fc-title">' +
						htmlEscape(title) +
					'</span>' +
					'<div class="fc-clear"/>' +
				'</div>' +
				'<div class="fc-body ' + view.widgetContentClass + '">' +
					'<div class="fc-event-container"></div>' +
				'</div>'
			);
			var segContainer = content.find('.fc-event-container');
			var i;

			// render each seg's `el` and only return the visible segs
			segs = this.renderFgSegEls(segs, true); // disableResizing=true
			this.popoverSegs = segs;

			for (i = 0; i < segs.length; i++) {

				// because segments in the popover are not part of a grid coordinate system, provide a hint to any
				// grids that want to do drag-n-drop about which cell it came from
				this.prepareHits();
				segs[i].hit = this.getCellHit(row, col);
				this.releaseHits();

				segContainer.append(segs[i].el);
			}

			return content;
		},


		// Given the events within an array of segment objects, reslice them to be in a single day
		resliceDaySegs: function(segs, dayDate) {

			// build an array of the original events
			var events = $.map(segs, function(seg) {
				return seg.event;
			});

			var dayStart = dayDate.clone();
			var dayEnd = dayStart.clone().add(1, 'days');
			var dayRange = { start: dayStart, end: dayEnd };

			// slice the events with a custom slicing function
			segs = this.eventsToSegs(
				events,
				function(range) {
					var seg = intersectRanges(range, dayRange); // undefind if no intersection
					return seg ? [ seg ] : []; // must return an array of segments
				}
			);

			// force an order because eventsToSegs doesn't guarantee one
			this.sortEventSegs(segs);

			return segs;
		},


		// Generates the text that should be inside a "more" link, given the number of events it represents
		getMoreLinkText: function(num) {
			var opt = this.view.opt('eventLimitText');

			if (typeof opt === 'function') {
				return opt(num);
			}
			else {
				return '+' + num + ' ' + opt;
			}
		},


		// Returns segments within a given cell.
		// If `startLevel` is specified, returns only events including and below that level. Otherwise returns all segs.
		getCellSegs: function(row, col, startLevel) {
			var segMatrix = this.rowStructs[row].segMatrix;
			var level = startLevel || 0;
			var segs = [];
			var seg;

			while (level < segMatrix.length) {
				seg = segMatrix[level][col];
				if (seg) {
					segs.push(seg);
				}
				level++;
			}

			return segs;
		}

	});

	;;

	/* A component that renders one or more columns of vertical time slots
	----------------------------------------------------------------------------------------------------------------------*/
	// We mixin DayTable, even though there is only a single row of days

	var TimeGrid = FC.TimeGrid = Grid.extend(DayTableMixin, {

		slotDuration: null, // duration of a "slot", a distinct time segment on given day, visualized by lines
		snapDuration: null, // granularity of time for dragging and selecting
		snapsPerSlot: null,
		minTime: null, // Duration object that denotes the first visible time of any given day
		maxTime: null, // Duration object that denotes the exclusive visible end time of any given day
		labelFormat: null, // formatting string for times running along vertical axis
		labelInterval: null, // duration of how often a label should be displayed for a slot

		colEls: null, // cells elements in the day-row background
		slatEls: null, // elements running horizontally across all columns
		helperEl: null, // cell skeleton element for rendering the mock event "helper"

		colCoordCache: null,
		slatCoordCache: null,

		businessHourSegs: null,


		constructor: function() {
			Grid.apply(this, arguments); // call the super-constructor

			this.processOptions();
		},


		// Renders the time grid into `this.el`, which should already be assigned.
		// Relies on the view's colCnt. In the future, this component should probably be self-sufficient.
		renderDates: function() {
			this.el.html(this.renderHtml());
			this.colEls = this.el.find('.fc-day');
			this.slatEls = this.el.find('.fc-slats tr');

			this.colCoordCache = new CoordCache({
				els: this.colEls,
				isHorizontal: true
			});
			this.slatCoordCache = new CoordCache({
				els: this.slatEls,
				isVertical: true
			});
		},


		renderBusinessHours: function() {
			var events = this.view.calendar.getBusinessHoursEvents();
			this.businessHourSegs = this.renderFill('businessHours', this.eventsToSegs(events), 'bgevent');
		},


		// Renders the basic HTML skeleton for the grid
		renderHtml: function() {
			return '' +
				'<div class="fc-bg">' +
					'<table>' +
						this.renderBgTrHtml(0) + // row=0
					'</table>' +
				'</div>' +
				'<div class="fc-slats">' +
					'<table>' +
						this.renderSlatRowHtml() +
					'</table>' +
				'</div>';
		},


		// Generates the HTML for the horizontal "slats" that run width-wise. Has a time axis on a side. Depends on RTL.
		renderSlatRowHtml: function() {
			var view = this.view;
			var isRTL = this.isRTL;
			var html = '';
			var slotTime = moment.duration(+this.minTime); // wish there was .clone() for durations
			var slotDate; // will be on the view's first day, but we only care about its time
			var isLabeled;
			var axisHtml;

			// Calculate the time for each slot
			while (slotTime < this.maxTime) {
				slotDate = this.start.clone().time(slotTime);
				isLabeled = isInt(divideDurationByDuration(slotTime, this.labelInterval));

				axisHtml =
					'<td class="fc-axis fc-time ' + view.widgetContentClass + '" ' + view.axisStyleAttr() + '>' +
						(isLabeled ?
							'<span>' + // for matchCellWidths
								htmlEscape(slotDate.format(this.labelFormat)) +
							'</span>' :
							''
							) +
					'</td>';

				html +=
					'<tr ' + (isLabeled ? '' : 'class="fc-minor"') + '>' +
						(!isRTL ? axisHtml : '') +
						'<td class="' + view.widgetContentClass + '"/>' +
						(isRTL ? axisHtml : '') +
					"</tr>";

				slotTime.add(this.slotDuration);
			}

			return html;
		},


		/* Options
		------------------------------------------------------------------------------------------------------------------*/


		// Parses various options into properties of this object
		processOptions: function() {
			var view = this.view;
			var slotDuration = view.opt('slotDuration');
			var snapDuration = view.opt('snapDuration');
			var input;

			slotDuration = moment.duration(slotDuration);
			snapDuration = snapDuration ? moment.duration(snapDuration) : slotDuration;

			this.slotDuration = slotDuration;
			this.snapDuration = snapDuration;
			this.snapsPerSlot = slotDuration / snapDuration; // TODO: ensure an integer multiple?

			this.minResizeDuration = snapDuration; // hack

			this.minTime = moment.duration(view.opt('minTime'));
			this.maxTime = moment.duration(view.opt('maxTime'));

			// might be an array value (for TimelineView).
			// if so, getting the most granular entry (the last one probably).
			input = view.opt('slotLabelFormat');
			if ($.isArray(input)) {
				input = input[input.length - 1];
			}

			this.labelFormat =
				input ||
				view.opt('axisFormat') || // deprecated
				view.opt('smallTimeFormat'); // the computed default

			input = view.opt('slotLabelInterval');
			this.labelInterval = input ?
				moment.duration(input) :
				this.computeLabelInterval(slotDuration);
		},


		// Computes an automatic value for slotLabelInterval
		computeLabelInterval: function(slotDuration) {
			var i;
			var labelInterval;
			var slotsPerLabel;

			// find the smallest stock label interval that results in more than one slots-per-label
			for (i = AGENDA_STOCK_SUB_DURATIONS.length - 1; i >= 0; i--) {
				labelInterval = moment.duration(AGENDA_STOCK_SUB_DURATIONS[i]);
				slotsPerLabel = divideDurationByDuration(labelInterval, slotDuration);
				if (isInt(slotsPerLabel) && slotsPerLabel > 1) {
					return labelInterval;
				}
			}

			return moment.duration(slotDuration); // fall back. clone
		},


		// Computes a default event time formatting string if `timeFormat` is not explicitly defined
		computeEventTimeFormat: function() {
			return this.view.opt('noMeridiemTimeFormat'); // like "6:30" (no AM/PM)
		},


		// Computes a default `displayEventEnd` value if one is not expliclty defined
		computeDisplayEventEnd: function() {
			return true;
		},


		/* Hit System
		------------------------------------------------------------------------------------------------------------------*/


		prepareHits: function() {
			this.colCoordCache.build();
			this.slatCoordCache.build();
		},


		releaseHits: function() {
			this.colCoordCache.clear();
			// NOTE: don't clear slatCoordCache because we rely on it for computeTimeTop
		},


		queryHit: function(leftOffset, topOffset) {
			var snapsPerSlot = this.snapsPerSlot;
			var colCoordCache = this.colCoordCache;
			var slatCoordCache = this.slatCoordCache;
			var colIndex = colCoordCache.getHorizontalIndex(leftOffset);
			var slatIndex = slatCoordCache.getVerticalIndex(topOffset);

			if (colIndex != null && slatIndex != null) {
				var slatTop = slatCoordCache.getTopOffset(slatIndex);
				var slatHeight = slatCoordCache.getHeight(slatIndex);
				var partial = (topOffset - slatTop) / slatHeight; // floating point number between 0 and 1
				var localSnapIndex = Math.floor(partial * snapsPerSlot); // the snap # relative to start of slat
				var snapIndex = slatIndex * snapsPerSlot + localSnapIndex;
				var snapTop = slatTop + (localSnapIndex / snapsPerSlot) * slatHeight;
				var snapBottom = slatTop + ((localSnapIndex + 1) / snapsPerSlot) * slatHeight;

				return {
					col: colIndex,
					snap: snapIndex,
					component: this, // needed unfortunately :(
					left: colCoordCache.getLeftOffset(colIndex),
					right: colCoordCache.getRightOffset(colIndex),
					top: snapTop,
					bottom: snapBottom
				};
			}
		},


		getHitSpan: function(hit) {
			var start = this.getCellDate(0, hit.col); // row=0
			var time = this.computeSnapTime(hit.snap); // pass in the snap-index
			var end;

			start.time(time);
			end = start.clone().add(this.snapDuration);

			return { start: start, end: end };
		},


		getHitEl: function(hit) {
			return this.colEls.eq(hit.col);
		},


		/* Dates
		------------------------------------------------------------------------------------------------------------------*/


		rangeUpdated: function() {
			this.updateDayTable();
		},


		// Given a row number of the grid, representing a "snap", returns a time (Duration) from its start-of-day
		computeSnapTime: function(snapIndex) {
			return moment.duration(this.minTime + this.snapDuration * snapIndex);
		},


		// Slices up the given span (unzoned start/end with other misc data) into an array of segments
		spanToSegs: function(span) {
			var segs = this.sliceRangeByTimes(span);
			var i;

			for (i = 0; i < segs.length; i++) {
				if (this.isRTL) {
					segs[i].col = this.daysPerRow - 1 - segs[i].dayIndex;
				}
				else {
					segs[i].col = segs[i].dayIndex;
				}
			}

			return segs;
		},


		sliceRangeByTimes: function(range) {
			var segs = [];
			var seg;
			var dayIndex;
			var dayDate;
			var dayRange;

			for (dayIndex = 0; dayIndex < this.daysPerRow; dayIndex++) {
				dayDate = this.dayDates[dayIndex].clone(); // TODO: better API for this?
				dayRange = {
					start: dayDate.clone().time(this.minTime),
					end: dayDate.clone().time(this.maxTime)
				};
				seg = intersectRanges(range, dayRange); // both will be ambig timezone
				if (seg) {
					seg.dayIndex = dayIndex;
					segs.push(seg);
				}
			}

			return segs;
		},


		/* Coordinates
		------------------------------------------------------------------------------------------------------------------*/


		updateSize: function(isResize) { // NOT a standard Grid method
			this.slatCoordCache.build();

			if (isResize) {
				this.updateSegVerticals();
			}
		},


		// Computes the top coordinate, relative to the bounds of the grid, of the given date.
		// A `startOfDayDate` must be given for avoiding ambiguity over how to treat midnight.
		computeDateTop: function(date, startOfDayDate) {
			return this.computeTimeTop(
				moment.duration(
					date - startOfDayDate.clone().stripTime()
				)
			);
		},


		// Computes the top coordinate, relative to the bounds of the grid, of the given time (a Duration).
		computeTimeTop: function(time) {
			var len = this.slatEls.length;
			var slatCoverage = (time - this.minTime) / this.slotDuration; // floating-point value of # of slots covered
			var slatIndex;
			var slatRemainder;

			// compute a floating-point number for how many slats should be progressed through.
			// from 0 to number of slats (inclusive)
			// constrained because minTime/maxTime might be customized.
			slatCoverage = Math.max(0, slatCoverage);
			slatCoverage = Math.min(len, slatCoverage);

			// an integer index of the furthest whole slat
			// from 0 to number slats (*exclusive*, so len-1)
			slatIndex = Math.floor(slatCoverage);
			slatIndex = Math.min(slatIndex, len - 1);

			// how much further through the slatIndex slat (from 0.0-1.0) must be covered in addition.
			// could be 1.0 if slatCoverage is covering *all* the slots
			slatRemainder = slatCoverage - slatIndex;

			return this.slatCoordCache.getTopPosition(slatIndex) +
				this.slatCoordCache.getHeight(slatIndex) * slatRemainder;
		},



		/* Event Drag Visualization
		------------------------------------------------------------------------------------------------------------------*/


		// Renders a visual indication of an event being dragged over the specified date(s).
		// A returned value of `true` signals that a mock "helper" event has been rendered.
		renderDrag: function(eventLocation, seg) {

			if (seg) { // if there is event information for this drag, render a helper event
				this.renderEventLocationHelper(eventLocation, seg);
				this.applyDragOpacity(this.helperEl);

				return true; // signal that a helper has been rendered
			}
			else {
				// otherwise, just render a highlight
				this.renderHighlight(this.eventToSpan(eventLocation));
			}
		},


		// Unrenders any visual indication of an event being dragged
		unrenderDrag: function() {
			this.unrenderHelper();
			this.unrenderHighlight();
		},


		/* Event Resize Visualization
		------------------------------------------------------------------------------------------------------------------*/


		// Renders a visual indication of an event being resized
		renderEventResize: function(eventLocation, seg) {
			this.renderEventLocationHelper(eventLocation, seg);
		},


		// Unrenders any visual indication of an event being resized
		unrenderEventResize: function() {
			this.unrenderHelper();
		},


		/* Event Helper
		------------------------------------------------------------------------------------------------------------------*/


		// Renders a mock "helper" event. `sourceSeg` is the original segment object and might be null (an external drag)
		renderHelper: function(event, sourceSeg) {
			var segs = this.eventToSegs(event);
			var tableEl;
			var i, seg;
			var sourceEl;

			segs = this.renderFgSegEls(segs); // assigns each seg's el and returns a subset of segs that were rendered
			tableEl = this.renderSegTable(segs);

			// Try to make the segment that is in the same row as sourceSeg look the same
			for (i = 0; i < segs.length; i++) {
				seg = segs[i];
				if (sourceSeg && sourceSeg.col === seg.col) {
					sourceEl = sourceSeg.el;
					seg.el.css({
						left: sourceEl.css('left'),
						right: sourceEl.css('right'),
						'margin-left': sourceEl.css('margin-left'),
						'margin-right': sourceEl.css('margin-right')
					});
				}
			}

			this.helperEl = $('<div class="fc-helper-skeleton"/>')
				.append(tableEl)
					.appendTo(this.el);
		},


		// Unrenders any mock helper event
		unrenderHelper: function() {
			if (this.helperEl) {
				this.helperEl.remove();
				this.helperEl = null;
			}
		},


		/* Selection
		------------------------------------------------------------------------------------------------------------------*/


		// Renders a visual indication of a selection. Overrides the default, which was to simply render a highlight.
		renderSelection: function(span) {
			if (this.view.opt('selectHelper')) { // this setting signals that a mock helper event should be rendered

				// normally acceps an eventLocation, span has a start/end, which is good enough
				this.renderEventLocationHelper(span);
			}
			else {
				this.renderHighlight(span);
			}
		},


		// Unrenders any visual indication of a selection
		unrenderSelection: function() {
			this.unrenderHelper();
			this.unrenderHighlight();
		},


		/* Fill System (highlight, background events, business hours)
		------------------------------------------------------------------------------------------------------------------*/


		// Renders a set of rectangles over the given time segments.
		// Only returns segments that successfully rendered.
		renderFill: function(type, segs, className) {
			var segCols;
			var skeletonEl;
			var trEl;
			var col, colSegs;
			var tdEl;
			var containerEl;
			var dayDate;
			var i, seg;

			if (segs.length) {

				segs = this.renderFillSegEls(type, segs); // assignes `.el` to each seg. returns successfully rendered segs
				segCols = this.groupSegCols(segs); // group into sub-arrays, and assigns 'col' to each seg

				className = className || type.toLowerCase();
				skeletonEl = $(
					'<div class="fc-' + className + '-skeleton">' +
						'<table><tr/></table>' +
					'</div>'
				);
				trEl = skeletonEl.find('tr');

				for (col = 0; col < segCols.length; col++) {
					colSegs = segCols[col];
					tdEl = $('<td/>').appendTo(trEl);

					if (colSegs.length) {
						containerEl = $('<div class="fc-' + className + '-container"/>').appendTo(tdEl);
						dayDate = this.getCellDate(0, col); // row=0

						for (i = 0; i < colSegs.length; i++) {
							seg = colSegs[i];
							containerEl.append(
								seg.el.css({
									top: this.computeDateTop(seg.start, dayDate),
									bottom: -this.computeDateTop(seg.end, dayDate) // the y position of the bottom edge
								})
							);
						}
					}
				}

				this.bookendCells(trEl);

				this.el.append(skeletonEl);
				this.elsByFill[type] = skeletonEl;
			}

			return segs;
		}

	});

	;;

	/* Event-rendering methods for the TimeGrid class
	----------------------------------------------------------------------------------------------------------------------*/

	TimeGrid.mixin({

		eventSkeletonEl: null, // has cells with event-containers, which contain absolutely positioned event elements


		// Renders the given foreground event segments onto the grid
		renderFgSegs: function(segs) {
			segs = this.renderFgSegEls(segs); // returns a subset of the segs. segs that were actually rendered

			this.el.append(
				this.eventSkeletonEl = $('<div class="fc-content-skeleton"/>')
					.append(this.renderSegTable(segs))
			);

			return segs; // return only the segs that were actually rendered
		},


		// Unrenders all currently rendered foreground event segments
		unrenderFgSegs: function(segs) {
			if (this.eventSkeletonEl) {
				this.eventSkeletonEl.remove();
				this.eventSkeletonEl = null;
			}
		},


		// Renders and returns the <table> portion of the event-skeleton.
		// Returns an object with properties 'tbodyEl' and 'segs'.
		renderSegTable: function(segs) {
			var tableEl = $('<table><tr/></table>');
			var trEl = tableEl.find('tr');
			var segCols;
			var i, seg;
			var col, colSegs;
			var containerEl;

			segCols = this.groupSegCols(segs); // group into sub-arrays, and assigns 'col' to each seg

			this.computeSegVerticals(segs); // compute and assign top/bottom

			for (col = 0; col < segCols.length; col++) { // iterate each column grouping
				colSegs = segCols[col];
				this.placeSlotSegs(colSegs); // compute horizontal coordinates, z-index's, and reorder the array

				containerEl = $('<div class="fc-event-container"/>');

				// assign positioning CSS and insert into container
				for (i = 0; i < colSegs.length; i++) {
					seg = colSegs[i];
					seg.el.css(this.generateSegPositionCss(seg));

					// if the height is short, add a className for alternate styling
					if (seg.bottom - seg.top < 30) {
						seg.el.addClass('fc-short');
					}

					containerEl.append(seg.el);
				}

				trEl.append($('<td/>').append(containerEl));
			}

			this.bookendCells(trEl);

			return tableEl;
		},


		// Given an array of segments that are all in the same column, sets the backwardCoord and forwardCoord on each.
		// NOTE: Also reorders the given array by date!
		placeSlotSegs: function(segs) {
			var levels;
			var level0;
			var i;

			this.sortEventSegs(segs); // order by certain criteria
			levels = buildSlotSegLevels(segs);
			computeForwardSlotSegs(levels);

			if ((level0 = levels[0])) {

				for (i = 0; i < level0.length; i++) {
					computeSlotSegPressures(level0[i]);
				}

				for (i = 0; i < level0.length; i++) {
					this.computeSlotSegCoords(level0[i], 0, 0);
				}
			}
		},


		// Calculate seg.forwardCoord and seg.backwardCoord for the segment, where both values range
		// from 0 to 1. If the calendar is left-to-right, the seg.backwardCoord maps to "left" and
		// seg.forwardCoord maps to "right" (via percentage). Vice-versa if the calendar is right-to-left.
		//
		// The segment might be part of a "series", which means consecutive segments with the same pressure
		// who's width is unknown until an edge has been hit. `seriesBackwardPressure` is the number of
		// segments behind this one in the current series, and `seriesBackwardCoord` is the starting
		// coordinate of the first segment in the series.
		computeSlotSegCoords: function(seg, seriesBackwardPressure, seriesBackwardCoord) {
			var forwardSegs = seg.forwardSegs;
			var i;

			if (seg.forwardCoord === undefined) { // not already computed

				if (!forwardSegs.length) {

					// if there are no forward segments, this segment should butt up against the edge
					seg.forwardCoord = 1;
				}
				else {

					// sort highest pressure first
					this.sortForwardSlotSegs(forwardSegs);

					// this segment's forwardCoord will be calculated from the backwardCoord of the
					// highest-pressure forward segment.
					this.computeSlotSegCoords(forwardSegs[0], seriesBackwardPressure + 1, seriesBackwardCoord);
					seg.forwardCoord = forwardSegs[0].backwardCoord;
				}

				// calculate the backwardCoord from the forwardCoord. consider the series
				seg.backwardCoord = seg.forwardCoord -
					(seg.forwardCoord - seriesBackwardCoord) / // available width for series
					(seriesBackwardPressure + 1); // # of segments in the series

				// use this segment's coordinates to computed the coordinates of the less-pressurized
				// forward segments
				for (i=0; i<forwardSegs.length; i++) {
					this.computeSlotSegCoords(forwardSegs[i], 0, seg.forwardCoord);
				}
			}
		},


		// Refreshes the CSS top/bottom coordinates for each segment element. Probably after a window resize/zoom.
		// Repositions business hours segs too, so not just for events. Maybe shouldn't be here.
		updateSegVerticals: function() {
			var allSegs = (this.segs || []).concat(this.businessHourSegs || []);
			var i;

			this.computeSegVerticals(allSegs);

			for (i = 0; i < allSegs.length; i++) {
				allSegs[i].el.css(
					this.generateSegVerticalCss(allSegs[i])
				);
			}
		},


		// For each segment in an array, computes and assigns its top and bottom properties
		computeSegVerticals: function(segs) {
			var i, seg;

			for (i = 0; i < segs.length; i++) {
				seg = segs[i];
				seg.top = this.computeDateTop(seg.start, seg.start);
				seg.bottom = this.computeDateTop(seg.end, seg.start);
			}
		},


		// Renders the HTML for a single event segment's default rendering
		fgSegHtml: function(seg, disableResizing) {
			var view = this.view;
			var event = seg.event;
			var isDraggable = view.isEventDraggable(event);
			var isResizableFromStart = !disableResizing && seg.isStart && view.isEventResizableFromStart(event);
			var isResizableFromEnd = !disableResizing && seg.isEnd && view.isEventResizableFromEnd(event);
			var classes = this.getSegClasses(seg, isDraggable, isResizableFromStart || isResizableFromEnd);
			var skinCss = cssToStr(this.getEventSkinCss(event));
			var timeText;
			var fullTimeText; // more verbose time text. for the print stylesheet
			var startTimeText; // just the start time text

			classes.unshift('fc-time-grid-event', 'fc-v-event');

			if (view.isMultiDayEvent(event)) { // if the event appears to span more than one day...
				// Don't display time text on segments that run entirely through a day.
				// That would appear as midnight-midnight and would look dumb.
				// Otherwise, display the time text for the *segment's* times (like 6pm-midnight or midnight-10am)
				if (seg.isStart || seg.isEnd) {
					timeText = this.getEventTimeText(seg);
					fullTimeText = this.getEventTimeText(seg, 'LT');
					startTimeText = this.getEventTimeText(seg, null, false); // displayEnd=false
				}
			} else {
				// Display the normal time text for the *event's* times
				timeText = this.getEventTimeText(event);
				fullTimeText = this.getEventTimeText(event, 'LT');
				startTimeText = this.getEventTimeText(event, null, false); // displayEnd=false
			}

			return '<a class="' + classes.join(' ') + '"' +
				(event.url ?
					' href="' + htmlEscape(event.url) + '"' :
					''
					) +
				(skinCss ?
					' style="' + skinCss + '"' :
					''
					) +
				'>' +
					'<div class="fc-content">' +
						(timeText ?
							'<div class="fc-time"' +
							' data-start="' + htmlEscape(startTimeText) + '"' +
							' data-full="' + htmlEscape(fullTimeText) + '"' +
							'>' +
								'<span>' + htmlEscape(timeText) + '</span>' +
							'</div>' :
							''
							) +
						(event.title ?
							'<div class="fc-title">' +
								htmlEscape(event.title) +
							'</div>' :
							''
							) +
					'</div>' +
					'<div class="fc-bg"/>' +
					/* TODO: write CSS for this
					(isResizableFromStart ?
						'<div class="fc-resizer fc-start-resizer" />' :
						''
						) +
					*/
					(isResizableFromEnd ?
						'<div class="fc-resizer fc-end-resizer" />' :
						''
						) +
				'</a>';
		},


		// Generates an object with CSS properties/values that should be applied to an event segment element.
		// Contains important positioning-related properties that should be applied to any event element, customized or not.
		generateSegPositionCss: function(seg) {
			var shouldOverlap = this.view.opt('slotEventOverlap');
			var backwardCoord = seg.backwardCoord; // the left side if LTR. the right side if RTL. floating-point
			var forwardCoord = seg.forwardCoord; // the right side if LTR. the left side if RTL. floating-point
			var props = this.generateSegVerticalCss(seg); // get top/bottom first
			var left; // amount of space from left edge, a fraction of the total width
			var right; // amount of space from right edge, a fraction of the total width

			if (shouldOverlap) {
				// double the width, but don't go beyond the maximum forward coordinate (1.0)
				forwardCoord = Math.min(1, backwardCoord + (forwardCoord - backwardCoord) * 2);
			}

			if (this.isRTL) {
				left = 1 - forwardCoord;
				right = backwardCoord;
			}
			else {
				left = backwardCoord;
				right = 1 - forwardCoord;
			}

			props.zIndex = seg.level + 1; // convert from 0-base to 1-based
			props.left = left * 100 + '%';
			props.right = right * 100 + '%';

			if (shouldOverlap && seg.forwardPressure) {
				// add padding to the edge so that forward stacked events don't cover the resizer's icon
				props[this.isRTL ? 'marginLeft' : 'marginRight'] = 10 * 2; // 10 is a guesstimate of the icon's width
			}

			return props;
		},


		// Generates an object with CSS properties for the top/bottom coordinates of a segment element
		generateSegVerticalCss: function(seg) {
			return {
				top: seg.top,
				bottom: -seg.bottom // flipped because needs to be space beyond bottom edge of event container
			};
		},


		// Given a flat array of segments, return an array of sub-arrays, grouped by each segment's col
		groupSegCols: function(segs) {
			var segCols = [];
			var i;

			for (i = 0; i < this.colCnt; i++) {
				segCols.push([]);
			}

			for (i = 0; i < segs.length; i++) {
				segCols[segs[i].col].push(segs[i]);
			}

			return segCols;
		},


		sortForwardSlotSegs: function(forwardSegs) {
			forwardSegs.sort(proxy(this, 'compareForwardSlotSegs'));
		},


		// A cmp function for determining which forward segment to rely on more when computing coordinates.
		compareForwardSlotSegs: function(seg1, seg2) {
			// put higher-pressure first
			return seg2.forwardPressure - seg1.forwardPressure ||
				// put segments that are closer to initial edge first (and favor ones with no coords yet)
				(seg1.backwardCoord || 0) - (seg2.backwardCoord || 0) ||
				// do normal sorting...
				this.compareEventSegs(seg1, seg2);
		}

	});


	// Builds an array of segments "levels". The first level will be the leftmost tier of segments if the calendar is
	// left-to-right, or the rightmost if the calendar is right-to-left. Assumes the segments are already ordered by date.
	function buildSlotSegLevels(segs) {
		var levels = [];
		var i, seg;
		var j;

		for (i=0; i<segs.length; i++) {
			seg = segs[i];

			// go through all the levels and stop on the first level where there are no collisions
			for (j=0; j<levels.length; j++) {
				if (!computeSlotSegCollisions(seg, levels[j]).length) {
					break;
				}
			}

			seg.level = j;

			(levels[j] || (levels[j] = [])).push(seg);
		}

		return levels;
	}


	// For every segment, figure out the other segments that are in subsequent
	// levels that also occupy the same vertical space. Accumulate in seg.forwardSegs
	function computeForwardSlotSegs(levels) {
		var i, level;
		var j, seg;
		var k;

		for (i=0; i<levels.length; i++) {
			level = levels[i];

			for (j=0; j<level.length; j++) {
				seg = level[j];

				seg.forwardSegs = [];
				for (k=i+1; k<levels.length; k++) {
					computeSlotSegCollisions(seg, levels[k], seg.forwardSegs);
				}
			}
		}
	}


	// Figure out which path forward (via seg.forwardSegs) results in the longest path until
	// the furthest edge is reached. The number of segments in this path will be seg.forwardPressure
	function computeSlotSegPressures(seg) {
		var forwardSegs = seg.forwardSegs;
		var forwardPressure = 0;
		var i, forwardSeg;

		if (seg.forwardPressure === undefined) { // not already computed

			for (i=0; i<forwardSegs.length; i++) {
				forwardSeg = forwardSegs[i];

				// figure out the child's maximum forward path
				computeSlotSegPressures(forwardSeg);

				// either use the existing maximum, or use the child's forward pressure
				// plus one (for the forwardSeg itself)
				forwardPressure = Math.max(
					forwardPressure,
					1 + forwardSeg.forwardPressure
				);
			}

			seg.forwardPressure = forwardPressure;
		}
	}


	// Find all the segments in `otherSegs` that vertically collide with `seg`.
	// Append into an optionally-supplied `results` array and return.
	function computeSlotSegCollisions(seg, otherSegs, results) {
		results = results || [];

		for (var i=0; i<otherSegs.length; i++) {
			if (isSlotSegCollision(seg, otherSegs[i])) {
				results.push(otherSegs[i]);
			}
		}

		return results;
	}


	// Do these segments occupy the same vertical space?
	function isSlotSegCollision(seg1, seg2) {
		return seg1.bottom > seg2.top && seg1.top < seg2.bottom;
	}

	;;

	/* An abstract class from which other views inherit from
	----------------------------------------------------------------------------------------------------------------------*/

	var View = FC.View = Class.extend({

		type: null, // subclass' view name (string)
		name: null, // deprecated. use `type` instead
		title: null, // the text that will be displayed in the header's title

		calendar: null, // owner Calendar object
		options: null, // hash containing all options. already merged with view-specific-options
		el: null, // the view's containing element. set by Calendar

		displaying: null, // a promise representing the state of rendering. null if no render requested
		isSkeletonRendered: false,
		isEventsRendered: false,

		// range the view is actually displaying (moments)
		start: null,
		end: null, // exclusive

		// range the view is formally responsible for (moments)
		// may be different from start/end. for example, a month view might have 1st-31st, excluding padded dates
		intervalStart: null,
		intervalEnd: null, // exclusive
		intervalDuration: null,
		intervalUnit: null, // name of largest unit being displayed, like "month" or "week"

		isRTL: false,
		isSelected: false, // boolean whether a range of time is user-selected or not

		eventOrderSpecs: null, // criteria for ordering events when they have same date/time

		// subclasses can optionally use a scroll container
		scrollerEl: null, // the element that will most likely scroll when content is too tall
		scrollTop: null, // cached vertical scroll value

		// classNames styled by jqui themes
		widgetHeaderClass: null,
		widgetContentClass: null,
		highlightStateClass: null,

		// for date utils, computed from options
		nextDayThreshold: null,
		isHiddenDayHash: null,

		// document handlers, bound to `this` object
		documentMousedownProxy: null, // TODO: doesn't work with touch


		constructor: function(calendar, type, options, intervalDuration) {

			this.calendar = calendar;
			this.type = this.name = type; // .name is deprecated
			this.options = options;
			this.intervalDuration = intervalDuration || moment.duration(1, 'day');

			this.nextDayThreshold = moment.duration(this.opt('nextDayThreshold'));
			this.initThemingProps();
			this.initHiddenDays();
			this.isRTL = this.opt('isRTL');

			this.eventOrderSpecs = parseFieldSpecs(this.opt('eventOrder'));

			this.documentMousedownProxy = proxy(this, 'documentMousedown');

			this.initialize();
		},


		// A good place for subclasses to initialize member variables
		initialize: function() {
			// subclasses can implement
		},


		// Retrieves an option with the given name
		opt: function(name) {
			return this.options[name];
		},


		// Triggers handlers that are view-related. Modifies args before passing to calendar.
		trigger: function(name, thisObj) { // arguments beyond thisObj are passed along
			var calendar = this.calendar;

			return calendar.trigger.apply(
				calendar,
				[name, thisObj || this].concat(
					Array.prototype.slice.call(arguments, 2), // arguments beyond thisObj
					[ this ] // always make the last argument a reference to the view. TODO: deprecate
				)
			);
		},


		/* Dates
		------------------------------------------------------------------------------------------------------------------*/


		// Updates all internal dates to center around the given current unzoned date.
		setDate: function(date) {
			this.setRange(this.computeRange(date));
		},


		// Updates all internal dates for displaying the given unzoned range.
		setRange: function(range) {
			$.extend(this, range); // assigns every property to this object's member variables
			this.updateTitle();
		},


		// Given a single current unzoned date, produce information about what range to display.
		// Subclasses can override. Must return all properties.
		computeRange: function(date) {
			var intervalUnit = computeIntervalUnit(this.intervalDuration);
			var intervalStart = date.clone().startOf(intervalUnit);
			var intervalEnd = intervalStart.clone().add(this.intervalDuration);
			var start, end;

			// normalize the range's time-ambiguity
			if (/year|month|week|day/.test(intervalUnit)) { // whole-days?
				intervalStart.stripTime();
				intervalEnd.stripTime();
			}
			else { // needs to have a time?
				if (!intervalStart.hasTime()) {
					intervalStart = this.calendar.time(0); // give 00:00 time
				}
				if (!intervalEnd.hasTime()) {
					intervalEnd = this.calendar.time(0); // give 00:00 time
				}
			}

			start = intervalStart.clone();
			start = this.skipHiddenDays(start);
			end = intervalEnd.clone();
			end = this.skipHiddenDays(end, -1, true); // exclusively move backwards

			return {
				intervalUnit: intervalUnit,
				intervalStart: intervalStart,
				intervalEnd: intervalEnd,
				start: start,
				end: end
			};
		},


		// Computes the new date when the user hits the prev button, given the current date
		computePrevDate: function(date) {
			return this.massageCurrentDate(
				date.clone().startOf(this.intervalUnit).subtract(this.intervalDuration), -1
			);
		},


		// Computes the new date when the user hits the next button, given the current date
		computeNextDate: function(date) {
			return this.massageCurrentDate(
				date.clone().startOf(this.intervalUnit).add(this.intervalDuration)
			);
		},


		// Given an arbitrarily calculated current date of the calendar, returns a date that is ensured to be completely
		// visible. `direction` is optional and indicates which direction the current date was being
		// incremented or decremented (1 or -1).
		massageCurrentDate: function(date, direction) {
			if (this.intervalDuration.as('days') <= 1) { // if the view displays a single day or smaller
				if (this.isHiddenDay(date)) {
					date = this.skipHiddenDays(date, direction);
					date.startOf('day');
				}
			}

			return date;
		},


		/* Title and Date Formatting
		------------------------------------------------------------------------------------------------------------------*/


		// Sets the view's title property to the most updated computed value
		updateTitle: function() {
			this.title = this.computeTitle();
		},


		// Computes what the title at the top of the calendar should be for this view
		computeTitle: function() {
			return this.formatRange(
				{
					// in case intervalStart/End has a time, make sure timezone is correct
					start: this.calendar.applyTimezone(this.intervalStart),
					end: this.calendar.applyTimezone(this.intervalEnd)
				},
				this.opt('titleFormat') || this.computeTitleFormat(),
				this.opt('titleRangeSeparator')
			);
		},


		// Generates the format string that should be used to generate the title for the current date range.
		// Attempts to compute the most appropriate format if not explicitly specified with `titleFormat`.
		computeTitleFormat: function() {
			if (this.intervalUnit == 'year') {
				return 'YYYY';
			}
			else if (this.intervalUnit == 'month') {
				return this.opt('monthYearFormat'); // like "September 2014"
			}
			else if (this.intervalDuration.as('days') > 1) {
				return 'll'; // multi-day range. shorter, like "Sep 9 - 10 2014"
			}
			else {
				return 'LL'; // one day. longer, like "September 9 2014"
			}
		},


		// Utility for formatting a range. Accepts a range object, formatting string, and optional separator.
		// Displays all-day ranges naturally, with an inclusive end. Takes the current isRTL into account.
		// The timezones of the dates within `range` will be respected.
		formatRange: function(range, formatStr, separator) {
			var end = range.end;

			if (!end.hasTime()) { // all-day?
				end = end.clone().subtract(1); // convert to inclusive. last ms of previous day
			}

			return formatRange(range.start, end, formatStr, separator, this.opt('isRTL'));
		},


		/* Rendering
		------------------------------------------------------------------------------------------------------------------*/


		// Sets the container element that the view should render inside of.
		// Does other DOM-related initializations.
		setElement: function(el) {
			this.el = el;
			this.bindGlobalHandlers();
		},


		// Removes the view's container element from the DOM, clearing any content beforehand.
		// Undoes any other DOM-related attachments.
		removeElement: function() {
			this.clear(); // clears all content

			// clean up the skeleton
			if (this.isSkeletonRendered) {
				this.unrenderSkeleton();
				this.isSkeletonRendered = false;
			}

			this.unbindGlobalHandlers();

			this.el.remove();

			// NOTE: don't null-out this.el in case the View was destroyed within an API callback.
			// We don't null-out the View's other jQuery element references upon destroy,
			//  so we shouldn't kill this.el either.
		},


		// Does everything necessary to display the view centered around the given unzoned date.
		// Does every type of rendering EXCEPT rendering events.
		// Is asychronous and returns a promise.
		display: function(date) {
			var _this = this;
			var scrollState = null;

			if (this.displaying) {
				scrollState = this.queryScroll();
			}

			this.calendar.freezeContentHeight();

			return this.clear().then(function() { // clear the content first (async)
				return (
					_this.displaying =
						$.when(_this.displayView(date)) // displayView might return a promise
							.then(function() {
								_this.forceScroll(_this.computeInitialScroll(scrollState));
								_this.calendar.unfreezeContentHeight();
								_this.triggerRender();
							})
				);
			});
		},


		// Does everything necessary to clear the content of the view.
		// Clears dates and events. Does not clear the skeleton.
		// Is asychronous and returns a promise.
		clear: function() {
			var _this = this;
			var displaying = this.displaying;

			if (displaying) { // previously displayed, or in the process of being displayed?
				return displaying.then(function() { // wait for the display to finish
					_this.displaying = null;
					_this.clearEvents();
					return _this.clearView(); // might return a promise. chain it
				});
			}
			else {
				return $.when(); // an immediately-resolved promise
			}
		},


		// If the view has already been displayed, tears it down and displays it again.
		// Will re-render the events if necessary, which display/clear DO NOT do.
		// TODO: make behavior more consistent.
		redisplay: function() {
			if (this.isSkeletonRendered) {
				var wasEventsRendered = this.isEventsRendered;
				this.clearEvents(); // won't trigger handlers if events never rendered
				this.clearView();
				this.displayView();
				if (wasEventsRendered) { // only render and trigger handlers if events previously rendered
					this.displayEvents();
				}
			}
		},


		// Displays the view's non-event content, such as date-related content or anything required by events.
		// Renders the view's non-content skeleton if necessary.
		// Can be asynchronous and return a promise.
		displayView: function(date) {
			if (!this.isSkeletonRendered) {
				this.renderSkeleton();
				this.isSkeletonRendered = true;
			}
			if (date) {
				this.setDate(date);
			}
			if (this.render) {
				this.render(); // TODO: deprecate
			}
			this.renderDates();
			this.updateSize();
			this.renderBusinessHours(); // might need coordinates, so should go after updateSize()
		},


		// Unrenders the view content that was rendered in displayView.
		// Can be asynchronous and return a promise.
		clearView: function() {
			this.unselect();
			this.triggerUnrender();
			this.unrenderBusinessHours();
			this.unrenderDates();
			if (this.destroy) {
				this.destroy(); // TODO: deprecate
			}
		},


		// Renders the basic structure of the view before any content is rendered
		renderSkeleton: function() {
			// subclasses should implement
		},


		// Unrenders the basic structure of the view
		unrenderSkeleton: function() {
			// subclasses should implement
		},


		// Renders the view's date-related content.
		// Assumes setRange has already been called and the skeleton has already been rendered.
		renderDates: function() {
			// subclasses should implement
		},


		// Unrenders the view's date-related content
		unrenderDates: function() {
			// subclasses should override
		},


		// Renders business-hours onto the view. Assumes updateSize has already been called.
		renderBusinessHours: function() {
			// subclasses should implement
		},


		// Unrenders previously-rendered business-hours
		unrenderBusinessHours: function() {
			// subclasses should implement
		},


		// Signals that the view's content has been rendered
		triggerRender: function() {
			this.trigger('viewRender', this, this, this.el);
		},


		// Signals that the view's content is about to be unrendered
		triggerUnrender: function() {
			this.trigger('viewDestroy', this, this, this.el);
		},


		// Binds DOM handlers to elements that reside outside the view container, such as the document
		bindGlobalHandlers: function() {
			$(document).on('mousedown', this.documentMousedownProxy);
		},


		// Unbinds DOM handlers from elements that reside outside the view container
		unbindGlobalHandlers: function() {
			$(document).off('mousedown', this.documentMousedownProxy);
		},


		// Initializes internal variables related to theming
		initThemingProps: function() {
			var tm = this.opt('theme') ? 'ui' : 'fc';

			this.widgetHeaderClass = tm + '-widget-header';
			this.widgetContentClass = tm + '-widget-content';
			this.highlightStateClass = tm + '-state-highlight';
		},


		/* Dimensions
		------------------------------------------------------------------------------------------------------------------*/


		// Refreshes anything dependant upon sizing of the container element of the grid
		updateSize: function(isResize) {
			var scrollState;

			if (isResize) {
				scrollState = this.queryScroll();
			}

			this.updateHeight(isResize);
			this.updateWidth(isResize);

			if (isResize) {
				this.setScroll(scrollState);
			}
		},


		// Refreshes the horizontal dimensions of the calendar
		updateWidth: function(isResize) {
			// subclasses should implement
		},


		// Refreshes the vertical dimensions of the calendar
		updateHeight: function(isResize) {
			var calendar = this.calendar; // we poll the calendar for height information

			this.setHeight(
				calendar.getSuggestedViewHeight(),
				calendar.isHeightAuto()
			);
		},


		// Updates the vertical dimensions of the calendar to the specified height.
		// if `isAuto` is set to true, height becomes merely a suggestion and the view should use its "natural" height.
		setHeight: function(height, isAuto) {
			// subclasses should implement
		},


		/* Scroller
		------------------------------------------------------------------------------------------------------------------*/


		// Given the total height of the view, return the number of pixels that should be used for the scroller.
		// Utility for subclasses.
		computeScrollerHeight: function(totalHeight) {
			var scrollerEl = this.scrollerEl;
			var both;
			var otherHeight; // cumulative height of everything that is not the scrollerEl in the view (header+borders)

			both = this.el.add(scrollerEl);

			// fuckin IE8/9/10/11 sometimes returns 0 for dimensions. this weird hack was the only thing that worked
			both.css({
				position: 'relative', // cause a reflow, which will force fresh dimension recalculation
				left: -1 // ensure reflow in case the el was already relative. negative is less likely to cause new scroll
			});
			otherHeight = this.el.outerHeight() - scrollerEl.height(); // grab the dimensions
			both.css({ position: '', left: '' }); // undo hack

			return totalHeight - otherHeight;
		},


		// Computes the initial pre-configured scroll state prior to allowing the user to change it.
		// Given the scroll state from the previous rendering. If first time rendering, given null.
		computeInitialScroll: function(previousScrollState) {
			return 0;
		},


		// Retrieves the view's current natural scroll state. Can return an arbitrary format.
		queryScroll: function() {
			if (this.scrollerEl) {
				return this.scrollerEl.scrollTop(); // operates on scrollerEl by default
			}
		},


		// Sets the view's scroll state. Will accept the same format computeInitialScroll and queryScroll produce.
		setScroll: function(scrollState) {
			if (this.scrollerEl) {
				return this.scrollerEl.scrollTop(scrollState); // operates on scrollerEl by default
			}
		},


		// Sets the scroll state, making sure to overcome any predefined scroll value the browser has in mind
		forceScroll: function(scrollState) {
			var _this = this;

			this.setScroll(scrollState);
			setTimeout(function() {
				_this.setScroll(scrollState);
			}, 0);
		},


		/* Event Elements / Segments
		------------------------------------------------------------------------------------------------------------------*/


		// Does everything necessary to display the given events onto the current view
		displayEvents: function(events) {
			var scrollState = this.queryScroll();

			this.clearEvents();
			this.renderEvents(events);
			this.isEventsRendered = true;
			this.setScroll(scrollState);
			this.triggerEventRender();
		},


		// Does everything necessary to clear the view's currently-rendered events
		clearEvents: function() {
			if (this.isEventsRendered) {
				this.triggerEventUnrender();
				if (this.destroyEvents) {
					this.destroyEvents(); // TODO: deprecate
				}
				this.unrenderEvents();
				this.isEventsRendered = false;
			}
		},


		// Renders the events onto the view.
		renderEvents: function(events) {
			// subclasses should implement
		},


		// Removes event elements from the view.
		unrenderEvents: function() {
			// subclasses should implement
		},


		// Signals that all events have been rendered
		triggerEventRender: function() {
			this.renderedEventSegEach(function(seg) {
				this.trigger('eventAfterRender', seg.event, seg.event, seg.el);
			});
			this.trigger('eventAfterAllRender');
		},


		// Signals that all event elements are about to be removed
		triggerEventUnrender: function() {
			this.renderedEventSegEach(function(seg) {
				this.trigger('eventDestroy', seg.event, seg.event, seg.el);
			});
		},


		// Given an event and the default element used for rendering, returns the element that should actually be used.
		// Basically runs events and elements through the eventRender hook.
		resolveEventEl: function(event, el) {
			var custom = this.trigger('eventRender', event, event, el);

			if (custom === false) { // means don't render at all
				el = null;
			}
			else if (custom && custom !== true) {
				el = $(custom);
			}

			return el;
		},


		// Hides all rendered event segments linked to the given event
		showEvent: function(event) {
			this.renderedEventSegEach(function(seg) {
				seg.el.css('visibility', '');
			}, event);
		},


		// Shows all rendered event segments linked to the given event
		hideEvent: function(event) {
			this.renderedEventSegEach(function(seg) {
				seg.el.css('visibility', 'hidden');
			}, event);
		},


		// Iterates through event segments that have been rendered (have an el). Goes through all by default.
		// If the optional `event` argument is specified, only iterates through segments linked to that event.
		// The `this` value of the callback function will be the view.
		renderedEventSegEach: function(func, event) {
			var segs = this.getEventSegs();
			var i;

			for (i = 0; i < segs.length; i++) {
				if (!event || segs[i].event._id === event._id) {
					if (segs[i].el) {
						func.call(this, segs[i]);
					}
				}
			}
		},


		// Retrieves all the rendered segment objects for the view
		getEventSegs: function() {
			// subclasses must implement
			return [];
		},


		/* Event Drag-n-Drop
		------------------------------------------------------------------------------------------------------------------*/


		// Computes if the given event is allowed to be dragged by the user
		isEventDraggable: function(event) {
			var source = event.source || {};

			return firstDefined(
				event.startEditable,
				source.startEditable,
				this.opt('eventStartEditable'),
				event.editable,
				source.editable,
				this.opt('editable')
			);
		},


		// Must be called when an event in the view is dropped onto new location.
		// `dropLocation` is an object that contains the new zoned start/end/allDay values for the event.
		reportEventDrop: function(event, dropLocation, largeUnit, el, ev) {
			var calendar = this.calendar;
			var mutateResult = calendar.mutateEvent(event, dropLocation, largeUnit);
			var undoFunc = function() {
				mutateResult.undo();
				calendar.reportEventChange();
			};

			this.triggerEventDrop(event, mutateResult.dateDelta, undoFunc, el, ev);
			calendar.reportEventChange(); // will rerender events
		},


		// Triggers event-drop handlers that have subscribed via the API
		triggerEventDrop: function(event, dateDelta, undoFunc, el, ev) {
			this.trigger('eventDrop', el[0], event, dateDelta, undoFunc, ev, {}); // {} = jqui dummy
		},


		/* External Element Drag-n-Drop
		------------------------------------------------------------------------------------------------------------------*/


		// Must be called when an external element, via jQuery UI, has been dropped onto the calendar.
		// `meta` is the parsed data that has been embedded into the dragging event.
		// `dropLocation` is an object that contains the new zoned start/end/allDay values for the event.
		reportExternalDrop: function(meta, dropLocation, el, ev, ui) {
			var eventProps = meta.eventProps;
			var eventInput;
			var event;

			// Try to build an event object and render it. TODO: decouple the two
			if (eventProps) {
				eventInput = $.extend({}, eventProps, dropLocation);
				event = this.calendar.renderEvent(eventInput, meta.stick)[0]; // renderEvent returns an array
			}

			this.triggerExternalDrop(event, dropLocation, el, ev, ui);
		},


		// Triggers external-drop handlers that have subscribed via the API
		triggerExternalDrop: function(event, dropLocation, el, ev, ui) {

			// trigger 'drop' regardless of whether element represents an event
			this.trigger('drop', el[0], dropLocation.start, ev, ui);

			if (event) {
				this.trigger('eventReceive', null, event); // signal an external event landed
			}
		},


		/* Drag-n-Drop Rendering (for both events and external elements)
		------------------------------------------------------------------------------------------------------------------*/


		// Renders a visual indication of a event or external-element drag over the given drop zone.
		// If an external-element, seg will be `null`
		renderDrag: function(dropLocation, seg) {
			// subclasses must implement
		},


		// Unrenders a visual indication of an event or external-element being dragged.
		unrenderDrag: function() {
			// subclasses must implement
		},


		/* Event Resizing
		------------------------------------------------------------------------------------------------------------------*/


		// Computes if the given event is allowed to be resized from its starting edge
		isEventResizableFromStart: function(event) {
			return this.opt('eventResizableFromStart') && this.isEventResizable(event);
		},


		// Computes if the given event is allowed to be resized from its ending edge
		isEventResizableFromEnd: function(event) {
			return this.isEventResizable(event);
		},


		// Computes if the given event is allowed to be resized by the user at all
		isEventResizable: function(event) {
			var source = event.source || {};

			return firstDefined(
				event.durationEditable,
				source.durationEditable,
				this.opt('eventDurationEditable'),
				event.editable,
				source.editable,
				this.opt('editable')
			);
		},


		// Must be called when an event in the view has been resized to a new length
		reportEventResize: function(event, resizeLocation, largeUnit, el, ev) {
			var calendar = this.calendar;
			var mutateResult = calendar.mutateEvent(event, resizeLocation, largeUnit);
			var undoFunc = function() {
				mutateResult.undo();
				calendar.reportEventChange();
			};

			this.triggerEventResize(event, mutateResult.durationDelta, undoFunc, el, ev);
			calendar.reportEventChange(); // will rerender events
		},


		// Triggers event-resize handlers that have subscribed via the API
		triggerEventResize: function(event, durationDelta, undoFunc, el, ev) {
			this.trigger('eventResize', el[0], event, durationDelta, undoFunc, ev, {}); // {} = jqui dummy
		},


		/* Selection
		------------------------------------------------------------------------------------------------------------------*/


		// Selects a date span on the view. `start` and `end` are both Moments.
		// `ev` is the native mouse event that begin the interaction.
		select: function(span, ev) {
			this.unselect(ev);
			this.renderSelection(span);
			this.reportSelection(span, ev);
		},


		// Renders a visual indication of the selection
		renderSelection: function(span) {
			// subclasses should implement
		},


		// Called when a new selection is made. Updates internal state and triggers handlers.
		reportSelection: function(span, ev) {
			this.isSelected = true;
			this.triggerSelect(span, ev);
		},


		// Triggers handlers to 'select'
		triggerSelect: function(span, ev) {
			this.trigger(
				'select',
				null,
				this.calendar.applyTimezone(span.start), // convert to calendar's tz for external API
				this.calendar.applyTimezone(span.end), // "
				ev
			);
		},


		// Undoes a selection. updates in the internal state and triggers handlers.
		// `ev` is the native mouse event that began the interaction.
		unselect: function(ev) {
			if (this.isSelected) {
				this.isSelected = false;
				if (this.destroySelection) {
					this.destroySelection(); // TODO: deprecate
				}
				this.unrenderSelection();
				this.trigger('unselect', null, ev);
			}
		},


		// Unrenders a visual indication of selection
		unrenderSelection: function() {
			// subclasses should implement
		},


		// Handler for unselecting when the user clicks something and the 'unselectAuto' setting is on
		documentMousedown: function(ev) {
			var ignore;

			// is there a selection, and has the user made a proper left click?
			if (this.isSelected && this.opt('unselectAuto') && isPrimaryMouseButton(ev)) {

				// only unselect if the clicked element is not identical to or inside of an 'unselectCancel' element
				ignore = this.opt('unselectCancel');
				if (!ignore || !$(ev.target).closest(ignore).length) {
					this.unselect(ev);
				}
			}
		},


		/* Day Click
		------------------------------------------------------------------------------------------------------------------*/


		// Triggers handlers to 'dayClick'
		// Span has start/end of the clicked area. Only the start is useful.
		triggerDayClick: function(span, dayEl, ev) {
			this.trigger(
				'dayClick',
				dayEl,
				this.calendar.applyTimezone(span.start), // convert to calendar's timezone for external API
				ev
			);
		},


		/* Date Utils
		------------------------------------------------------------------------------------------------------------------*/


		// Initializes internal variables related to calculating hidden days-of-week
		initHiddenDays: function() {
			var hiddenDays = this.opt('hiddenDays') || []; // array of day-of-week indices that are hidden
			var isHiddenDayHash = []; // is the day-of-week hidden? (hash with day-of-week-index -> bool)
			var dayCnt = 0;
			var i;

			if (this.opt('weekends') === false) {
				hiddenDays.push(0, 6); // 0=sunday, 6=saturday
			}

			for (i = 0; i < 7; i++) {
				if (
					!(isHiddenDayHash[i] = $.inArray(i, hiddenDays) !== -1)
				) {
					dayCnt++;
				}
			}

			if (!dayCnt) {
				throw 'invalid hiddenDays'; // all days were hidden? bad.
			}

			this.isHiddenDayHash = isHiddenDayHash;
		},


		// Is the current day hidden?
		// `day` is a day-of-week index (0-6), or a Moment
		isHiddenDay: function(day) {
			if (moment.isMoment(day)) {
				day = day.day();
			}
			return this.isHiddenDayHash[day];
		},


		// Incrementing the current day until it is no longer a hidden day, returning a copy.
		// If the initial value of `date` is not a hidden day, don't do anything.
		// Pass `isExclusive` as `true` if you are dealing with an end date.
		// `inc` defaults to `1` (increment one day forward each time)
		skipHiddenDays: function(date, inc, isExclusive) {
			var out = date.clone();
			inc = inc || 1;
			while (
				this.isHiddenDayHash[(out.day() + (isExclusive ? inc : 0) + 7) % 7]
			) {
				out.add(inc, 'days');
			}
			return out;
		},


		// Returns the date range of the full days the given range visually appears to occupy.
		// Returns a new range object.
		computeDayRange: function(range) {
			var startDay = range.start.clone().stripTime(); // the beginning of the day the range starts
			var end = range.end;
			var endDay = null;
			var endTimeMS;

			if (end) {
				endDay = end.clone().stripTime(); // the beginning of the day the range exclusively ends
				endTimeMS = +end.time(); // # of milliseconds into `endDay`

				// If the end time is actually inclusively part of the next day and is equal to or
				// beyond the next day threshold, adjust the end to be the exclusive end of `endDay`.
				// Otherwise, leaving it as inclusive will cause it to exclude `endDay`.
				if (endTimeMS && endTimeMS >= this.nextDayThreshold) {
					endDay.add(1, 'days');
				}
			}

			// If no end was specified, or if it is within `startDay` but not past nextDayThreshold,
			// assign the default duration of one day.
			if (!end || endDay <= startDay) {
				endDay = startDay.clone().add(1, 'days');
			}

			return { start: startDay, end: endDay };
		},


		// Does the given event visually appear to occupy more than one day?
		isMultiDayEvent: function(event) {
			var range = this.computeDayRange(event); // event is range-ish

			return range.end.diff(range.start, 'days') > 1;
		}

	});

	;;

	var Calendar = FC.Calendar = Class.extend({

		dirDefaults: null, // option defaults related to LTR or RTL
		langDefaults: null, // option defaults related to current locale
		overrides: null, // option overrides given to the fullCalendar constructor
		options: null, // all defaults combined with overrides
		viewSpecCache: null, // cache of view definitions
		view: null, // current View object
		header: null,
		loadingLevel: 0, // number of simultaneous loading tasks


		// a lot of this class' OOP logic is scoped within this constructor function,
		// but in the future, write individual methods on the prototype.
		constructor: Calendar_constructor,


		// Subclasses can override this for initialization logic after the constructor has been called
		initialize: function() {
		},


		// Initializes `this.options` and other important options-related objects
		initOptions: function(overrides) {
			var lang, langDefaults;
			var isRTL, dirDefaults;

			// converts legacy options into non-legacy ones.
			// in the future, when this is removed, don't use `overrides` reference. make a copy.
			overrides = massageOverrides(overrides);

			lang = overrides.lang;
			langDefaults = langOptionHash[lang];
			if (!langDefaults) {
				lang = Calendar.defaults.lang;
				langDefaults = langOptionHash[lang] || {};
			}

			isRTL = firstDefined(
				overrides.isRTL,
				langDefaults.isRTL,
				Calendar.defaults.isRTL
			);
			dirDefaults = isRTL ? Calendar.rtlDefaults : {};

			this.dirDefaults = dirDefaults;
			this.langDefaults = langDefaults;
			this.overrides = overrides;
			this.options = mergeOptions([ // merge defaults and overrides. lowest to highest precedence
				Calendar.defaults, // global defaults
				dirDefaults,
				langDefaults,
				overrides
			]);
			populateInstanceComputableOptions(this.options);

			this.viewSpecCache = {}; // somewhat unrelated
		},


		// Gets information about how to create a view. Will use a cache.
		getViewSpec: function(viewType) {
			var cache = this.viewSpecCache;

			return cache[viewType] || (cache[viewType] = this.buildViewSpec(viewType));
		},


		// Given a duration singular unit, like "week" or "day", finds a matching view spec.
		// Preference is given to views that have corresponding buttons.
		getUnitViewSpec: function(unit) {
			var viewTypes;
			var i;
			var spec;

			if ($.inArray(unit, intervalUnits) != -1) {

				// put views that have buttons first. there will be duplicates, but oh well
				viewTypes = this.header.getViewsWithButtons();
				$.each(FC.views, function(viewType) { // all views
					viewTypes.push(viewType);
				});

				for (i = 0; i < viewTypes.length; i++) {
					spec = this.getViewSpec(viewTypes[i]);
					if (spec) {
						if (spec.singleUnit == unit) {
							return spec;
						}
					}
				}
			}
		},


		// Builds an object with information on how to create a given view
		buildViewSpec: function(requestedViewType) {
			var viewOverrides = this.overrides.views || {};
			var specChain = []; // for the view. lowest to highest priority
			var defaultsChain = []; // for the view. lowest to highest priority
			var overridesChain = []; // for the view. lowest to highest priority
			var viewType = requestedViewType;
			var spec; // for the view
			var overrides; // for the view
			var duration;
			var unit;

			// iterate from the specific view definition to a more general one until we hit an actual View class
			while (viewType) {
				spec = fcViews[viewType];
				overrides = viewOverrides[viewType];
				viewType = null; // clear. might repopulate for another iteration

				if (typeof spec === 'function') { // TODO: deprecate
					spec = { 'class': spec };
				}

				if (spec) {
					specChain.unshift(spec);
					defaultsChain.unshift(spec.defaults || {});
					duration = duration || spec.duration;
					viewType = viewType || spec.type;
				}

				if (overrides) {
					overridesChain.unshift(overrides); // view-specific option hashes have options at zero-level
					duration = duration || overrides.duration;
					viewType = viewType || overrides.type;
				}
			}

			spec = mergeProps(specChain);
			spec.type = requestedViewType;
			if (!spec['class']) {
				return false;
			}

			if (duration) {
				duration = moment.duration(duration);
				if (duration.valueOf()) { // valid?
					spec.duration = duration;
					unit = computeIntervalUnit(duration);

					// view is a single-unit duration, like "week" or "day"
					// incorporate options for this. lowest priority
					if (duration.as(unit) === 1) {
						spec.singleUnit = unit;
						overridesChain.unshift(viewOverrides[unit] || {});
					}
				}
			}

			spec.defaults = mergeOptions(defaultsChain);
			spec.overrides = mergeOptions(overridesChain);

			this.buildViewSpecOptions(spec);
			this.buildViewSpecButtonText(spec, requestedViewType);

			return spec;
		},


		// Builds and assigns a view spec's options object from its already-assigned defaults and overrides
		buildViewSpecOptions: function(spec) {
			spec.options = mergeOptions([ // lowest to highest priority
				Calendar.defaults, // global defaults
				spec.defaults, // view's defaults (from ViewSubclass.defaults)
				this.dirDefaults,
				this.langDefaults, // locale and dir take precedence over view's defaults!
				this.overrides, // calendar's overrides (options given to constructor)
				spec.overrides // view's overrides (view-specific options)
			]);
			populateInstanceComputableOptions(spec.options);
		},


		// Computes and assigns a view spec's buttonText-related options
		buildViewSpecButtonText: function(spec, requestedViewType) {

			// given an options object with a possible `buttonText` hash, lookup the buttonText for the
			// requested view, falling back to a generic unit entry like "week" or "day"
			function queryButtonText(options) {
				var buttonText = options.buttonText || {};
				return buttonText[requestedViewType] ||
					(spec.singleUnit ? buttonText[spec.singleUnit] : null);
			}

			// highest to lowest priority
			spec.buttonTextOverride =
				queryButtonText(this.overrides) || // constructor-specified buttonText lookup hash takes precedence
				spec.overrides.buttonText; // `buttonText` for view-specific options is a string

			// highest to lowest priority. mirrors buildViewSpecOptions
			spec.buttonTextDefault =
				queryButtonText(this.langDefaults) ||
				queryButtonText(this.dirDefaults) ||
				spec.defaults.buttonText || // a single string. from ViewSubclass.defaults
				queryButtonText(Calendar.defaults) ||
				(spec.duration ? this.humanizeDuration(spec.duration) : null) || // like "3 days"
				requestedViewType; // fall back to given view name
		},


		// Given a view name for a custom view or a standard view, creates a ready-to-go View object
		instantiateView: function(viewType) {
			var spec = this.getViewSpec(viewType);

			return new spec['class'](this, viewType, spec.options, spec.duration);
		},


		// Returns a boolean about whether the view is okay to instantiate at some point
		isValidViewType: function(viewType) {
			return Boolean(this.getViewSpec(viewType));
		},


		// Should be called when any type of async data fetching begins
		pushLoading: function() {
			if (!(this.loadingLevel++)) {
				this.trigger('loading', null, true, this.view);
			}
		},


		// Should be called when any type of async data fetching completes
		popLoading: function() {
			if (!(--this.loadingLevel)) {
				this.trigger('loading', null, false, this.view);
			}
		},


		// Given arguments to the select method in the API, returns a span (unzoned start/end and other info)
		buildSelectSpan: function(zonedStartInput, zonedEndInput) {
			var start = this.moment(zonedStartInput).stripZone();
			var end;

			if (zonedEndInput) {
				end = this.moment(zonedEndInput).stripZone();
			}
			else if (start.hasTime()) {
				end = start.clone().add(this.defaultTimedEventDuration);
			}
			else {
				end = start.clone().add(this.defaultAllDayEventDuration);
			}

			return { start: start, end: end };
		}

	});


	Calendar.mixin(Emitter);


	function Calendar_constructor(element, overrides) {
		var t = this;


		t.initOptions(overrides || {});
		var options = this.options;

		
		// Exports
		// -----------------------------------------------------------------------------------

		t.render = render;
		t.destroy = destroy;
		t.refetchEvents = refetchEvents;
		t.reportEvents = reportEvents;
		t.reportEventChange = reportEventChange;
		t.rerenderEvents = renderEvents; // `renderEvents` serves as a rerender. an API method
		t.changeView = renderView; // `renderView` will switch to another view
		t.select = select;
		t.unselect = unselect;
		t.prev = prev;
		t.next = next;
		t.prevYear = prevYear;
		t.nextYear = nextYear;
		t.today = today;
		t.gotoDate = gotoDate;
		t.incrementDate = incrementDate;
		t.zoomTo = zoomTo;
		t.getDate = getDate;
		t.getCalendar = getCalendar;
		t.getView = getView;
		t.option = option;
		t.trigger = trigger;



		// Language-data Internals
		// -----------------------------------------------------------------------------------
		// Apply overrides to the current language's data


		var localeData = createObject( // make a cheap copy
			getMomentLocaleData(options.lang) // will fall back to en
		);

		if (options.monthNames) {
			localeData._months = options.monthNames;
		}
		if (options.monthNamesShort) {
			localeData._monthsShort = options.monthNamesShort;
		}
		if (options.dayNames) {
			localeData._weekdays = options.dayNames;
		}
		if (options.dayNamesShort) {
			localeData._weekdaysShort = options.dayNamesShort;
		}
		if (options.firstDay != null) {
			var _week = createObject(localeData._week); // _week: { dow: # }
			_week.dow = options.firstDay;
			localeData._week = _week;
		}

		// assign a normalized value, to be used by our .week() moment extension
		localeData._fullCalendar_weekCalc = (function(weekCalc) {
			if (typeof weekCalc === 'function') {
				return weekCalc;
			}
			else if (weekCalc === 'local') {
				return weekCalc;
			}
			else if (weekCalc === 'iso' || weekCalc === 'ISO') {
				return 'ISO';
			}
		})(options.weekNumberCalculation);



		// Calendar-specific Date Utilities
		// -----------------------------------------------------------------------------------


		t.defaultAllDayEventDuration = moment.duration(options.defaultAllDayEventDuration);
		t.defaultTimedEventDuration = moment.duration(options.defaultTimedEventDuration);


		// Builds a moment using the settings of the current calendar: timezone and language.
		// Accepts anything the vanilla moment() constructor accepts.
		t.moment = function() {
			var mom;

			if (options.timezone === 'local') {
				mom = FC.moment.apply(null, arguments);

				// Force the moment to be local, because FC.moment doesn't guarantee it.
				if (mom.hasTime()) { // don't give ambiguously-timed moments a local zone
					mom.local();
				}
			}
			else if (options.timezone === 'UTC') {
				mom = FC.moment.utc.apply(null, arguments); // process as UTC
			}
			else {
				mom = FC.moment.parseZone.apply(null, arguments); // let the input decide the zone
			}

			if ('_locale' in mom) { // moment 2.8 and above
				mom._locale = localeData;
			}
			else { // pre-moment-2.8
				mom._lang = localeData;
			}

			return mom;
		};


		// Returns a boolean about whether or not the calendar knows how to calculate
		// the timezone offset of arbitrary dates in the current timezone.
		t.getIsAmbigTimezone = function() {
			return options.timezone !== 'local' && options.timezone !== 'UTC';
		};


		// Returns a copy of the given date in the current timezone. Has no effect on dates without times.
		t.applyTimezone = function(date) {
			if (!date.hasTime()) {
				return date.clone();
			}

			var zonedDate = t.moment(date.toArray());
			var timeAdjust = date.time() - zonedDate.time();
			var adjustedZonedDate;

			// Safari sometimes has problems with this coersion when near DST. Adjust if necessary. (bug #2396)
			if (timeAdjust) { // is the time result different than expected?
				adjustedZonedDate = zonedDate.clone().add(timeAdjust); // add milliseconds
				if (date.time() - adjustedZonedDate.time() === 0) { // does it match perfectly now?
					zonedDate = adjustedZonedDate;
				}
			}

			return zonedDate;
		};


		// Returns a moment for the current date, as defined by the client's computer or from the `now` option.
		// Will return an moment with an ambiguous timezone.
		t.getNow = function() {
			var now = options.now;
			if (typeof now === 'function') {
				now = now();
			}
			return t.moment(now).stripZone();
		};


		// Get an event's normalized end date. If not present, calculate it from the defaults.
		t.getEventEnd = function(event) {
			if (event.end) {
				return event.end.clone();
			}
			else {
				return t.getDefaultEventEnd(event.allDay, event.start);
			}
		};


		// Given an event's allDay status and start date, return what its fallback end date should be.
		// TODO: rename to computeDefaultEventEnd
		t.getDefaultEventEnd = function(allDay, zonedStart) {
			var end = zonedStart.clone();

			if (allDay) {
				end.stripTime().add(t.defaultAllDayEventDuration);
			}
			else {
				end.add(t.defaultTimedEventDuration);
			}

			if (t.getIsAmbigTimezone()) {
				end.stripZone(); // we don't know what the tzo should be
			}

			return end;
		};


		// Produces a human-readable string for the given duration.
		// Side-effect: changes the locale of the given duration.
		t.humanizeDuration = function(duration) {
			return (duration.locale || duration.lang).call(duration, options.lang) // works moment-pre-2.8
				.humanize();
		};


		
		// Imports
		// -----------------------------------------------------------------------------------


		EventManager.call(t, options);
		var isFetchNeeded = t.isFetchNeeded;
		var fetchEvents = t.fetchEvents;



		// Locals
		// -----------------------------------------------------------------------------------


		var _element = element[0];
		var header;
		var headerElement;
		var content;
		var tm; // for making theme classes
		var currentView; // NOTE: keep this in sync with this.view
		var viewsByType = {}; // holds all instantiated view instances, current or not
		var suggestedViewHeight;
		var windowResizeProxy; // wraps the windowResize function
		var ignoreWindowResize = 0;
		var events = [];
		var date; // unzoned
		
		
		
		// Main Rendering
		// -----------------------------------------------------------------------------------


		// compute the initial ambig-timezone date
		if (options.defaultDate != null) {
			date = t.moment(options.defaultDate).stripZone();
		}
		else {
			date = t.getNow(); // getNow already returns unzoned
		}
		
		
		function render() {
			if (!content) {
				initialRender();
			}
			else if (elementVisible()) {
				// mainly for the public API
				calcSize();
				renderView();
			}
		}
		
		
		function initialRender() {
			tm = options.theme ? 'ui' : 'fc';
			element.addClass('fc');

			if (options.isRTL) {
				element.addClass('fc-rtl');
			}
			else {
				element.addClass('fc-ltr');
			}

			if (options.theme) {
				element.addClass('ui-widget');
			}
			else {
				element.addClass('fc-unthemed');
			}

			content = $("<div class='fc-view-container'/>").prependTo(element);

			header = t.header = new Header(t, options);
			headerElement = header.render();
			if (headerElement) {
				element.prepend(headerElement);
			}

			renderView(options.defaultView);

			if (options.handleWindowResize) {
				windowResizeProxy = debounce(windowResize, options.windowResizeDelay); // prevents rapid calls
				$(window).resize(windowResizeProxy);
			}
		}
		
		
		function destroy() {

			if (currentView) {
				currentView.removeElement();

				// NOTE: don't null-out currentView/t.view in case API methods are called after destroy.
				// It is still the "current" view, just not rendered.
			}

			header.removeElement();
			content.remove();
			element.removeClass('fc fc-ltr fc-rtl fc-unthemed ui-widget');

			if (windowResizeProxy) {
				$(window).unbind('resize', windowResizeProxy);
			}
		}
		
		
		function elementVisible() {
			return element.is(':visible');
		}
		
		

		// View Rendering
		// -----------------------------------------------------------------------------------


		// Renders a view because of a date change, view-type change, or for the first time.
		// If not given a viewType, keep the current view but render different dates.
		function renderView(viewType) {
			ignoreWindowResize++;

			// if viewType is changing, remove the old view's rendering
			if (currentView && viewType && currentView.type !== viewType) {
				header.deactivateButton(currentView.type);
				freezeContentHeight(); // prevent a scroll jump when view element is removed
				currentView.removeElement();
				currentView = t.view = null;
			}

			// if viewType changed, or the view was never created, create a fresh view
			if (!currentView && viewType) {
				currentView = t.view =
					viewsByType[viewType] ||
					(viewsByType[viewType] = t.instantiateView(viewType));

				currentView.setElement(
					$("<div class='fc-view fc-" + viewType + "-view' />").appendTo(content)
				);
				header.activateButton(viewType);
			}

			if (currentView) {

				// in case the view should render a period of time that is completely hidden
				date = currentView.massageCurrentDate(date);

				// render or rerender the view
				if (
					!currentView.displaying ||
					!date.isWithin(currentView.intervalStart, currentView.intervalEnd) // implicit date window change
				) {
					if (elementVisible()) {

						currentView.display(date); // will call freezeContentHeight
						unfreezeContentHeight(); // immediately unfreeze regardless of whether display is async

						// need to do this after View::render, so dates are calculated
						updateHeaderTitle();
						updateTodayButton();

						getAndRenderEvents();
					}
				}
			}

			unfreezeContentHeight(); // undo any lone freezeContentHeight calls
			ignoreWindowResize--;
		}

		

		// Resizing
		// -----------------------------------------------------------------------------------


		t.getSuggestedViewHeight = function() {
			if (suggestedViewHeight === undefined) {
				calcSize();
			}
			return suggestedViewHeight;
		};


		t.isHeightAuto = function() {
			return options.contentHeight === 'auto' || options.height === 'auto';
		};
		
		
		function updateSize(shouldRecalc) {
			if (elementVisible()) {

				if (shouldRecalc) {
					_calcSize();
				}

				ignoreWindowResize++;
				currentView.updateSize(true); // isResize=true. will poll getSuggestedViewHeight() and isHeightAuto()
				ignoreWindowResize--;

				return true; // signal success
			}
		}


		function calcSize() {
			if (elementVisible()) {
				_calcSize();
			}
		}
		
		
		function _calcSize() { // assumes elementVisible
			if (typeof options.contentHeight === 'number') { // exists and not 'auto'
				suggestedViewHeight = options.contentHeight;
			}
			else if (typeof options.height === 'number') { // exists and not 'auto'
				suggestedViewHeight = options.height - (headerElement ? headerElement.outerHeight(true) : 0);
			}
			else {
				suggestedViewHeight = Math.round(content.width() / Math.max(options.aspectRatio, .5));
			}
		}
		
		
		function windowResize(ev) {
			if (
				!ignoreWindowResize &&
				ev.target === window && // so we don't process jqui "resize" events that have bubbled up
				currentView.start // view has already been rendered
			) {
				if (updateSize(true)) {
					currentView.trigger('windowResize', _element);
				}
			}
		}
		
		
		
		/* Event Fetching/Rendering
		-----------------------------------------------------------------------------*/
		// TODO: going forward, most of this stuff should be directly handled by the view


		function refetchEvents() { // can be called as an API method
			destroyEvents(); // so that events are cleared before user starts waiting for AJAX
			fetchAndRenderEvents();
		}


		function renderEvents() { // destroys old events if previously rendered
			if (elementVisible()) {
				freezeContentHeight();
				currentView.displayEvents(events);
				unfreezeContentHeight();
			}
		}


		function destroyEvents() {
			freezeContentHeight();
			currentView.clearEvents();
			unfreezeContentHeight();
		}
		

		function getAndRenderEvents() {
			if (!options.lazyFetching || isFetchNeeded(currentView.start, currentView.end)) {
				fetchAndRenderEvents();
			}
			else {
				renderEvents();
			}
		}


		function fetchAndRenderEvents() {
			fetchEvents(currentView.start, currentView.end);
				// ... will call reportEvents
				// ... which will call renderEvents
		}

		
		// called when event data arrives
		function reportEvents(_events) {
			events = _events;
			renderEvents();
		}


		// called when a single event's data has been changed
		function reportEventChange() {
			renderEvents();
		}



		/* Header Updating
		-----------------------------------------------------------------------------*/


		function updateHeaderTitle() {
			header.updateTitle(currentView.title);
		}


		function updateTodayButton() {
			var now = t.getNow();
			if (now.isWithin(currentView.intervalStart, currentView.intervalEnd)) {
				header.disableButton('today');
			}
			else {
				header.enableButton('today');
			}
		}
		


		/* Selection
		-----------------------------------------------------------------------------*/
		

		// this public method receives start/end dates in any format, with any timezone
		function select(zonedStartInput, zonedEndInput) {
			currentView.select(
				t.buildSelectSpan.apply(t, arguments)
			);
		}
		

		function unselect() { // safe to be called before renderView
			if (currentView) {
				currentView.unselect();
			}
		}
		
		
		
		/* Date
		-----------------------------------------------------------------------------*/
		
		
		function prev() {
			date = currentView.computePrevDate(date);
			renderView();
		}
		
		
		function next() {
			date = currentView.computeNextDate(date);
			renderView();
		}
		
		
		function prevYear() {
			date.add(-1, 'years');
			renderView();
		}
		
		
		function nextYear() {
			date.add(1, 'years');
			renderView();
		}
		
		
		function today() {
			date = t.getNow();
			renderView();
		}
		
		
		function gotoDate(zonedDateInput) {
			date = t.moment(zonedDateInput).stripZone();
			renderView();
		}
		
		
		function incrementDate(delta) {
			date.add(moment.duration(delta));
			renderView();
		}


		// Forces navigation to a view for the given date.
		// `viewType` can be a specific view name or a generic one like "week" or "day".
		function zoomTo(newDate, viewType) {
			var spec;

			viewType = viewType || 'day'; // day is default zoom
			spec = t.getViewSpec(viewType) || t.getUnitViewSpec(viewType);

			date = newDate.clone();
			renderView(spec ? spec.type : null);
		}
		
		
		// for external API
		function getDate() {
			return t.applyTimezone(date); // infuse the calendar's timezone
		}



		/* Height "Freezing"
		-----------------------------------------------------------------------------*/
		// TODO: move this into the view

		t.freezeContentHeight = freezeContentHeight;
		t.unfreezeContentHeight = unfreezeContentHeight;


		function freezeContentHeight() {
			content.css({
				width: '100%',
				height: content.height(),
				overflow: 'hidden'
			});
		}


		function unfreezeContentHeight() {
			content.css({
				width: '',
				height: '',
				overflow: ''
			});
		}
		
		
		
		/* Misc
		-----------------------------------------------------------------------------*/
		

		function getCalendar() {
			return t;
		}

		
		function getView() {
			return currentView;
		}
		
		
		function option(name, value) {
			if (value === undefined) {
				return options[name];
			}
			if (name == 'height' || name == 'contentHeight' || name == 'aspectRatio') {
				options[name] = value;
				updateSize(true); // true = allow recalculation of height
			}
		}
		
		
		function trigger(name, thisObj) { // overrides the Emitter's trigger method :(
			var args = Array.prototype.slice.call(arguments, 2);

			thisObj = thisObj || _element;
			this.triggerWith(name, thisObj, args); // Emitter's method

			if (options[name]) {
				return options[name].apply(thisObj, args);
			}
		}

		t.initialize();
	}

	;;

	Calendar.defaults = {

		titleRangeSeparator: ' \u2014 ', // emphasized dash
		monthYearFormat: 'MMMM YYYY', // required for en. other languages rely on datepicker computable option

		defaultTimedEventDuration: '02:00:00',
		defaultAllDayEventDuration: { days: 1 },
		forceEventDuration: false,
		nextDayThreshold: '09:00:00', // 9am

		// display
		defaultView: 'month',
		aspectRatio: 1.35,
		header: {
			left: 'title',
			center: '',
			right: 'today prev,next'
		},
		weekends: true,
		weekNumbers: false,

		weekNumberTitle: 'W',
		weekNumberCalculation: 'local',
		
		//editable: false,

		scrollTime: '06:00:00',
		
		// event ajax
		lazyFetching: true,
		startParam: 'start',
		endParam: 'end',
		timezoneParam: 'timezone',

		timezone: false,

		//allDayDefault: undefined,

		// locale
		isRTL: false,
		buttonText: {
			prev: "prev",
			next: "next",
			prevYear: "prev year",
			nextYear: "next year",
			year: 'year', // TODO: locale files need to specify this
			today: 'today',
			month: 'month',
			week: 'week',
			day: 'day'
		},

		buttonIcons: {
			prev: 'left-single-arrow',
			next: 'right-single-arrow',
			prevYear: 'left-double-arrow',
			nextYear: 'right-double-arrow'
		},
		
		// jquery-ui theming
		theme: false,
		themeButtonIcons: {
			prev: 'circle-triangle-w',
			next: 'circle-triangle-e',
			prevYear: 'seek-prev',
			nextYear: 'seek-next'
		},

		//eventResizableFromStart: false,
		dragOpacity: .75,
		dragRevertDuration: 500,
		dragScroll: true,
		
		//selectable: false,
		unselectAuto: true,
		
		dropAccept: '*',

		eventOrder: 'title',

		eventLimit: false,
		eventLimitText: 'more',
		eventLimitClick: 'popover',
		dayPopoverFormat: 'LL',
		
		handleWindowResize: true,
		windowResizeDelay: 200 // milliseconds before an updateSize happens
		
	};


	Calendar.englishDefaults = { // used by lang.js
		dayPopoverFormat: 'dddd, MMMM D'
	};


	Calendar.rtlDefaults = { // right-to-left defaults
		header: { // TODO: smarter solution (first/center/last ?)
			left: 'next,prev today',
			center: '',
			right: 'title'
		},
		buttonIcons: {
			prev: 'right-single-arrow',
			next: 'left-single-arrow',
			prevYear: 'right-double-arrow',
			nextYear: 'left-double-arrow'
		},
		themeButtonIcons: {
			prev: 'circle-triangle-e',
			next: 'circle-triangle-w',
			nextYear: 'seek-prev',
			prevYear: 'seek-next'
		}
	};

	;;

	var langOptionHash = FC.langs = {}; // initialize and expose


	// TODO: document the structure and ordering of a FullCalendar lang file
	// TODO: rename everything "lang" to "locale", like what the moment project did


	// Initialize jQuery UI datepicker translations while using some of the translations
	// Will set this as the default language for datepicker.
	FC.datepickerLang = function(langCode, dpLangCode, dpOptions) {

		// get the FullCalendar internal option hash for this language. create if necessary
		var fcOptions = langOptionHash[langCode] || (langOptionHash[langCode] = {});

		// transfer some simple options from datepicker to fc
		fcOptions.isRTL = dpOptions.isRTL;
		fcOptions.weekNumberTitle = dpOptions.weekHeader;

		// compute some more complex options from datepicker
		$.each(dpComputableOptions, function(name, func) {
			fcOptions[name] = func(dpOptions);
		});

		// is jQuery UI Datepicker is on the page?
		if ($.datepicker) {

			// Register the language data.
			// FullCalendar and MomentJS use language codes like "pt-br" but Datepicker
			// does it like "pt-BR" or if it doesn't have the language, maybe just "pt".
			// Make an alias so the language can be referenced either way.
			$.datepicker.regional[dpLangCode] =
				$.datepicker.regional[langCode] = // alias
					dpOptions;

			// Alias 'en' to the default language data. Do this every time.
			$.datepicker.regional.en = $.datepicker.regional[''];

			// Set as Datepicker's global defaults.
			$.datepicker.setDefaults(dpOptions);
		}
	};


	// Sets FullCalendar-specific translations. Will set the language as the global default.
	FC.lang = function(langCode, newFcOptions) {
		var fcOptions;
		var momOptions;

		// get the FullCalendar internal option hash for this language. create if necessary
		fcOptions = langOptionHash[langCode] || (langOptionHash[langCode] = {});

		// provided new options for this language? merge them in
		if (newFcOptions) {
			fcOptions = langOptionHash[langCode] = mergeOptions([ fcOptions, newFcOptions ]);
		}

		// compute language options that weren't defined.
		// always do this. newFcOptions can be undefined when initializing from i18n file,
		// so no way to tell if this is an initialization or a default-setting.
		momOptions = getMomentLocaleData(langCode); // will fall back to en
		$.each(momComputableOptions, function(name, func) {
			if (fcOptions[name] == null) {
				fcOptions[name] = func(momOptions, fcOptions);
			}
		});

		// set it as the default language for FullCalendar
		Calendar.defaults.lang = langCode;
	};


	// NOTE: can't guarantee any of these computations will run because not every language has datepicker
	// configs, so make sure there are English fallbacks for these in the defaults file.
	var dpComputableOptions = {

		buttonText: function(dpOptions) {
			return {
				// the translations sometimes wrongly contain HTML entities
				prev: stripHtmlEntities(dpOptions.prevText),
				next: stripHtmlEntities(dpOptions.nextText),
				today: stripHtmlEntities(dpOptions.currentText)
			};
		},

		// Produces format strings like "MMMM YYYY" -> "September 2014"
		monthYearFormat: function(dpOptions) {
			return dpOptions.showMonthAfterYear ?
				'YYYY[' + dpOptions.yearSuffix + '] MMMM' :
				'MMMM YYYY[' + dpOptions.yearSuffix + ']';
		}

	};

	var momComputableOptions = {

		// Produces format strings like "ddd M/D" -> "Fri 9/15"
		dayOfMonthFormat: function(momOptions, fcOptions) {
			var format = momOptions.longDateFormat('l'); // for the format like "M/D/YYYY"

			// strip the year off the edge, as well as other misc non-whitespace chars
			format = format.replace(/^Y+[^\w\s]*|[^\w\s]*Y+$/g, '');

			if (fcOptions.isRTL) {
				format += ' ddd'; // for RTL, add day-of-week to end
			}
			else {
				format = 'ddd ' + format; // for LTR, add day-of-week to beginning
			}
			return format;
		},

		// Produces format strings like "h:mma" -> "6:00pm"
		mediumTimeFormat: function(momOptions) { // can't be called `timeFormat` because collides with option
			return momOptions.longDateFormat('LT')
				.replace(/\s*a$/i, 'a'); // convert AM/PM/am/pm to lowercase. remove any spaces beforehand
		},

		// Produces format strings like "h(:mm)a" -> "6pm" / "6:30pm"
		smallTimeFormat: function(momOptions) {
			return momOptions.longDateFormat('LT')
				.replace(':mm', '(:mm)')
				.replace(/(\Wmm)$/, '($1)') // like above, but for foreign langs
				.replace(/\s*a$/i, 'a'); // convert AM/PM/am/pm to lowercase. remove any spaces beforehand
		},

		// Produces format strings like "h(:mm)t" -> "6p" / "6:30p"
		extraSmallTimeFormat: function(momOptions) {
			return momOptions.longDateFormat('LT')
				.replace(':mm', '(:mm)')
				.replace(/(\Wmm)$/, '($1)') // like above, but for foreign langs
				.replace(/\s*a$/i, 't'); // convert to AM/PM/am/pm to lowercase one-letter. remove any spaces beforehand
		},

		// Produces format strings like "ha" / "H" -> "6pm" / "18"
		hourFormat: function(momOptions) {
			return momOptions.longDateFormat('LT')
				.replace(':mm', '')
				.replace(/(\Wmm)$/, '') // like above, but for foreign langs
				.replace(/\s*a$/i, 'a'); // convert AM/PM/am/pm to lowercase. remove any spaces beforehand
		},

		// Produces format strings like "h:mm" -> "6:30" (with no AM/PM)
		noMeridiemTimeFormat: function(momOptions) {
			return momOptions.longDateFormat('LT')
				.replace(/\s*a$/i, ''); // remove trailing AM/PM
		}

	};


	// options that should be computed off live calendar options (considers override options)
	// TODO: best place for this? related to lang?
	// TODO: flipping text based on isRTL is a bad idea because the CSS `direction` might want to handle it
	var instanceComputableOptions = {

		// Produces format strings for results like "Mo 16"
		smallDayDateFormat: function(options) {
			return options.isRTL ?
				'D dd' :
				'dd D';
		},

		// Produces format strings for results like "Wk 5"
		weekFormat: function(options) {
			return options.isRTL ?
				'w[ ' + options.weekNumberTitle + ']' :
				'[' + options.weekNumberTitle + ' ]w';
		},

		// Produces format strings for results like "Wk5"
		smallWeekFormat: function(options) {
			return options.isRTL ?
				'w[' + options.weekNumberTitle + ']' :
				'[' + options.weekNumberTitle + ']w';
		}

	};

	function populateInstanceComputableOptions(options) {
		$.each(instanceComputableOptions, function(name, func) {
			if (options[name] == null) {
				options[name] = func(options);
			}
		});
	}


	// Returns moment's internal locale data. If doesn't exist, returns English.
	// Works with moment-pre-2.8
	function getMomentLocaleData(langCode) {
		var func = moment.localeData || moment.langData;
		return func.call(moment, langCode) ||
			func.call(moment, 'en'); // the newer localData could return null, so fall back to en
	}


	// Initialize English by forcing computation of moment-derived options.
	// Also, sets it as the default.
	FC.lang('en', Calendar.englishDefaults);

	;;

	/* Top toolbar area with buttons and title
	----------------------------------------------------------------------------------------------------------------------*/
	// TODO: rename all header-related things to "toolbar"

	function Header(calendar, options) {
		var t = this;
		
		// exports
		t.render = render;
		t.removeElement = removeElement;
		t.updateTitle = updateTitle;
		t.activateButton = activateButton;
		t.deactivateButton = deactivateButton;
		t.disableButton = disableButton;
		t.enableButton = enableButton;
		t.getViewsWithButtons = getViewsWithButtons;
		
		// locals
		var el = $();
		var viewsWithButtons = [];
		var tm;


		function render() {
			var sections = options.header;

			tm = options.theme ? 'ui' : 'fc';

			if (sections) {
				el = $("<div class='fc-toolbar'/>")
					.append(renderSection('left'))
					.append(renderSection('right'))
					.append(renderSection('center'))
					.append('<div class="fc-clear"/>');

				return el;
			}
		}
		
		
		function removeElement() {
			el.remove();
			el = $();
		}
		
		
		function renderSection(position) {
			var sectionEl = $('<div class="fc-' + position + '"/>');
			var buttonStr = options.header[position];

			if (buttonStr) {
				$.each(buttonStr.split(' '), function(i) {
					var groupChildren = $();
					var isOnlyButtons = true;
					var groupEl;

					$.each(this.split(','), function(j, buttonName) {
						var customButtonProps;
						var viewSpec;
						var buttonClick;
						var overrideText; // text explicitly set by calendar's constructor options. overcomes icons
						var defaultText;
						var themeIcon;
						var normalIcon;
						var innerHtml;
						var classes;
						var button; // the element

						if (buttonName == 'title') {
							groupChildren = groupChildren.add($('<h2>&nbsp;</h2>')); // we always want it to take up height
							isOnlyButtons = false;
						}
						else {
							if ((customButtonProps = (calendar.options.customButtons || {})[buttonName])) {
								buttonClick = function(ev) {
									if (customButtonProps.click) {
										customButtonProps.click.call(button[0], ev);
									}
								};
								overrideText = ''; // icons will override text
								defaultText = customButtonProps.text;
							}
							else if ((viewSpec = calendar.getViewSpec(buttonName))) {
								buttonClick = function() {
									calendar.changeView(buttonName);
								};
								viewsWithButtons.push(buttonName);
								overrideText = viewSpec.buttonTextOverride;
								defaultText = viewSpec.buttonTextDefault;
							}
							else if (calendar[buttonName]) { // a calendar method
								buttonClick = function() {
									calendar[buttonName]();
								};
								overrideText = (calendar.overrides.buttonText || {})[buttonName];
								defaultText = options.buttonText[buttonName]; // everything else is considered default
							}

							if (buttonClick) {

								themeIcon =
									customButtonProps ?
										customButtonProps.themeIcon :
										options.themeButtonIcons[buttonName];

								normalIcon =
									customButtonProps ?
										customButtonProps.icon :
										options.buttonIcons[buttonName];

								if (overrideText) {
									innerHtml = htmlEscape(overrideText);
								}
								else if (themeIcon && options.theme) {
									innerHtml = "<span class='ui-icon ui-icon-" + themeIcon + "'></span>";
								}
								else if (normalIcon && !options.theme) {
									innerHtml = "<span class='fc-icon fc-icon-" + normalIcon + "'></span>";
								}
								else {
									innerHtml = htmlEscape(defaultText);
								}

								classes = [
									'fc-' + buttonName + '-button',
									tm + '-button',
									tm + '-state-default'
								];

								button = $( // type="button" so that it doesn't submit a form
									'<button type="button" class="' + classes.join(' ') + '">' +
										innerHtml +
									'</button>'
									)
									.click(function(ev) {
										// don't process clicks for disabled buttons
										if (!button.hasClass(tm + '-state-disabled')) {

											buttonClick(ev);

											// after the click action, if the button becomes the "active" tab, or disabled,
											// it should never have a hover class, so remove it now.
											if (
												button.hasClass(tm + '-state-active') ||
												button.hasClass(tm + '-state-disabled')
											) {
												button.removeClass(tm + '-state-hover');
											}
										}
									})
									.mousedown(function() {
										// the *down* effect (mouse pressed in).
										// only on buttons that are not the "active" tab, or disabled
										button
											.not('.' + tm + '-state-active')
											.not('.' + tm + '-state-disabled')
											.addClass(tm + '-state-down');
									})
									.mouseup(function() {
										// undo the *down* effect
										button.removeClass(tm + '-state-down');
									})
									.hover(
										function() {
											// the *hover* effect.
											// only on buttons that are not the "active" tab, or disabled
											button
												.not('.' + tm + '-state-active')
												.not('.' + tm + '-state-disabled')
												.addClass(tm + '-state-hover');
										},
										function() {
											// undo the *hover* effect
											button
												.removeClass(tm + '-state-hover')
												.removeClass(tm + '-state-down'); // if mouseleave happens before mouseup
										}
									);

								groupChildren = groupChildren.add(button);
							}
						}
					});

					if (isOnlyButtons) {
						groupChildren
							.first().addClass(tm + '-corner-left').end()
							.last().addClass(tm + '-corner-right').end();
					}

					if (groupChildren.length > 1) {
						groupEl = $('<div/>');
						if (isOnlyButtons) {
							groupEl.addClass('fc-button-group');
						}
						groupEl.append(groupChildren);
						sectionEl.append(groupEl);
					}
					else {
						sectionEl.append(groupChildren); // 1 or 0 children
					}
				});
			}

			return sectionEl;
		}
		
		
		function updateTitle(text) {
			el.find('h2').text(text);
		}
		
		
		function activateButton(buttonName) {
			el.find('.fc-' + buttonName + '-button')
				.addClass(tm + '-state-active');
		}
		
		
		function deactivateButton(buttonName) {
			el.find('.fc-' + buttonName + '-button')
				.removeClass(tm + '-state-active');
		}
		
		
		function disableButton(buttonName) {
			el.find('.fc-' + buttonName + '-button')
				.attr('disabled', 'disabled')
				.addClass(tm + '-state-disabled');
		}
		
		
		function enableButton(buttonName) {
			el.find('.fc-' + buttonName + '-button')
				.removeAttr('disabled')
				.removeClass(tm + '-state-disabled');
		}


		function getViewsWithButtons() {
			return viewsWithButtons;
		}

	}

	;;

	FC.sourceNormalizers = [];
	FC.sourceFetchers = [];

	var ajaxDefaults = {
		dataType: 'json',
		cache: false
	};

	var eventGUID = 1;


	function EventManager(options) { // assumed to be a calendar
		var t = this;
		
		
		// exports
		t.isFetchNeeded = isFetchNeeded;
		t.fetchEvents = fetchEvents;
		t.addEventSource = addEventSource;
		t.removeEventSource = removeEventSource;
		t.updateEvent = updateEvent;
		t.renderEvent = renderEvent;
		t.removeEvents = removeEvents;
		t.clientEvents = clientEvents;
		t.mutateEvent = mutateEvent;
		t.normalizeEventDates = normalizeEventDates;
		t.normalizeEventTimes = normalizeEventTimes;
		
		
		// imports
		var reportEvents = t.reportEvents;
		
		
		// locals
		var stickySource = { events: [] };
		var sources = [ stickySource ];
		var rangeStart, rangeEnd;
		var currentFetchID = 0;
		var pendingSourceCnt = 0;
		var cache = []; // holds events that have already been expanded


		$.each(
			(options.events ? [ options.events ] : []).concat(options.eventSources || []),
			function(i, sourceInput) {
				var source = buildEventSource(sourceInput);
				if (source) {
					sources.push(source);
				}
			}
		);
		
		
		
		/* Fetching
		-----------------------------------------------------------------------------*/


		// start and end are assumed to be unzoned
		function isFetchNeeded(start, end) {
			return !rangeStart || // nothing has been fetched yet?
				start < rangeStart || end > rangeEnd; // is part of the new range outside of the old range?
		}
		
		
		function fetchEvents(start, end) {
			rangeStart = start;
			rangeEnd = end;
			cache = [];
			var fetchID = ++currentFetchID;
			var len = sources.length;
			pendingSourceCnt = len;
			for (var i=0; i<len; i++) {
				fetchEventSource(sources[i], fetchID);
			}
		}
		
		
		function fetchEventSource(source, fetchID) {
			_fetchEventSource(source, function(eventInputs) {
				var isArraySource = $.isArray(source.events);
				var i, eventInput;
				var abstractEvent;

				if (fetchID == currentFetchID) {

					if (eventInputs) {
						for (i = 0; i < eventInputs.length; i++) {
							eventInput = eventInputs[i];

							if (isArraySource) { // array sources have already been convert to Event Objects
								abstractEvent = eventInput;
							}
							else {
								abstractEvent = buildEventFromInput(eventInput, source);
							}

							if (abstractEvent) { // not false (an invalid event)
								cache.push.apply(
									cache,
									expandEvent(abstractEvent) // add individual expanded events to the cache
								);
							}
						}
					}

					pendingSourceCnt--;
					if (!pendingSourceCnt) {
						reportEvents(cache);
					}
				}
			});
		}
		
		
		function _fetchEventSource(source, callback) {
			var i;
			var fetchers = FC.sourceFetchers;
			var res;

			for (i=0; i<fetchers.length; i++) {
				res = fetchers[i].call(
					t, // this, the Calendar object
					source,
					rangeStart.clone(),
					rangeEnd.clone(),
					options.timezone,
					callback
				);

				if (res === true) {
					// the fetcher is in charge. made its own async request
					return;
				}
				else if (typeof res == 'object') {
					// the fetcher returned a new source. process it
					_fetchEventSource(res, callback);
					return;
				}
			}

			var events = source.events;
			if (events) {
				if ($.isFunction(events)) {
					t.pushLoading();
					events.call(
						t, // this, the Calendar object
						rangeStart.clone(),
						rangeEnd.clone(),
						options.timezone,
						function(events) {
							callback(events);
							t.popLoading();
						}
					);
				}
				else if ($.isArray(events)) {
					callback(events);
				}
				else {
					callback();
				}
			}else{
				var url = source.url;
				if (url) {
					var success = source.success;
					var error = source.error;
					var complete = source.complete;

					// retrieve any outbound GET/POST $.ajax data from the options
					var customData;
					if ($.isFunction(source.data)) {
						// supplied as a function that returns a key/value object
						customData = source.data();
					}
					else {
						// supplied as a straight key/value object
						customData = source.data;
					}

					// use a copy of the custom data so we can modify the parameters
					// and not affect the passed-in object.
					var data = $.extend({}, customData || {});

					var startParam = firstDefined(source.startParam, options.startParam);
					var endParam = firstDefined(source.endParam, options.endParam);
					var timezoneParam = firstDefined(source.timezoneParam, options.timezoneParam);

					if (startParam) {
						data[startParam] = rangeStart.format();
					}
					if (endParam) {
						data[endParam] = rangeEnd.format();
					}
					if (options.timezone && options.timezone != 'local') {
						data[timezoneParam] = options.timezone;
					}

					t.pushLoading();
					$.ajax($.extend({}, ajaxDefaults, source, {
						data: data,
						success: function(events) {
							events = events || [];
							var res = applyAll(success, this, arguments);
							if ($.isArray(res)) {
								events = res;
							}
							callback(events);
						},
						error: function() {
							applyAll(error, this, arguments);
							callback();
						},
						complete: function() {
							applyAll(complete, this, arguments);
							t.popLoading();
						}
					}));
				}else{
					callback();
				}
			}
		}
		
		
		
		/* Sources
		-----------------------------------------------------------------------------*/
		

		function addEventSource(sourceInput) {
			var source = buildEventSource(sourceInput);
			if (source) {
				sources.push(source);
				pendingSourceCnt++;
				fetchEventSource(source, currentFetchID); // will eventually call reportEvents
			}
		}


		function buildEventSource(sourceInput) { // will return undefined if invalid source
			var normalizers = FC.sourceNormalizers;
			var source;
			var i;

			if ($.isFunction(sourceInput) || $.isArray(sourceInput)) {
				source = { events: sourceInput };
			}
			else if (typeof sourceInput === 'string') {
				source = { url: sourceInput };
			}
			else if (typeof sourceInput === 'object') {
				source = $.extend({}, sourceInput); // shallow copy
			}

			if (source) {

				// TODO: repeat code, same code for event classNames
				if (source.className) {
					if (typeof source.className === 'string') {
						source.className = source.className.split(/\s+/);
					}
					// otherwise, assumed to be an array
				}
				else {
					source.className = [];
				}

				// for array sources, we convert to standard Event Objects up front
				if ($.isArray(source.events)) {
					source.origArray = source.events; // for removeEventSource
					source.events = $.map(source.events, function(eventInput) {
						return buildEventFromInput(eventInput, source);
					});
				}

				for (i=0; i<normalizers.length; i++) {
					normalizers[i].call(t, source);
				}

				return source;
			}
		}


		function removeEventSource(source) {
			sources = $.grep(sources, function(src) {
				return !isSourcesEqual(src, source);
			});
			// remove all client events from that source
			cache = $.grep(cache, function(e) {
				return !isSourcesEqual(e.source, source);
			});
			reportEvents(cache);
		}


		function isSourcesEqual(source1, source2) {
			return source1 && source2 && getSourcePrimitive(source1) == getSourcePrimitive(source2);
		}


		function getSourcePrimitive(source) {
			return (
				(typeof source === 'object') ? // a normalized event source?
					(source.origArray || source.googleCalendarId || source.url || source.events) : // get the primitive
					null
			) ||
			source; // the given argument *is* the primitive
		}
		
		
		
		/* Manipulation
		-----------------------------------------------------------------------------*/


		// Only ever called from the externally-facing API
		function updateEvent(event) {

			// massage start/end values, even if date string values
			event.start = t.moment(event.start);
			if (event.end) {
				event.end = t.moment(event.end);
			}
			else {
				event.end = null;
			}

			mutateEvent(event, getMiscEventProps(event)); // will handle start/end/allDay normalization
			reportEvents(cache); // reports event modifications (so we can redraw)
		}


		// Returns a hash of misc event properties that should be copied over to related events.
		function getMiscEventProps(event) {
			var props = {};

			$.each(event, function(name, val) {
				if (isMiscEventPropName(name)) {
					if (val !== undefined && isAtomic(val)) { // a defined non-object
						props[name] = val;
					}
				}
			});

			return props;
		}

		// non-date-related, non-id-related, non-secret
		function isMiscEventPropName(name) {
			return !/^_|^(id|allDay|start|end)$/.test(name);
		}

		
		// returns the expanded events that were created
		function renderEvent(eventInput, stick) {
			var abstractEvent = buildEventFromInput(eventInput);
			var events;
			var i, event;

			if (abstractEvent) { // not false (a valid input)
				events = expandEvent(abstractEvent);

				for (i = 0; i < events.length; i++) {
					event = events[i];

					if (!event.source) {
						if (stick) {
							stickySource.events.push(event);
							event.source = stickySource;
						}
						cache.push(event);
					}
				}

				reportEvents(cache);

				return events;
			}

			return [];
		}
		
		
		function removeEvents(filter) {
			var eventID;
			var i;

			if (filter == null) { // null or undefined. remove all events
				filter = function() { return true; }; // will always match
			}
			else if (!$.isFunction(filter)) { // an event ID
				eventID = filter + '';
				filter = function(event) {
					return event._id == eventID;
				};
			}

			// Purge event(s) from our local cache
			cache = $.grep(cache, filter, true); // inverse=true

			// Remove events from array sources.
			// This works because they have been converted to official Event Objects up front.
			// (and as a result, event._id has been calculated).
			for (i=0; i<sources.length; i++) {
				if ($.isArray(sources[i].events)) {
					sources[i].events = $.grep(sources[i].events, filter, true);
				}
			}

			reportEvents(cache);
		}
		
		
		function clientEvents(filter) {
			if ($.isFunction(filter)) {
				return $.grep(cache, filter);
			}
			else if (filter != null) { // not null, not undefined. an event ID
				filter += '';
				return $.grep(cache, function(e) {
					return e._id == filter;
				});
			}
			return cache; // else, return all
		}
		
		
		
		/* Event Normalization
		-----------------------------------------------------------------------------*/


		// Given a raw object with key/value properties, returns an "abstract" Event object.
		// An "abstract" event is an event that, if recurring, will not have been expanded yet.
		// Will return `false` when input is invalid.
		// `source` is optional
		function buildEventFromInput(input, source) {
			var out = {};
			var start, end;
			var allDay;

			if (options.eventDataTransform) {
				input = options.eventDataTransform(input);
			}
			if (source && source.eventDataTransform) {
				input = source.eventDataTransform(input);
			}

			// Copy all properties over to the resulting object.
			// The special-case properties will be copied over afterwards.
			$.extend(out, input);

			if (source) {
				out.source = source;
			}

			out._id = input._id || (input.id === undefined ? '_fc' + eventGUID++ : input.id + '');

			if (input.className) {
				if (typeof input.className == 'string') {
					out.className = input.className.split(/\s+/);
				}
				else { // assumed to be an array
					out.className = input.className;
				}
			}
			else {
				out.className = [];
			}

			start = input.start || input.date; // "date" is an alias for "start"
			end = input.end;

			// parse as a time (Duration) if applicable
			if (isTimeString(start)) {
				start = moment.duration(start);
			}
			if (isTimeString(end)) {
				end = moment.duration(end);
			}

			if (input.dow || moment.isDuration(start) || moment.isDuration(end)) {

				// the event is "abstract" (recurring) so don't calculate exact start/end dates just yet
				out.start = start ? moment.duration(start) : null; // will be a Duration or null
				out.end = end ? moment.duration(end) : null; // will be a Duration or null
				out._recurring = true; // our internal marker
			}
			else {

				if (start) {
					start = t.moment(start);
					if (!start.isValid()) {
						return false;
					}
				}

				if (end) {
					end = t.moment(end);
					if (!end.isValid()) {
						end = null; // let defaults take over
					}
				}

				allDay = input.allDay;
				if (allDay === undefined) { // still undefined? fallback to default
					allDay = firstDefined(
						source ? source.allDayDefault : undefined,
						options.allDayDefault
					);
					// still undefined? normalizeEventDates will calculate it
				}

				assignDatesToEvent(start, end, allDay, out);
			}

			return out;
		}


		// Normalizes and assigns the given dates to the given partially-formed event object.
		// NOTE: mutates the given start/end moments. does not make a copy.
		function assignDatesToEvent(start, end, allDay, event) {
			event.start = start;
			event.end = end;
			event.allDay = allDay;
			normalizeEventDates(event);
			backupEventDates(event);
		}


		// Ensures proper values for allDay/start/end. Accepts an Event object, or a plain object with event-ish properties.
		// NOTE: Will modify the given object.
		function normalizeEventDates(eventProps) {

			normalizeEventTimes(eventProps);

			if (eventProps.end && !eventProps.end.isAfter(eventProps.start)) {
				eventProps.end = null;
			}

			if (!eventProps.end) {
				if (options.forceEventDuration) {
					eventProps.end = t.getDefaultEventEnd(eventProps.allDay, eventProps.start);
				}
				else {
					eventProps.end = null;
				}
			}
		}


		// Ensures the allDay property exists and the timeliness of the start/end dates are consistent
		function normalizeEventTimes(eventProps) {
			if (eventProps.allDay == null) {
				eventProps.allDay = !(eventProps.start.hasTime() || (eventProps.end && eventProps.end.hasTime()));
			}

			if (eventProps.allDay) {
				eventProps.start.stripTime();
				if (eventProps.end) {
					// TODO: consider nextDayThreshold here? If so, will require a lot of testing and adjustment
					eventProps.end.stripTime();
				}
			}
			else {
				if (!eventProps.start.hasTime()) {
					eventProps.start = t.applyTimezone(eventProps.start.time(0)); // will assign a 00:00 time
				}
				if (eventProps.end && !eventProps.end.hasTime()) {
					eventProps.end = t.applyTimezone(eventProps.end.time(0)); // will assign a 00:00 time
				}
			}
		}


		// If the given event is a recurring event, break it down into an array of individual instances.
		// If not a recurring event, return an array with the single original event.
		// If given a falsy input (probably because of a failed buildEventFromInput call), returns an empty array.
		// HACK: can override the recurring window by providing custom rangeStart/rangeEnd (for businessHours).
		function expandEvent(abstractEvent, _rangeStart, _rangeEnd) {
			var events = [];
			var dowHash;
			var dow;
			var i;
			var date;
			var startTime, endTime;
			var start, end;
			var event;

			_rangeStart = _rangeStart || rangeStart;
			_rangeEnd = _rangeEnd || rangeEnd;

			if (abstractEvent) {
				if (abstractEvent._recurring) {

					// make a boolean hash as to whether the event occurs on each day-of-week
					if ((dow = abstractEvent.dow)) {
						dowHash = {};
						for (i = 0; i < dow.length; i++) {
							dowHash[dow[i]] = true;
						}
					}

					// iterate through every day in the current range
					date = _rangeStart.clone().stripTime(); // holds the date of the current day
					while (date.isBefore(_rangeEnd)) {

						if (!dowHash || dowHash[date.day()]) { // if everyday, or this particular day-of-week

							startTime = abstractEvent.start; // the stored start and end properties are times (Durations)
							endTime = abstractEvent.end; // "
							start = date.clone();
							end = null;

							if (startTime) {
								start = start.time(startTime);
							}
							if (endTime) {
								end = date.clone().time(endTime);
							}

							event = $.extend({}, abstractEvent); // make a copy of the original
							assignDatesToEvent(
								start, end,
								!startTime && !endTime, // allDay?
								event
							);
							events.push(event);
						}

						date.add(1, 'days');
					}
				}
				else {
					events.push(abstractEvent); // return the original event. will be a one-item array
				}
			}

			return events;
		}



		/* Event Modification Math
		-----------------------------------------------------------------------------------------*/


		// Modifies an event and all related events by applying the given properties.
		// Special date-diffing logic is used for manipulation of dates.
		// If `props` does not contain start/end dates, the updated values are assumed to be the event's current start/end.
		// All date comparisons are done against the event's pristine _start and _end dates.
		// Returns an object with delta information and a function to undo all operations.
		// For making computations in a granularity greater than day/time, specify largeUnit.
		// NOTE: The given `newProps` might be mutated for normalization purposes.
		function mutateEvent(event, newProps, largeUnit) {
			var miscProps = {};
			var oldProps;
			var clearEnd;
			var startDelta;
			var endDelta;
			var durationDelta;
			var undoFunc;

			// diffs the dates in the appropriate way, returning a duration
			function diffDates(date1, date0) { // date1 - date0
				if (largeUnit) {
					return diffByUnit(date1, date0, largeUnit);
				}
				else if (newProps.allDay) {
					return diffDay(date1, date0);
				}
				else {
					return diffDayTime(date1, date0);
				}
			}

			newProps = newProps || {};

			// normalize new date-related properties
			if (!newProps.start) {
				newProps.start = event.start.clone();
			}
			if (newProps.end === undefined) {
				newProps.end = event.end ? event.end.clone() : null;
			}
			if (newProps.allDay == null) { // is null or undefined?
				newProps.allDay = event.allDay;
			}
			normalizeEventDates(newProps);

			// create normalized versions of the original props to compare against
			// need a real end value, for diffing
			oldProps = {
				start: event._start.clone(),
				end: event._end ? event._end.clone() : t.getDefaultEventEnd(event._allDay, event._start),
				allDay: newProps.allDay // normalize the dates in the same regard as the new properties
			};
			normalizeEventDates(oldProps);

			// need to clear the end date if explicitly changed to null
			clearEnd = event._end !== null && newProps.end === null;

			// compute the delta for moving the start date
			startDelta = diffDates(newProps.start, oldProps.start);

			// compute the delta for moving the end date
			if (newProps.end) {
				endDelta = diffDates(newProps.end, oldProps.end);
				durationDelta = endDelta.subtract(startDelta);
			}
			else {
				durationDelta = null;
			}

			// gather all non-date-related properties
			$.each(newProps, function(name, val) {
				if (isMiscEventPropName(name)) {
					if (val !== undefined) {
						miscProps[name] = val;
					}
				}
			});

			// apply the operations to the event and all related events
			undoFunc = mutateEvents(
				clientEvents(event._id), // get events with this ID
				clearEnd,
				newProps.allDay,
				startDelta,
				durationDelta,
				miscProps
			);

			return {
				dateDelta: startDelta,
				durationDelta: durationDelta,
				undo: undoFunc
			};
		}


		// Modifies an array of events in the following ways (operations are in order):
		// - clear the event's `end`
		// - convert the event to allDay
		// - add `dateDelta` to the start and end
		// - add `durationDelta` to the event's duration
		// - assign `miscProps` to the event
		//
		// Returns a function that can be called to undo all the operations.
		//
		// TODO: don't use so many closures. possible memory issues when lots of events with same ID.
		//
		function mutateEvents(events, clearEnd, allDay, dateDelta, durationDelta, miscProps) {
			var isAmbigTimezone = t.getIsAmbigTimezone();
			var undoFunctions = [];

			// normalize zero-length deltas to be null
			if (dateDelta && !dateDelta.valueOf()) { dateDelta = null; }
			if (durationDelta && !durationDelta.valueOf()) { durationDelta = null; }

			$.each(events, function(i, event) {
				var oldProps;
				var newProps;

				// build an object holding all the old values, both date-related and misc.
				// for the undo function.
				oldProps = {
					start: event.start.clone(),
					end: event.end ? event.end.clone() : null,
					allDay: event.allDay
				};
				$.each(miscProps, function(name) {
					oldProps[name] = event[name];
				});

				// new date-related properties. work off the original date snapshot.
				// ok to use references because they will be thrown away when backupEventDates is called.
				newProps = {
					start: event._start,
					end: event._end,
					allDay: allDay // normalize the dates in the same regard as the new properties
				};
				normalizeEventDates(newProps); // massages start/end/allDay

				// strip or ensure the end date
				if (clearEnd) {
					newProps.end = null;
				}
				else if (durationDelta && !newProps.end) { // the duration translation requires an end date
					newProps.end = t.getDefaultEventEnd(newProps.allDay, newProps.start);
				}

				if (dateDelta) {
					newProps.start.add(dateDelta);
					if (newProps.end) {
						newProps.end.add(dateDelta);
					}
				}

				if (durationDelta) {
					newProps.end.add(durationDelta); // end already ensured above
				}

				// if the dates have changed, and we know it is impossible to recompute the
				// timezone offsets, strip the zone.
				if (
					isAmbigTimezone &&
					!newProps.allDay &&
					(dateDelta || durationDelta)
				) {
					newProps.start.stripZone();
					if (newProps.end) {
						newProps.end.stripZone();
					}
				}

				$.extend(event, miscProps, newProps); // copy over misc props, then date-related props
				backupEventDates(event); // regenerate internal _start/_end/_allDay

				undoFunctions.push(function() {
					$.extend(event, oldProps);
					backupEventDates(event); // regenerate internal _start/_end/_allDay
				});
			});

			return function() {
				for (var i = 0; i < undoFunctions.length; i++) {
					undoFunctions[i]();
				}
			};
		}


		/* Business Hours
		-----------------------------------------------------------------------------------------*/

		t.getBusinessHoursEvents = getBusinessHoursEvents;


		// Returns an array of events as to when the business hours occur in the given view.
		// Abuse of our event system :(
		function getBusinessHoursEvents(wholeDay) {
			var optionVal = options.businessHours;
			var defaultVal = {
				className: 'fc-nonbusiness',
				start: '09:00',
				end: '17:00',
				dow: [ 1, 2, 3, 4, 5 ], // monday - friday
				rendering: 'inverse-background'
			};
			var view = t.getView();
			var eventInput;

			if (optionVal) { // `true` (which means "use the defaults") or an override object
				eventInput = $.extend(
					{}, // copy to a new object in either case
					defaultVal,
					typeof optionVal === 'object' ? optionVal : {} // override the defaults
				);
			}

			if (eventInput) {

				// if a whole-day series is requested, clear the start/end times
				if (wholeDay) {
					eventInput.start = null;
					eventInput.end = null;
				}

				return expandEvent(
					buildEventFromInput(eventInput),
					view.start,
					view.end
				);
			}

			return [];
		}


		/* Overlapping / Constraining
		-----------------------------------------------------------------------------------------*/

		t.isEventSpanAllowed = isEventSpanAllowed;
		t.isExternalSpanAllowed = isExternalSpanAllowed;
		t.isSelectionSpanAllowed = isSelectionSpanAllowed;


		// Determines if the given event can be relocated to the given span (unzoned start/end with other misc data)
		function isEventSpanAllowed(span, event) {
			var source = event.source || {};
			var constraint = firstDefined(
				event.constraint,
				source.constraint,
				options.eventConstraint
			);
			var overlap = firstDefined(
				event.overlap,
				source.overlap,
				options.eventOverlap
			);
			return isSpanAllowed(span, constraint, overlap, event);
		}


		// Determines if an external event can be relocated to the given span (unzoned start/end with other misc data)
		function isExternalSpanAllowed(eventSpan, eventLocation, eventProps) {
			var eventInput;
			var event;

			// note: very similar logic is in View's reportExternalDrop
			if (eventProps) {
				eventInput = $.extend({}, eventProps, eventLocation);
				event = expandEvent(buildEventFromInput(eventInput))[0];
			}

			if (event) {
				return isEventSpanAllowed(eventSpan, event);
			}
			else { // treat it as a selection

				return isSelectionSpanAllowed(eventSpan);
			}
		}


		// Determines the given span (unzoned start/end with other misc data) can be selected.
		function isSelectionSpanAllowed(span) {
			return isSpanAllowed(span, options.selectConstraint, options.selectOverlap);
		}


		// Returns true if the given span (caused by an event drop/resize or a selection) is allowed to exist
		// according to the constraint/overlap settings.
		// `event` is not required if checking a selection.
		function isSpanAllowed(span, constraint, overlap, event) {
			var constraintEvents;
			var anyContainment;
			var peerEvents;
			var i, peerEvent;
			var peerOverlap;

			// the range must be fully contained by at least one of produced constraint events
			if (constraint != null) {

				// not treated as an event! intermediate data structure
				// TODO: use ranges in the future
				constraintEvents = constraintToEvents(constraint);

				anyContainment = false;
				for (i = 0; i < constraintEvents.length; i++) {
					if (eventContainsRange(constraintEvents[i], span)) {
						anyContainment = true;
						break;
					}
				}

				if (!anyContainment) {
					return false;
				}
			}

			peerEvents = t.getPeerEvents(span, event);

			for (i = 0; i < peerEvents.length; i++)  {
				peerEvent = peerEvents[i];

				// there needs to be an actual intersection before disallowing anything
				if (eventIntersectsRange(peerEvent, span)) {

					// evaluate overlap for the given range and short-circuit if necessary
					if (overlap === false) {
						return false;
					}
					// if the event's overlap is a test function, pass the peer event in question as the first param
					else if (typeof overlap === 'function' && !overlap(peerEvent, event)) {
						return false;
					}

					// if we are computing if the given range is allowable for an event, consider the other event's
					// EventObject-specific or Source-specific `overlap` property
					if (event) {
						peerOverlap = firstDefined(
							peerEvent.overlap,
							(peerEvent.source || {}).overlap
							// we already considered the global `eventOverlap`
						);
						if (peerOverlap === false) {
							return false;
						}
						// if the peer event's overlap is a test function, pass the subject event as the first param
						if (typeof peerOverlap === 'function' && !peerOverlap(event, peerEvent)) {
							return false;
						}
					}
				}
			}

			return true;
		}


		// Given an event input from the API, produces an array of event objects. Possible event inputs:
		// 'businessHours'
		// An event ID (number or string)
		// An object with specific start/end dates or a recurring event (like what businessHours accepts)
		function constraintToEvents(constraintInput) {

			if (constraintInput === 'businessHours') {
				return getBusinessHoursEvents();
			}

			if (typeof constraintInput === 'object') {
				return expandEvent(buildEventFromInput(constraintInput));
			}

			return clientEvents(constraintInput); // probably an ID
		}


		// Does the event's date range fully contain the given range?
		// start/end already assumed to have stripped zones :(
		function eventContainsRange(event, range) {
			var eventStart = event.start.clone().stripZone();
			var eventEnd = t.getEventEnd(event).stripZone();

			return range.start >= eventStart && range.end <= eventEnd;
		}


		// Does the event's date range intersect with the given range?
		// start/end already assumed to have stripped zones :(
		function eventIntersectsRange(event, range) {
			var eventStart = event.start.clone().stripZone();
			var eventEnd = t.getEventEnd(event).stripZone();

			return range.start < eventEnd && range.end > eventStart;
		}


		t.getEventCache = function() {
			return cache;
		};

	}


	// Returns a list of events that the given event should be compared against when being considered for a move to
	// the specified span. Attached to the Calendar's prototype because EventManager is a mixin for a Calendar.
	Calendar.prototype.getPeerEvents = function(span, event) {
		var cache = this.getEventCache();
		var peerEvents = [];
		var i, otherEvent;

		for (i = 0; i < cache.length; i++) {
			otherEvent = cache[i];
			if (
				!event ||
				event._id !== otherEvent._id // don't compare the event to itself or other related [repeating] events
			) {
				peerEvents.push(otherEvent);
			}
		}

		return peerEvents;
	};


	// updates the "backup" properties, which are preserved in order to compute diffs later on.
	function backupEventDates(event) {
		event._allDay = event.allDay;
		event._start = event.start.clone();
		event._end = event.end ? event.end.clone() : null;
	}

	;;

	/* An abstract class for the "basic" views, as well as month view. Renders one or more rows of day cells.
	----------------------------------------------------------------------------------------------------------------------*/
	// It is a manager for a DayGrid subcomponent, which does most of the heavy lifting.
	// It is responsible for managing width/height.

	var BasicView = FC.BasicView = View.extend({

		dayGridClass: DayGrid, // class the dayGrid will be instantiated from (overridable by subclasses)
		dayGrid: null, // the main subcomponent that does most of the heavy lifting

		dayNumbersVisible: false, // display day numbers on each day cell?
		weekNumbersVisible: false, // display week numbers along the side?

		weekNumberWidth: null, // width of all the week-number cells running down the side

		headContainerEl: null, // div that hold's the dayGrid's rendered date header
		headRowEl: null, // the fake row element of the day-of-week header


		initialize: function() {
			this.dayGrid = this.instantiateDayGrid();
		},


		// Generates the DayGrid object this view needs. Draws from this.dayGridClass
		instantiateDayGrid: function() {
			// generate a subclass on the fly with BasicView-specific behavior
			// TODO: cache this subclass
			var subclass = this.dayGridClass.extend(basicDayGridMethods);

			return new subclass(this);
		},


		// Sets the display range and computes all necessary dates
		setRange: function(range) {
			View.prototype.setRange.call(this, range); // call the super-method

			this.dayGrid.breakOnWeeks = /year|month|week/.test(this.intervalUnit); // do before setRange
			this.dayGrid.setRange(range);
		},


		// Compute the value to feed into setRange. Overrides superclass.
		computeRange: function(date) {
			var range = View.prototype.computeRange.call(this, date); // get value from the super-method

			// year and month views should be aligned with weeks. this is already done for week
			if (/year|month/.test(range.intervalUnit)) {
				range.start.startOf('week');
				range.start = this.skipHiddenDays(range.start);

				// make end-of-week if not already
				if (range.end.weekday()) {
					range.end.add(1, 'week').startOf('week');
					range.end = this.skipHiddenDays(range.end, -1, true); // exclusively move backwards
				}
			}

			return range;
		},


		// Renders the view into `this.el`, which should already be assigned
		renderDates: function() {

			this.dayNumbersVisible = this.dayGrid.rowCnt > 1; // TODO: make grid responsible
			this.weekNumbersVisible = this.opt('weekNumbers');
			this.dayGrid.numbersVisible = this.dayNumbersVisible || this.weekNumbersVisible;

			this.el.addClass('fc-basic-view').html(this.renderSkeletonHtml());
			this.renderHead();

			this.scrollerEl = this.el.find('.fc-day-grid-container');

			this.dayGrid.setElement(this.el.find('.fc-day-grid'));
			this.dayGrid.renderDates(this.hasRigidRows());
		},


		// render the day-of-week headers
		renderHead: function() {
			this.headContainerEl =
				this.el.find('.fc-head-container')
					.html(this.dayGrid.renderHeadHtml());
			this.headRowEl = this.headContainerEl.find('.fc-row');
		},


		// Unrenders the content of the view. Since we haven't separated skeleton rendering from date rendering,
		// always completely kill the dayGrid's rendering.
		unrenderDates: function() {
			this.dayGrid.unrenderDates();
			this.dayGrid.removeElement();
		},


		renderBusinessHours: function() {
			this.dayGrid.renderBusinessHours();
		},


		// Builds the HTML skeleton for the view.
		// The day-grid component will render inside of a container defined by this HTML.
		renderSkeletonHtml: function() {
			return '' +
				'<table>' +
					'<thead class="fc-head">' +
						'<tr>' +
							'<td class="fc-head-container ' + this.widgetHeaderClass + '"></td>' +
						'</tr>' +
					'</thead>' +
					'<tbody class="fc-body">' +
						'<tr>' +
							'<td class="' + this.widgetContentClass + '">' +
								'<div class="fc-day-grid-container">' +
									'<div class="fc-day-grid"/>' +
								'</div>' +
							'</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>';
		},


		// Generates an HTML attribute string for setting the width of the week number column, if it is known
		weekNumberStyleAttr: function() {
			if (this.weekNumberWidth !== null) {
				return 'style="width:' + this.weekNumberWidth + 'px"';
			}
			return '';
		},


		// Determines whether each row should have a constant height
		hasRigidRows: function() {
			var eventLimit = this.opt('eventLimit');
			return eventLimit && typeof eventLimit !== 'number';
		},


		/* Dimensions
		------------------------------------------------------------------------------------------------------------------*/


		// Refreshes the horizontal dimensions of the view
		updateWidth: function() {
			if (this.weekNumbersVisible) {
				// Make sure all week number cells running down the side have the same width.
				// Record the width for cells created later.
				this.weekNumberWidth = matchCellWidths(
					this.el.find('.fc-week-number')
				);
			}
		},


		// Adjusts the vertical dimensions of the view to the specified values
		setHeight: function(totalHeight, isAuto) {
			var eventLimit = this.opt('eventLimit');
			var scrollerHeight;

			// reset all heights to be natural
			unsetScroller(this.scrollerEl);
			uncompensateScroll(this.headRowEl);

			this.dayGrid.removeSegPopover(); // kill the "more" popover if displayed

			// is the event limit a constant level number?
			if (eventLimit && typeof eventLimit === 'number') {
				this.dayGrid.limitRows(eventLimit); // limit the levels first so the height can redistribute after
			}

			scrollerHeight = this.computeScrollerHeight(totalHeight);
			this.setGridHeight(scrollerHeight, isAuto);

			// is the event limit dynamically calculated?
			if (eventLimit && typeof eventLimit !== 'number') {
				this.dayGrid.limitRows(eventLimit); // limit the levels after the grid's row heights have been set
			}

			if (!isAuto && setPotentialScroller(this.scrollerEl, scrollerHeight)) { // using scrollbars?

				compensateScroll(this.headRowEl, getScrollbarWidths(this.scrollerEl));

				// doing the scrollbar compensation might have created text overflow which created more height. redo
				scrollerHeight = this.computeScrollerHeight(totalHeight);
				this.scrollerEl.height(scrollerHeight);
			}
		},


		// Sets the height of just the DayGrid component in this view
		setGridHeight: function(height, isAuto) {
			if (isAuto) {
				undistributeHeight(this.dayGrid.rowEls); // let the rows be their natural height with no expanding
			}
			else {
				distributeHeight(this.dayGrid.rowEls, height, true); // true = compensate for height-hogging rows
			}
		},


		/* Hit Areas
		------------------------------------------------------------------------------------------------------------------*/
		// forward all hit-related method calls to dayGrid


		prepareHits: function() {
			this.dayGrid.prepareHits();
		},


		releaseHits: function() {
			this.dayGrid.releaseHits();
		},


		queryHit: function(left, top) {
			return this.dayGrid.queryHit(left, top);
		},


		getHitSpan: function(hit) {
			return this.dayGrid.getHitSpan(hit);
		},


		getHitEl: function(hit) {
			return this.dayGrid.getHitEl(hit);
		},


		/* Events
		------------------------------------------------------------------------------------------------------------------*/


		// Renders the given events onto the view and populates the segments array
		renderEvents: function(events) {
			this.dayGrid.renderEvents(events);

			this.updateHeight(); // must compensate for events that overflow the row
		},


		// Retrieves all segment objects that are rendered in the view
		getEventSegs: function() {
			return this.dayGrid.getEventSegs();
		},


		// Unrenders all event elements and clears internal segment data
		unrenderEvents: function() {
			this.dayGrid.unrenderEvents();

			// we DON'T need to call updateHeight() because:
			// A) a renderEvents() call always happens after this, which will eventually call updateHeight()
			// B) in IE8, this causes a flash whenever events are rerendered
		},


		/* Dragging (for both events and external elements)
		------------------------------------------------------------------------------------------------------------------*/


		// A returned value of `true` signals that a mock "helper" event has been rendered.
		renderDrag: function(dropLocation, seg) {
			return this.dayGrid.renderDrag(dropLocation, seg);
		},


		unrenderDrag: function() {
			this.dayGrid.unrenderDrag();
		},


		/* Selection
		------------------------------------------------------------------------------------------------------------------*/


		// Renders a visual indication of a selection
		renderSelection: function(span) {
			this.dayGrid.renderSelection(span);
		},


		// Unrenders a visual indications of a selection
		unrenderSelection: function() {
			this.dayGrid.unrenderSelection();
		}

	});


	// Methods that will customize the rendering behavior of the BasicView's dayGrid
	var basicDayGridMethods = {


		// Generates the HTML that will go before the day-of week header cells
		renderHeadIntroHtml: function() {
			var view = this.view;

			if (view.weekNumbersVisible) {
				return '' +
					'<th class="fc-week-number ' + view.widgetHeaderClass + '" ' + view.weekNumberStyleAttr() + '>' +
						'<span>' + // needed for matchCellWidths
							htmlEscape(view.opt('weekNumberTitle')) +
						'</span>' +
					'</th>';
			}

			return '';
		},


		// Generates the HTML that will go before content-skeleton cells that display the day/week numbers
		renderNumberIntroHtml: function(row) {
			var view = this.view;

			if (view.weekNumbersVisible) {
				return '' +
					'<td class="fc-week-number" ' + view.weekNumberStyleAttr() + '>' +
						'<span>' + // needed for matchCellWidths
							this.getCellDate(row, 0).format('w') +
						'</span>' +
					'</td>';
			}

			return '';
		},


		// Generates the HTML that goes before the day bg cells for each day-row
		renderBgIntroHtml: function() {
			var view = this.view;

			if (view.weekNumbersVisible) {
				return '<td class="fc-week-number ' + view.widgetContentClass + '" ' +
					view.weekNumberStyleAttr() + '></td>';
			}

			return '';
		},


		// Generates the HTML that goes before every other type of row generated by DayGrid.
		// Affects helper-skeleton and highlight-skeleton rows.
		renderIntroHtml: function() {
			var view = this.view;

			if (view.weekNumbersVisible) {
				return '<td class="fc-week-number" ' + view.weekNumberStyleAttr() + '></td>';
			}

			return '';
		}

	};

	;;

	/* A month view with day cells running in rows (one-per-week) and columns
	----------------------------------------------------------------------------------------------------------------------*/

	var MonthView = FC.MonthView = BasicView.extend({

		// Produces information about what range to display
		computeRange: function(date) {
			var range = BasicView.prototype.computeRange.call(this, date); // get value from super-method
			var rowCnt;

			// ensure 6 weeks
			if (this.isFixedWeeks()) {
				rowCnt = Math.ceil(range.end.diff(range.start, 'weeks', true)); // could be partial weeks due to hiddenDays
				range.end.add(6 - rowCnt, 'weeks');
			}

			return range;
		},


		// Overrides the default BasicView behavior to have special multi-week auto-height logic
		setGridHeight: function(height, isAuto) {

			isAuto = isAuto || this.opt('weekMode') === 'variable'; // LEGACY: weekMode is deprecated

			// if auto, make the height of each row the height that it would be if there were 6 weeks
			if (isAuto) {
				height *= this.rowCnt / 6;
			}

			distributeHeight(this.dayGrid.rowEls, height, !isAuto); // if auto, don't compensate for height-hogging rows
		},


		isFixedWeeks: function() {
			var weekMode = this.opt('weekMode'); // LEGACY: weekMode is deprecated
			if (weekMode) {
				return weekMode === 'fixed'; // if any other type of weekMode, assume NOT fixed
			}

			return this.opt('fixedWeekCount');
		}

	});

	;;

	fcViews.basic = {
		'class': BasicView
	};

	fcViews.basicDay = {
		type: 'basic',
		duration: { days: 1 }
	};

	fcViews.basicWeek = {
		type: 'basic',
		duration: { weeks: 1 }
	};

	fcViews.month = {
		'class': MonthView,
		duration: { months: 1 }, // important for prev/next
		defaults: {
			fixedWeekCount: true
		}
	};
	;;

	/* An abstract class for all agenda-related views. Displays one more columns with time slots running vertically.
	----------------------------------------------------------------------------------------------------------------------*/
	// Is a manager for the TimeGrid subcomponent and possibly the DayGrid subcomponent (if allDaySlot is on).
	// Responsible for managing width/height.

	var AgendaView = FC.AgendaView = View.extend({

		timeGridClass: TimeGrid, // class used to instantiate the timeGrid. subclasses can override
		timeGrid: null, // the main time-grid subcomponent of this view

		dayGridClass: DayGrid, // class used to instantiate the dayGrid. subclasses can override
		dayGrid: null, // the "all-day" subcomponent. if all-day is turned off, this will be null

		axisWidth: null, // the width of the time axis running down the side

		headContainerEl: null, // div that hold's the timeGrid's rendered date header
		noScrollRowEls: null, // set of fake row elements that must compensate when scrollerEl has scrollbars

		// when the time-grid isn't tall enough to occupy the given height, we render an <hr> underneath
		bottomRuleEl: null,
		bottomRuleHeight: null,


		initialize: function() {
			this.timeGrid = this.instantiateTimeGrid();

			if (this.opt('allDaySlot')) { // should we display the "all-day" area?
				this.dayGrid = this.instantiateDayGrid(); // the all-day subcomponent of this view
			}
		},


		// Instantiates the TimeGrid object this view needs. Draws from this.timeGridClass
		instantiateTimeGrid: function() {
			var subclass = this.timeGridClass.extend(agendaTimeGridMethods);

			return new subclass(this);
		},


		// Instantiates the DayGrid object this view might need. Draws from this.dayGridClass
		instantiateDayGrid: function() {
			var subclass = this.dayGridClass.extend(agendaDayGridMethods);

			return new subclass(this);
		},


		/* Rendering
		------------------------------------------------------------------------------------------------------------------*/


		// Sets the display range and computes all necessary dates
		setRange: function(range) {
			View.prototype.setRange.call(this, range); // call the super-method

			this.timeGrid.setRange(range);
			if (this.dayGrid) {
				this.dayGrid.setRange(range);
			}
		},


		// Renders the view into `this.el`, which has already been assigned
		renderDates: function() {

			this.el.addClass('fc-agenda-view').html(this.renderSkeletonHtml());
			this.renderHead();

			// the element that wraps the time-grid that will probably scroll
			this.scrollerEl = this.el.find('.fc-time-grid-container');

			this.timeGrid.setElement(this.el.find('.fc-time-grid'));
			this.timeGrid.renderDates();

			// the <hr> that sometimes displays under the time-grid
			this.bottomRuleEl = $('<hr class="fc-divider ' + this.widgetHeaderClass + '"/>')
				.appendTo(this.timeGrid.el); // inject it into the time-grid

			if (this.dayGrid) {
				this.dayGrid.setElement(this.el.find('.fc-day-grid'));
				this.dayGrid.renderDates();

				// have the day-grid extend it's coordinate area over the <hr> dividing the two grids
				this.dayGrid.bottomCoordPadding = this.dayGrid.el.next('hr').outerHeight();
			}

			this.noScrollRowEls = this.el.find('.fc-row:not(.fc-scroller *)'); // fake rows not within the scroller
		},


		// render the day-of-week headers
		renderHead: function() {
			this.headContainerEl =
				this.el.find('.fc-head-container')
					.html(this.timeGrid.renderHeadHtml());
		},


		// Unrenders the content of the view. Since we haven't separated skeleton rendering from date rendering,
		// always completely kill each grid's rendering.
		unrenderDates: function() {
			this.timeGrid.unrenderDates();
			this.timeGrid.removeElement();

			if (this.dayGrid) {
				this.dayGrid.unrenderDates();
				this.dayGrid.removeElement();
			}
		},


		renderBusinessHours: function() {
			this.timeGrid.renderBusinessHours();

			if (this.dayGrid) {
				this.dayGrid.renderBusinessHours();
			}
		},


		// Builds the HTML skeleton for the view.
		// The day-grid and time-grid components will render inside containers defined by this HTML.
		renderSkeletonHtml: function() {
			return '' +
				'<table>' +
					'<thead class="fc-head">' +
						'<tr>' +
							'<td class="fc-head-container ' + this.widgetHeaderClass + '"></td>' +
						'</tr>' +
					'</thead>' +
					'<tbody class="fc-body">' +
						'<tr>' +
							'<td class="' + this.widgetContentClass + '">' +
								(this.dayGrid ?
									'<div class="fc-day-grid"/>' +
									'<hr class="fc-divider ' + this.widgetHeaderClass + '"/>' :
									''
									) +
								'<div class="fc-time-grid-container">' +
									'<div class="fc-time-grid"/>' +
								'</div>' +
							'</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>';
		},


		// Generates an HTML attribute string for setting the width of the axis, if it is known
		axisStyleAttr: function() {
			if (this.axisWidth !== null) {
				 return 'style="width:' + this.axisWidth + 'px"';
			}
			return '';
		},


		/* Dimensions
		------------------------------------------------------------------------------------------------------------------*/


		updateSize: function(isResize) {
			this.timeGrid.updateSize(isResize);

			View.prototype.updateSize.call(this, isResize); // call the super-method
		},


		// Refreshes the horizontal dimensions of the view
		updateWidth: function() {
			// make all axis cells line up, and record the width so newly created axis cells will have it
			this.axisWidth = matchCellWidths(this.el.find('.fc-axis'));
		},


		// Adjusts the vertical dimensions of the view to the specified values
		setHeight: function(totalHeight, isAuto) {
			var eventLimit;
			var scrollerHeight;

			if (this.bottomRuleHeight === null) {
				// calculate the height of the rule the very first time
				this.bottomRuleHeight = this.bottomRuleEl.outerHeight();
			}
			this.bottomRuleEl.hide(); // .show() will be called later if this <hr> is necessary

			// reset all dimensions back to the original state
			this.scrollerEl.css('overflow', '');
			unsetScroller(this.scrollerEl);
			uncompensateScroll(this.noScrollRowEls);

			// limit number of events in the all-day area
			if (this.dayGrid) {
				this.dayGrid.removeSegPopover(); // kill the "more" popover if displayed

				eventLimit = this.opt('eventLimit');
				if (eventLimit && typeof eventLimit !== 'number') {
					eventLimit = AGENDA_ALL_DAY_EVENT_LIMIT; // make sure "auto" goes to a real number
				}
				if (eventLimit) {
					this.dayGrid.limitRows(eventLimit);
				}
			}

			if (!isAuto) { // should we force dimensions of the scroll container, or let the contents be natural height?

				scrollerHeight = this.computeScrollerHeight(totalHeight);
				if (setPotentialScroller(this.scrollerEl, scrollerHeight)) { // using scrollbars?

					// make the all-day and header rows lines up
					compensateScroll(this.noScrollRowEls, getScrollbarWidths(this.scrollerEl));

					// the scrollbar compensation might have changed text flow, which might affect height, so recalculate
					// and reapply the desired height to the scroller.
					scrollerHeight = this.computeScrollerHeight(totalHeight);
					this.scrollerEl.height(scrollerHeight);
				}
				else { // no scrollbars
					// still, force a height and display the bottom rule (marks the end of day)
					this.scrollerEl.height(scrollerHeight).css('overflow', 'hidden'); // in case <hr> goes outside
					this.bottomRuleEl.show();
				}
			}
		},


		// Computes the initial pre-configured scroll state prior to allowing the user to change it
		computeInitialScroll: function() {
			var scrollTime = moment.duration(this.opt('scrollTime'));
			var top = this.timeGrid.computeTimeTop(scrollTime);

			// zoom can give weird floating-point values. rather scroll a little bit further
			top = Math.ceil(top);

			if (top) {
				top++; // to overcome top border that slots beyond the first have. looks better
			}

			return top;
		},


		/* Hit Areas
		------------------------------------------------------------------------------------------------------------------*/
		// forward all hit-related method calls to the grids (dayGrid might not be defined)


		prepareHits: function() {
			this.timeGrid.prepareHits();
			if (this.dayGrid) {
				this.dayGrid.prepareHits();
			}
		},


		releaseHits: function() {
			this.timeGrid.releaseHits();
			if (this.dayGrid) {
				this.dayGrid.releaseHits();
			}
		},


		queryHit: function(left, top) {
			var hit = this.timeGrid.queryHit(left, top);

			if (!hit && this.dayGrid) {
				hit = this.dayGrid.queryHit(left, top);
			}

			return hit;
		},


		getHitSpan: function(hit) {
			// TODO: hit.component is set as a hack to identify where the hit came from
			return hit.component.getHitSpan(hit);
		},


		getHitEl: function(hit) {
			// TODO: hit.component is set as a hack to identify where the hit came from
			return hit.component.getHitEl(hit);
		},


		/* Events
		------------------------------------------------------------------------------------------------------------------*/


		// Renders events onto the view and populates the View's segment array
		renderEvents: function(events) {
			var dayEvents = [];
			var timedEvents = [];
			var daySegs = [];
			var timedSegs;
			var i;

			// separate the events into all-day and timed
			for (i = 0; i < events.length; i++) {
				if (events[i].allDay) {
					dayEvents.push(events[i]);
				}
				else {
					timedEvents.push(events[i]);
				}
			}

			// render the events in the subcomponents
			timedSegs = this.timeGrid.renderEvents(timedEvents);
			if (this.dayGrid) {
				daySegs = this.dayGrid.renderEvents(dayEvents);
			}

			// the all-day area is flexible and might have a lot of events, so shift the height
			this.updateHeight();
		},


		// Retrieves all segment objects that are rendered in the view
		getEventSegs: function() {
			return this.timeGrid.getEventSegs().concat(
				this.dayGrid ? this.dayGrid.getEventSegs() : []
			);
		},


		// Unrenders all event elements and clears internal segment data
		unrenderEvents: function() {

			// unrender the events in the subcomponents
			this.timeGrid.unrenderEvents();
			if (this.dayGrid) {
				this.dayGrid.unrenderEvents();
			}

			// we DON'T need to call updateHeight() because:
			// A) a renderEvents() call always happens after this, which will eventually call updateHeight()
			// B) in IE8, this causes a flash whenever events are rerendered
		},


		/* Dragging (for events and external elements)
		------------------------------------------------------------------------------------------------------------------*/


		// A returned value of `true` signals that a mock "helper" event has been rendered.
		renderDrag: function(dropLocation, seg) {
			if (dropLocation.start.hasTime()) {
				return this.timeGrid.renderDrag(dropLocation, seg);
			}
			else if (this.dayGrid) {
				return this.dayGrid.renderDrag(dropLocation, seg);
			}
		},


		unrenderDrag: function() {
			this.timeGrid.unrenderDrag();
			if (this.dayGrid) {
				this.dayGrid.unrenderDrag();
			}
		},


		/* Selection
		------------------------------------------------------------------------------------------------------------------*/


		// Renders a visual indication of a selection
		renderSelection: function(span) {
			if (span.start.hasTime() || span.end.hasTime()) {
				this.timeGrid.renderSelection(span);
			}
			else if (this.dayGrid) {
				this.dayGrid.renderSelection(span);
			}
		},


		// Unrenders a visual indications of a selection
		unrenderSelection: function() {
			this.timeGrid.unrenderSelection();
			if (this.dayGrid) {
				this.dayGrid.unrenderSelection();
			}
		}

	});


	// Methods that will customize the rendering behavior of the AgendaView's timeGrid
	var agendaTimeGridMethods = {


		// Generates the HTML that will go before the day-of week header cells
		renderHeadIntroHtml: function() {
			var view = this.view;
			var weekText;

			if (view.opt('weekNumbers')) {
				weekText = this.start.format(view.opt('smallWeekFormat'));

				return '' +
					'<th class="fc-axis fc-week-number ' + view.widgetHeaderClass + '" ' + view.axisStyleAttr() + '>' +
						'<span>' + // needed for matchCellWidths
							htmlEscape(weekText) +
						'</span>' +
					'</th>';
			}
			else {
				return '<th class="fc-axis ' + view.widgetHeaderClass + '" ' + view.axisStyleAttr() + '></th>';
			}
		},


		// Generates the HTML that goes before the bg of the TimeGrid slot area. Long vertical column.
		renderBgIntroHtml: function() {
			var view = this.view;

			return '<td class="fc-axis ' + view.widgetContentClass + '" ' + view.axisStyleAttr() + '></td>';
		},


		// Generates the HTML that goes before all other types of cells.
		// Affects content-skeleton, helper-skeleton, highlight-skeleton for both the time-grid and day-grid.
		renderIntroHtml: function() {
			var view = this.view;

			return '<td class="fc-axis" ' + view.axisStyleAttr() + '></td>';
		}

	};


	// Methods that will customize the rendering behavior of the AgendaView's dayGrid
	var agendaDayGridMethods = {


		// Generates the HTML that goes before the all-day cells
		renderBgIntroHtml: function() {
			var view = this.view;

			return '' +
				'<td class="fc-axis ' + view.widgetContentClass + '" ' + view.axisStyleAttr() + '>' +
					'<span>' + // needed for matchCellWidths
						(view.opt('allDayHtml') || htmlEscape(view.opt('allDayText'))) +
					'</span>' +
				'</td>';
		},


		// Generates the HTML that goes before all other types of cells.
		// Affects content-skeleton, helper-skeleton, highlight-skeleton for both the time-grid and day-grid.
		renderIntroHtml: function() {
			var view = this.view;

			return '<td class="fc-axis" ' + view.axisStyleAttr() + '></td>';
		}

	};

	;;

	var AGENDA_ALL_DAY_EVENT_LIMIT = 5;

	// potential nice values for the slot-duration and interval-duration
	// from largest to smallest
	var AGENDA_STOCK_SUB_DURATIONS = [
		{ hours: 1 },
		{ minutes: 30 },
		{ minutes: 15 },
		{ seconds: 30 },
		{ seconds: 15 }
	];

	fcViews.agenda = {
		'class': AgendaView,
		defaults: {
			allDaySlot: true,
			allDayText: 'all-day',
			slotDuration: '00:30:00',
			minTime: '00:00:00',
			maxTime: '24:00:00',
			slotEventOverlap: true // a bad name. confused with overlap/constraint system
		}
	};

	fcViews.agendaDay = {
		type: 'agenda',
		duration: { days: 1 }
	};

	fcViews.agendaWeek = {
		type: 'agenda',
		duration: { weeks: 1 }
	};
	;;

	return FC; // export for Node/CommonJS
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.weekend_workday = exports.national_holiday = undefined;

	var _moment = __webpack_require__(2);

	var _moment2 = _interopRequireDefault(_moment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var national_holiday = exports.national_holiday = [{
		title: '新年',
		start: (0, _moment2.default)('2016-02-08'),
		className: 'national'
	}, {
		title: '新年',
		start: (0, _moment2.default)('2016-02-09'),
		className: 'national'
	}, {
		title: '新年',
		start: (0, _moment2.default)('2016-02-10'),
		className: 'national'
	}, {
		title: '新年',
		start: (0, _moment2.default)('2016-02-11'),
		className: 'national'
	}, {
		title: '新年',
		start: (0, _moment2.default)('2016-02-12'),
		className: 'national'
	}, {
		title: '二二八補假',
		start: (0, _moment2.default)('2016-02-29'),
		className: 'national'
	}, {
		title: '清明節',
		start: (0, _moment2.default)('2016-04-04'),
		className: 'national'
	}, {
		title: '兒童節補假',
		start: (0, _moment2.default)('2016-04-05'),
		className: 'national'
	}, {
		title: '端午節',
		start: (0, _moment2.default)('2016-06-09'),
		className: 'national'
	}, {
		title: '彈性放假',
		start: (0, _moment2.default)('2016-06-10'),
		className: 'national'
	}, {
		title: '中秋節',
		start: (0, _moment2.default)('2016-09-15'),
		className: 'national'
	}, {
		title: '彈性放假',
		start: (0, _moment2.default)('2016-09-16'),
		className: 'national'
	}, {
		title: '雙十節',
		start: (0, _moment2.default)('2016-10-10'),
		className: 'national'
	}, {
		title: '元旦補假',
		start: (0, _moment2.default)('2017-01-02'),
		className: 'national'
	}, {
		title: '新年',
		start: (0, _moment2.default)('2017-01-27'),
		className: 'national'
	}, {
		title: '新年',
		start: (0, _moment2.default)('2017-01-28'),
		className: 'national'
	}, {
		title: '新年',
		start: (0, _moment2.default)('2017-01-29'),
		className: 'national'
	}, {
		title: '新年',
		start: (0, _moment2.default)('2017-01-30'),
		className: 'national'
	}, {
		title: '新年',
		start: (0, _moment2.default)('2017-01-31'),
		className: 'national'
	}, {
		title: '新年',
		start: (0, _moment2.default)('2017-02-01'),
		className: 'national'
	}, {
		title: '彈性放假',
		start: (0, _moment2.default)('2017-02-27'),
		className: 'national'
	}, {
		title: '二二八',
		start: (0, _moment2.default)('2017-02-28'),
		className: 'national'
	}, {
		title: '彈性放假',
		start: (0, _moment2.default)('2017-04-03'),
		className: 'national'
	}, {
		title: '兒童節',
		start: (0, _moment2.default)('2017-04-04'),
		className: 'national'
	}, {
		title: '清明節',
		start: (0, _moment2.default)('2017-04-05'),
		className: 'national'
	}, {
		title: '彈性放假',
		start: (0, _moment2.default)('2017-05-29'),
		className: 'national'
	}, {
		title: '端午節',
		start: (0, _moment2.default)('2017-05-30'),
		className: 'national'
	}, {
		title: '彈性放假',
		start: (0, _moment2.default)('2017-10-09'),
		className: 'national'
	}, {
		title: '雙十節',
		start: (0, _moment2.default)('2017-10-10'),
		className: 'national'
	}];

	var weekend_workday = exports.weekend_workday = ['2016-06-04', '2016-09-10'];

/***/ }
/******/ ]);