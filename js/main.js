$(document).ready( function(){

	// Get this from user
	var finalDay = new Date('2016/05/27');
	var eventArray = [
		{
			title: "退伍日",
			start: '2016/05/27',
			allDay: true,
			className: 'retireDate'
		}
	];

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

// new custom function
Date.prototype.minusDays = function(days) {

	var date = new Date( this.valueOf() );
	date.setDate( date.getDate() - days );

	return date;

}