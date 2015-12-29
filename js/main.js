$(document).ready( function(){

	// Initialize FullCalendar
	var $calendar = $('#calendar');
	$calendar.fullCalendar();

	// Initialize Pikaday
	var picker = new Pikaday({
		field: $('#datepicker')[0],
		format: 'YYYY-MM-DD'
	});

	$('.ok').on( 'click', function(){

		if( $('#datepicker').val() == "" ) {
			alert("好歹跟我說哪天退伍吧~");
		} else {

			// Get this from user
			var finalDay = moment( $('#datepicker').val() );
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
					title: "*該上勤了吧",
					start: lastEvent,
					allDay: true,
					className: 'tenDays'
				};
				eventArray.push(newEvent);

			};
			$calendar.fullCalendar( 'addEventSource', eventArray );

			$calendar.fullCalendar( 'gotoDate', finalDay );

			$('.overlay').fadeOut(300);

		}

	});

	// Trigger calendar to next/prev month
	$('.month-btn.prev').on( 'click', function(){
		$calendar.fullCalendar('prev');
	});
	$('.month-btn.next').on( 'click', function(){
		$calendar.fullCalendar('next');
	});

});