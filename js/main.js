var movedEvent;

$(document).ready( function(){

	// Initialize FullCalendar
	var $calendar = $('#calendar');
	$calendar.fullCalendar({
		eventClick: function( thisEvent, jsEvent, view ) {
			movedEvent = thisEvent;
		},
		eventAfterAllRender: function(event) {
			$.each( $('.tenDays'), function(){
				$(this).children('.fc-content').append('<div class="arrow minus" data-move="minus"></div><div class="arrow plus" data-move="plus"></div><div class="event-background"></div>');
			});
		}
	});

	// Arrows in Calendar
	$('#calendar').on( 'click', '.arrow', function(){
		var eventOrdering = movedEvent.className[1].substring(6,7);

		var move = $(this).attr('data-move');

		// var lastEvent = retireEvent.start;

		for( i = eventOrdering; i < 9; i++ ) {

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
				lastEvent.fixWeekend();

				var newEvent = {
					title: "*該上勤了吧",
					start: lastEvent,
					allDay: true,
					className: 'tenDays event-'+i
				};
				eventArray.push(newEvent);

			};
			$calendar.fullCalendar( 'removeEvents' );
			$calendar.fullCalendar( 'addEventSource', eventArray );

			$calendar.fullCalendar( 'gotoDate', finalDay );

			$('.overlay').fadeOut(300);

		}

	});

	// Trigger calendar to next/prev month
	$('.month-btn').on( 'click', function(){
		$calendar.fullCalendar( $(this).hasClass('prev') ? 'prev' : 'next' );
	});

	$('.setting-btn').on( 'click', function(){
		$('.overlay').fadeIn(500);
	});

});

moment.fn.fixWeekend = function() {
	// lastEvent.day()
	// 0 -> Sun. // 6 -> Sat.
	if( this.day() == 0 ) {
		this.add( 1, 'days' );
	} else if ( this.day() == 6 ) {
		this.add( 2, 'days' );
	}
}

