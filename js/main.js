$(document).ready( function(){

	var picker = new Pikaday({
		field: $('#datepicker')[0],
		format: 'YYYY-MM-DD',
		onSelect: function() {
			console.log(this.getMoment().format('Do MMMM YYYY'));
		}
	});

	// Get this from user
	var finalDay = moment('2016-05-27');
	var eventArray = [
		{
			title: "退伍日",
			start: finalDay,
			allDay: true,
			className: 'retireDate'
		}
	];

	var lastEvent = finalDay;
	for( i = 0; i < 9; i++ ) {

		lastEvent = moment(lastEvent).add( -10, 'days' );
		// lastEvent.day()
		// 0 -> Sun. // 6 -> Sat.
		if ( lastEvent.day() == 0 ) {
			lastEvent = moment(lastEvent).add( 1, 'days' );
		} else if ( lastEvent.day() == 6 ) {
			lastEvent = moment(lastEvent).add( 2, 'days' );
		}

		var newEvent = {
			title: "*",
			start: lastEvent,
			allDay: true,
			className: 'tenDays'
		};
		eventArray.push(newEvent);

	};

	// Initialize calendar
	var $calendar = $('#calendar');
	$calendar.fullCalendar({
		events: eventArray
	});

	// Trigger calendar to next/prev month
	$('.month-btn.prev').on( 'click', function(){
		$calendar.fullCalendar('prev');
	});
	$('.month-btn.next').on( 'click', function(){
		$calendar.fullCalendar('next');
	});

	$calendar.fullCalendar('gotoDate', finalDay);

});