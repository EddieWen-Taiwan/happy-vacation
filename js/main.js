$(document).ready( function(){

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

	var lastEvent = moment(finalDay).add( -10, 'days' );
	for( i = 0; i < 9; i++ ) {
		var newEvent = {
			title: "*",
			start: lastEvent,
			allDay: true,
			className: 'tenDays'
		};
		eventArray.push(newEvent);

		lastEvent = moment(lastEvent).add( -10, 'days' );
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