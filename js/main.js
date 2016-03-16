import * as Days from './Days.js';

var eventArray;
var hourArray;
var targetEvent;
var back2workStatus = 'all-day';

$(document).ready( () => {

	// Initialize FullCalendar
	const $calendar = $('#calendar');
	$calendar.fullCalendar({
		allDayDefault: true,
		eventClick(thisEvent,jsEvent,view) {
			targetEvent = thisEvent;
		},
		eventAfterAllRender(event) {
			$.each( $('.tenDays'), (index,element) => {
				$(element).children('.fc-content').append('<div class="arrow minus" data-move="minus"></div><div class="arrow plus" data-move="plus"></div><div class="event-background"></div>');
			});
			// Workday on the weekend
			$('.fc-day-number.fc-sat').each( (index,element) => {
				// Check whethe it's on the list
				if( Days.weekend_workday.indexOf( $(element).attr('data-date') ) > -1 && !$(element).hasClass('markWork') ) {
					// Mark it with .markWrok
					$(element).html( `<span class="weekendWork">補班</span> ${parseInt($(element).attr('data-date').substr(-2))}` )
						.addClass('markWork');
				}
			});
		}
	});

	// Initialize Pikaday
	let picker = new Pikaday({
		field: $('#datepicker')[0],
		format: 'YYYY-MM-DD',
	});

	$('.options').on( 'click', (e) => {
		$('.options').removeClass('valuable');
		$('.wave').removeClass('show');
		$(e.currentTarget).addClass('valuable');
		$(e.currentTarget).find('.wave').addClass('show');

		$('.day-value').text( $(e.currentTarget).attr('data-day') == 'all-day' ? '整天' : '半天' );
		back2workStatus = $(e.currentTarget).attr('data-day');
	});

	$('.ok').on( 'click', () => {

		if( $('#datepicker').val() == '' ) {
			alert('跟我說哪天退伍麻~');
		}
		else {

			// Get this from user
			let finalDay = moment( $('#datepicker').val() );
			eventArray = [
				{
					title: '退伍日',
					start: finalDay,
					className: 'retireDate',
				}
			];

			let lastEvent = finalDay;
			hourArray = [];
			for( let i = 0; i < 9; i++ ) {

				lastEvent = moment(lastEvent).add( -10, 'days' );
				lastEvent.makeOnWorkDay();

				let newEvent = {
					title: '*該上勤了吧',
					start: lastEvent,
					className: `tenDays event-${i}`,
				};
				eventArray.push(newEvent);

			};
			$calendar.fullCalendar( 'removeEvents' );
			$calendar.fullCalendar( 'addEventSource', eventArray );
			$calendar.fullCalendar( 'addEventSource', Days.national_holiday );
			setHourArray();

			$calendar.fullCalendar( 'gotoDate', finalDay );

			$('.overlay').fadeOut(300);

		}

	});

	// Arrows in Calendar
	$calendar.on( 'click', '.arrow', (e) => {
		e.stopPropagation();
		let eventOrdering = parseInt( targetEvent.className[1].substring(6,7) )+1;

		let move = $(e.currentTarget).attr('data-move');

		// Check minus or plus too much
		let actionPermission = 'OK';
		let preDate = eventArray[eventOrdering].start;
		if( move == 'minus' ) {
			// Prevent more then ten days
			// Should not be before this date
			let limitDate = moment(eventArray[eventOrdering-1].start).add( -10, 'days' );

			if( preDate.day() == 1 ) {
				if( meetWeekendWorkDay( moment(preDate).add( -2, 'days' ) ) == true ) {
					preDate = moment(preDate).add( -2, 'days' );
				}
				else {
					preDate = moment(preDate).add( -3, 'days' );
				}
			}
			else {
				preDate = moment(preDate).add( -1, 'days' );
			}
			let checkingHoliday = true;
			while( checkingHoliday ) {
				checkingHoliday = false;
				for( let i = 0; i < Days.national_holiday.length; i++ ) {
					if( preDate.isSame( Days.national_holiday[i].start ) ) {
						preDate = moment(preDate).add( -1, 'days' );
						checkingHoliday = true;
					}
				}
			}
			// Perhaps it's Sunday
			if( preDate.day() == 0 ) {
				preDate = moment(preDate).add( -2, 'days' );
			}

			if( preDate.isBefore(limitDate) ) {
				actionPermission = 'NOT ALLOWED';
				showDialog('left');
			}
		}
		else {
			// Prevent conflicts
			preDate = moment(preDate).add( 1, 'days' );
			preDate.makeOnWorkDay();
			if( preDate.isSame(eventArray[eventOrdering-1].start) ) {
				actionPermission = 'NOT ALLOWED';
				showDialog('right');
			}
		}

		if( actionPermission == 'OK' ) {
			for( let i = eventOrdering; i < 9+1; i++ ) {

				let updatedDate = eventArray[i].start;
				if( i == eventOrdering ) {
					updatedDate = preDate;
				}
				else {
					// after that event
					updatedDate = moment(eventArray[i-1].start).add( -10, 'days' );
				}
				updatedDate.makeOnWorkDay();

				eventArray[i].start = updatedDate;

			}
			$calendar.fullCalendar( 'removeEvents' );
			$calendar.fullCalendar( 'addEventSource', eventArray );
			$calendar.fullCalendar( 'addEventSource', Days.national_holiday );

			setHourArray();

		}
	}); // Arrows in Calendar -----

	// Get how many hours does user need
	$('#calendar').on( 'click', '.fc-event', () => {

		let neededHours = 0;

		// How many back-to-work events
		for( let i = 1; i < eventArray.length; i++ ) {
			if( targetEvent.start.isSameOrBefore( eventArray[i].start, 'day' ) ) {
				if( back2workStatus == 'half-day' ) {
					neededHours += 4;
				}
				// Don't plus (all-day work)
			}
			else { break; }
		}

		for( let i = 0; i < hourArray.length; i++ ) {
			if( targetEvent.start.isSameOrBefore( hourArray[i].start, 'day' ) ) {
				if( hourArray[i].title == '8hr' ) {
					neededHours += 8;
				}
			}
			else { break; }
		}

		$('.need-hours').text(neededHours);
		showDialog('hour');

	});

	// Trigger calendar to next/prev month
	$('.month-btn').on( 'click', (event) => {
		$calendar.fullCalendar( $(event.currentTarget).hasClass('prev') ? 'prev' : 'next' );
	});

	$('.setting-btn').on( 'click', () => {
		$('.overlay').fadeIn(500);
	});

});

var showDialog = (action) => {
	$('.alert').addClass(`show ${action}`);
	$('.dialog').addClass('bounceIn');

	$(document).on( 'keypress', (e) => {
		if( $('.alert').hasClass('show') && e.keyCode == 13 ) {
			$('.dialog .fine').trigger('click');
		}
	});

	$('.dialog .fine').on( 'click', (e) => {
		$(e.currentTarget).off('click');
		$(document).off('keypress');
		$('.alert').removeClass('show left right hour');
		$('.dialog').removeClass('bounceIn');
	});
}

var setHourArray = () => {

	// Reset hourArray
	hourArray = [];
	for( let i = 0; i < eventArray.length-1; i++ ) {
		let eventHead = eventArray[i].start;
		let eventTail = eventArray[i+1].start;

		for( let j = 1; j < eventHead.diff(eventTail, 'days'); j++ ) {
			let newStart = moment(eventHead).add( j*(-1), 'days' );
			let isThisHoliday = false;
			Days.national_holiday.map( (holiday) => {
				if( newStart.isSame( holiday.start ) ) {
					isThisHoliday = true;
				}
			});

			if( isThisHoliday == false ) {
				let newEvent = {
					title: (newStart.day() == 0 || newStart.day() == 6) && !meetWeekendWorkDay(newStart) ? '＊＊＊＊＊' : '8hr',
					start: newStart,
					className: 'hourDay'
				}
				hourArray.push(newEvent);
			}
		}
	}
	$('#calendar').fullCalendar( 'addEventSource', hourArray );

}

var meetWeekendWorkDay = (day) => Days.weekend_workday.indexOf(day.format('YYYY-MM-DD')) > -1 ? true : false;

Object.assign( moment.prototype, {

	makeOnWorkDay() {
		// Just plus day
		// 0 -> Sun. // 6 -> Sat.
		if( meetWeekendWorkDay(this) == false ) {
			if( this.day() == 0 ) {
				this.add( 1, 'days' );
			}
			else if ( this.day() == 6 ) {
				this.add( 2, 'days' );
			}
		}

		for( let k = 0; k < Days.national_holiday.length; k++ ) {
			if( this.isSame( Days.national_holiday[k].start ) ) {
				this.add( 1, 'days' );
				break;
			}
		}

		if( this.isThislegal() == false ) {
			this.makeOnWorkDay();
		}
	},

	isThislegal() {
		// Weekend
		if( meetWeekendWorkDay(this) == false ) {
			if( this.day() == 0 || this.day() == 6 ) {
				return false;
			}
		}

		// National holidays
		for( let k = 0; k < Days.national_holiday.length; k++ ) {
			if( this.isSame( Days.national_holiday[k].start ) ) {
				return false;
			}
		}

		return true;
	}

});
