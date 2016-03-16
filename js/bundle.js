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

	var _Days = __webpack_require__(1);

	var Days = _interopRequireWildcard(_Days);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var eventArray;
	var hourArray;
	var targetEvent;
	var back2workStatus = 'all-day';

	$(document).ready(function () {

		// Initialize FullCalendar
		var $calendar = $('#calendar');
		$calendar.fullCalendar({
			allDayDefault: true,
			eventClick: function eventClick(thisEvent, jsEvent, view) {
				targetEvent = thisEvent;
			},
			eventAfterAllRender: function eventAfterAllRender(event) {
				$.each($('.tenDays'), function (index, element) {
					$(element).children('.fc-content').append('<div class="arrow minus" data-move="minus"></div><div class="arrow plus" data-move="plus"></div><div class="event-background"></div>');
				});
				// Workday on the weekend
				$('.fc-day-number.fc-sat').each(function (index, element) {
					// Check whethe it's on the list
					if (weekend_workday.indexOf($(element).attr('data-date')) > -1 && !$(element).hasClass('markWork')) {
						// Mark it with .markWrok
						$(element).html('<span class="weekendWork">補班</span> ' + parseInt($(element).attr('data-date').substr(-2))).addClass('markWork');
					}
				});
			}
		});

		// Initialize Pikaday
		var picker = new Pikaday({
			field: $('#datepicker')[0],
			format: 'YYYY-MM-DD'
		});

		$('.options').on('click', function (e) {
			$('.options').removeClass('valuable');
			$('.wave').removeClass('show');
			$(e.currentTarget).addClass('valuable');
			$(e.currentTarget).find('.wave').addClass('show');

			$('.day-value').text($(e.currentTarget).attr('data-day') == 'all-day' ? '整天' : '半天');
			back2workStatus = $(e.currentTarget).attr('data-day');
		});

		$('.ok').on('click', function () {

			if ($('#datepicker').val() == '') {
				alert('跟我說哪天退伍麻~');
			} else {

				// Get this from user
				var finalDay = moment($('#datepicker').val());
				eventArray = [{
					title: '退伍日',
					start: finalDay,
					className: 'retireDate'
				}];

				var lastEvent = finalDay;
				hourArray = [];
				for (var i = 0; i < 9; i++) {

					lastEvent = moment(lastEvent).add(-10, 'days');
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
				$calendar.fullCalendar('addEventSource', national_holiday);
				setHourArray();

				$calendar.fullCalendar('gotoDate', finalDay);

				$('.overlay').fadeOut(300);
			}
		});

		// Arrows in Calendar
		$calendar.on('click', '.arrow', function (e) {
			e.stopPropagation();
			var eventOrdering = parseInt(targetEvent.className[1].substring(6, 7)) + 1;

			var move = $(e.currentTarget).attr('data-move');

			// Check minus or plus too much
			var actionPermission = 'OK';
			var preDate = eventArray[eventOrdering].start;
			if (move == 'minus') {
				// Prevent more then ten days
				// Should not be before this date
				var limitDate = moment(eventArray[eventOrdering - 1].start).add(-10, 'days');

				if (preDate.day() == 1) {
					if (meetWeekendWorkDay(moment(preDate).add(-2, 'days')) == true) {
						preDate = moment(preDate).add(-2, 'days');
					} else {
						preDate = moment(preDate).add(-3, 'days');
					}
				} else {
					preDate = moment(preDate).add(-1, 'days');
				}
				var checkingHoliday = true;
				while (checkingHoliday) {
					checkingHoliday = false;
					for (var i = 0; i < national_holiday.length; i++) {
						if (preDate.isSame(national_holiday[i].start)) {
							preDate = moment(preDate).add(-1, 'days');
							checkingHoliday = true;
						}
					}
				}
				// Perhaps it's Sunday
				if (preDate.day() == 0) {
					preDate = moment(preDate).add(-2, 'days');
				}

				if (preDate.isBefore(limitDate)) {
					actionPermission = 'NOT ALLOWED';
					showDialog('left');
				}
			} else {
				// Prevent conflicts
				preDate = moment(preDate).add(1, 'days');
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
						updatedDate = moment(eventArray[i - 1].start).add(-10, 'days');
					}
					updatedDate.makeOnWorkDay();

					eventArray[i].start = updatedDate;
				}
				$calendar.fullCalendar('removeEvents');
				$calendar.fullCalendar('addEventSource', eventArray);
				$calendar.fullCalendar('addEventSource', national_holiday);

				setHourArray();
			}
		}); // Arrows in Calendar -----

		// Get how many hours does user need
		$('#calendar').on('click', '.fc-event', function () {

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

			$('.need-hours').text(neededHours);
			showDialog('hour');
		});

		// Trigger calendar to next/prev month
		$('.month-btn').on('click', function (event) {
			$calendar.fullCalendar($(event.currentTarget).hasClass('prev') ? 'prev' : 'next');
		});

		$('.setting-btn').on('click', function () {
			$('.overlay').fadeIn(500);
		});
	});

	var showDialog = function showDialog(action) {
		$('.alert').addClass('show ' + action);
		$('.dialog').addClass('bounceIn');

		$(document).on('keypress', function (e) {
			if ($('.alert').hasClass('show') && e.keyCode == 13) {
				$('.dialog .fine').trigger('click');
			}
		});

		$('.dialog .fine').on('click', function (e) {
			$(e.currentTarget).off('click');
			$(document).off('keypress');
			$('.alert').removeClass('show left right hour');
			$('.dialog').removeClass('bounceIn');
		});
	};

	var setHourArray = function setHourArray() {

		// Reset hourArray
		hourArray = [];
		for (var i = 0; i < eventArray.length - 1; i++) {
			var eventHead = eventArray[i].start;
			var eventTail = eventArray[i + 1].start;

			var _loop = function _loop(j) {
				var newStart = moment(eventHead).add(j * -1, 'days');
				var isThisHoliday = false;
				national_holiday.map(function (holiday) {
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
		$('#calendar').fullCalendar('addEventSource', hourArray);
	};

	var meetWeekendWorkDay = function meetWeekendWorkDay(day) {
		return weekend_workday.indexOf(day.format('YYYY-MM-DD')) > -1 ? true : false;
	};

	Object.assign(moment.prototype, {
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

			for (var k = 0; k < national_holiday.length; k++) {
				if (this.isSame(national_holiday[k].start)) {
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
			for (var k = 0; k < national_holiday.length; k++) {
				if (this.isSame(national_holiday[k].start)) {
					return false;
				}
			}

			return true;
		}
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var national_holiday = exports.national_holiday = [{
		title: '新年',
		start: moment('2016-02-08'),
		className: 'national'
	}, {
		title: '新年',
		start: moment('2016-02-09'),
		className: 'national'
	}, {
		title: '新年',
		start: moment('2016-02-10'),
		className: 'national'
	}, {
		title: '新年',
		start: moment('2016-02-11'),
		className: 'national'
	}, {
		title: '新年',
		start: moment('2016-02-12'),
		className: 'national'
	}, {
		title: '二二八補假',
		start: moment('2016-02-29'),
		className: 'national'
	}, {
		title: '清明節',
		start: moment('2016-04-04'),
		className: 'national'
	}, {
		title: '兒童節補假',
		start: moment('2016-04-05'),
		className: 'national'
	}, {
		title: '端午節',
		start: moment('2016-06-09'),
		className: 'national'
	}, {
		title: '彈性放假',
		start: moment('2016-06-10'),
		className: 'national'
	}, {
		title: '中秋節',
		start: moment('2016-09-15'),
		className: 'national'
	}, {
		title: '彈性放假',
		start: moment('2016-09-16'),
		className: 'national'
	}, {
		title: '雙十節',
		start: moment('2016-10-10'),
		className: 'national'
	}, {
		title: '元旦補假',
		start: moment('2017-01-02'),
		className: 'national'
	}, {
		title: '新年',
		start: moment('2017-01-27'),
		className: 'national'
	}, {
		title: '新年',
		start: moment('2017-01-28'),
		className: 'national'
	}, {
		title: '新年',
		start: moment('2017-01-29'),
		className: 'national'
	}, {
		title: '新年',
		start: moment('2017-01-30'),
		className: 'national'
	}, {
		title: '新年',
		start: moment('2017-01-31'),
		className: 'national'
	}, {
		title: '新年',
		start: moment('2017-02-01'),
		className: 'national'
	}, {
		title: '彈性放假',
		start: moment('2017-02-27'),
		className: 'national'
	}, {
		title: '二二八',
		start: moment('2017-02-28'),
		className: 'national'
	}, {
		title: '彈性放假',
		start: moment('2017-04-03'),
		className: 'national'
	}, {
		title: '兒童節',
		start: moment('2017-04-04'),
		className: 'national'
	}, {
		title: '清明節',
		start: moment('2017-04-05'),
		className: 'national'
	}, {
		title: '彈性放假',
		start: moment('2017-05-29'),
		className: 'national'
	}, {
		title: '端午節',
		start: moment('2017-05-30'),
		className: 'national'
	}, {
		title: '彈性放假',
		start: moment('2017-10-09'),
		className: 'national'
	}, {
		title: '雙十節',
		start: moment('2017-10-10'),
		className: 'national'
	}];

	var weekend_workday = exports.weekend_workday = ['2016-06-04', '2016-09-10'];

/***/ }
/******/ ]);