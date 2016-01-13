var eventArray;
var hourArray;
var targetEvent;
var back2workStatus = "all-day";
var national_holiday = [
	{
		title: "新年",
		start: moment('2016-02-08'),
		className: "national"
	},
	{
		title: "新年",
		start: moment('2016-02-09'),
		className: "national"
	},
	{
		title: "新年",
		start: moment('2016-02-10'),
		className: "national"
	},
	{
		title: "新年",
		start: moment('2016-02-11'),
		className: "national"
	},
	{
		title: "新年",
		start: moment('2016-02-12'),
		className: "national"
	},
	{
		title: "228補假",
		start: moment('2016-02-29'),
		className: "national"
	},
	{
		title: "清明節",
		start: moment('2016-04-04'),
		className: "national"
	},
	{
		title: "兒童節補假",
		start: moment('2016-04-05'),
		className: "national"
	},
	{
		title: "端午節",
		start: moment('2016-06-09'),
		className: "national"
	},
	{
		title: "彈性放假",
		start: moment('2016-06-10'),
		className: "national"
	},
	{
		title: "中秋節",
		start: moment('2016-09-15'),
		className: "national"
	},
	{
		title: "彈性放假",
		start: moment('2016-09-16'),
		className: "national"
	},
	{
		title: "雙十節",
		start: moment('2016-10-10'),
		className: "national"
	}
];

$(document).ready( function(){

	// Initialize FullCalendar
	var $calendar = $('#calendar');
	$calendar.fullCalendar({
		allDayDefault: true,
		eventClick: function( thisEvent, jsEvent, view ) {
			targetEvent = thisEvent;
		},
		eventAfterAllRender: function(event) {
			$.each( $('.tenDays'), function(){
				$(this).children('.fc-content').append('<div class="arrow minus" data-move="minus"></div><div class="arrow plus" data-move="plus"></div><div class="event-background"></div>');
			});
		}
	});

	// Initialize Pikaday
	var picker = new Pikaday({
		field: $('#datepicker')[0],
		format: 'YYYY-MM-DD'
	});

	$('.options').on( 'click', function(){
		$('.options').removeClass('valuable');
		$('.wave').removeClass('show');
		$(this).addClass('valuable');
		$(this).find('.wave').addClass('show');

		$('.day-value').text( $(this).attr('data-day') == "all-day" ? "整天" : "半天" );
		back2workStatus = $(this).attr('data-day');
	});

	$('.ok').on( 'click', function(){

		if( $('#datepicker').val() == "" ) {
			alert("跟我說哪天退伍麻~");
		} else {

			// Get this from user
			var finalDay = moment( $('#datepicker').val() );
			eventArray = [
				{
					title: "退伍日",
					start: finalDay,
					className: "retireDate"
				}
			];

			var lastEvent = finalDay;
			hourArray = [];
			for( i = 0; i < 9; i++ ) {

				// * Stort lastEvent first.
				var hourStart = moment(lastEvent);

				lastEvent = moment(lastEvent).add( -10, 'days' );
				var fixedDays = lastEvent.makeOnWorkDay();

				var newEvent = {
					title: "*該上勤了吧",
					start: lastEvent,
					className: "tenDays event-"+i
				};
				eventArray.push(newEvent);

			};
			$calendar.fullCalendar( 'removeEvents' );
			$calendar.fullCalendar( 'addEventSource', eventArray );
			$calendar.fullCalendar( 'addEventSource', national_holiday );
			setHourArray();

			$calendar.fullCalendar( 'gotoDate', finalDay );

			$('.overlay').fadeOut(300);

		}

	});

	// Arrows in Calendar
	$calendar.on( 'click', '.arrow', function(e){
		e.stopPropagation();
		var eventOrdering = parseInt( targetEvent.className[1].substring(6,7) )+1;

		var move = $(this).attr('data-move');

		// Check minus or plus too much
		var actionPermission = "OK";
		var preDate = eventArray[eventOrdering].start;
		if( move == "minus" ) {
			// Prevent more then ten days
			// Should not be before this date
			var limitDate = moment(eventArray[eventOrdering-1].start).add( -10, 'days' );

			preDate = moment(preDate).add( preDate.day() == 1 ? -3 : -1, 'days' );
			if( preDate.isBefore(limitDate) ) {
				actionPermission = "NOT ALLOWED";
				showDialog('left');
			}
		} else {
			// Prevent conflicts
			preDate = moment(preDate).add( 1, 'days' );
			preDate.makeOnWorkDay();
			if( preDate.isSame(eventArray[eventOrdering-1].start) ) {
				actionPermission = "NOT ALLOWED";
				showDialog('right');
			}
		}

		if( actionPermission == "OK" ) {
			for( i = eventOrdering; i < 9+1; i++ ) {

				var updatedDate = eventArray[i].start;
				if( i == eventOrdering ) {
					// From Mon. to Fri.
					var dayToMove = 1;
					if( move == "minus" ) {
						dayToMove = updatedDate.day() == 1 ? -3 : -1;
					}
					// Event be moved
					updatedDate = moment(updatedDate).add( dayToMove, 'days' );
				} else {
					// after that event
					updatedDate = moment(eventArray[i-1].start).add( -10, 'days' );
				}
				updatedDate.makeOnWorkDay();

				eventArray[i].start = updatedDate;

			}
			$calendar.fullCalendar( 'removeEvents' );
			$calendar.fullCalendar( 'addEventSource', eventArray );

			setHourArray();

		}
	}); // Arrows in Calendar -----

	// Get how many hours does user need
	$('#calendar').on( 'click', '.fc-event', function(){

		var neededHours = 0;

		// How many back-to-work events
		for( i = 1; i < eventArray.length; i++ ) {
			if( targetEvent.start.isSameOrBefore( eventArray[i].start, 'day' ) ) {
				if( back2workStatus == "half-day" ) {
					neededHours += 4;
				}
				// Don't plus (all-day work)
			} else {
				break;
			}
		}

		for( i = 0; i < hourArray.length; i++ ) {
			if( targetEvent.start.isSameOrBefore( hourArray[i].start, 'day' ) ) {
				if( hourArray[i].title == "8hr" ) {
					neededHours += 8;
				}
			} else {
				break;
			}
		}

		$('.need-hours .value').text(neededHours);
		showDialog('hour');

	});

	// Trigger calendar to next/prev month
	$('.month-btn').on( 'click', function(){
		$calendar.fullCalendar( $(this).hasClass('prev') ? 'prev' : 'next' );
	});

	$('.setting-btn').on( 'click', function(){
		$('.overlay').fadeIn(500);
	});

});

function showDialog( action ) {
	$('.alert').addClass('show ' + action);
	$('.dialog').addClass('bounceIn');

	$('.dialog .fine').on( 'click', function(){
		$('.alert').removeClass('show left right hour');
		$('.dialog').removeClass('bounceIn');
		$(this).off('click');
	});
}

function setHourArray( hourStart ) {

	// Reset hourArray
	hourArray = [];
	for( i = 0; i < eventArray.length-1; i++ ) {
		var eventHead = eventArray[i].start;
		var eventTail = eventArray[i+1].start;

		for( j = 1; j < eventHead.diff(eventTail, 'days'); j++ ) {
			var newStart = moment(eventHead).add( j*(-1), 'days' );
			var isThisHoliday = false;
			national_holiday.map( function(holiday) {
				if( newStart.isSame( holiday.start ) )
					isThisHoliday = true;
			});

			if( isThisHoliday == false ) {
				var newEvent = {
					title: newStart.day() == 0 || newStart.day() == 6 ? "＊＊＊＊＊" : "8hr",
					start: newStart,
					className: "hourDay"
				}
				hourArray.push(newEvent);
			}
		}
	}
	$('#calendar').fullCalendar( 'addEventSource', hourArray );

}

moment.fn.makeOnWorkDay = function() {
	// lastEvent.day()
	// 0 -> Sun. // 6 -> Sat.
	var fixedDays = 0;

	if( this.day() == 0 ) {
		fixedDays = 1;
	} else if ( this.day() == 6 ) {
		fixedDays = 2;
	}
	this.add( fixedDays, 'days' );

	fixedDays = 0;
	for( k = 0; k < national_holiday.length; k++ ) {
		if( this.isSame( national_holiday[k].start ) ) {
			fixedDays = 1;
			break;
		}
	}
	this.add( fixedDays, 'days' );

	if( this.isThislegal() ) {
		return fixedDays;
	} else
		this.makeOnWorkDay();

}

moment.fn.isThislegal = function() {

	// Weekend
	if( this.day() == 0 || this.day() == 6 ) {
		return false;
	}

	// National holidays
	for( k = 0; k < national_holiday.length; k++ ) {
		if( this.isSame( national_holiday[k].start ) ) {
			return false;
		}
	}

	return true;

}

