var windowH;
var windowW;

$(document).ready( function(){

	windowW = $(window).width();
	windowH = $(window).height();

	// Get this from user
	var finalDay = new Date('2016/05/27');

	// Initialize calendar
	$('#calendar').fullCalendar({
		events: [
			{
				title: "退伍日",
				start: '2016/05/27',
				allDay: true,
				className: 'retireDate'
			}
		]
	});

	// Trigger calendar to next/prev month
	$('.month-btn.prev').on( 'click', function(){
		$('#calendar').fullCalendar('prev');
	});
	$('.month-btn.next').on( 'click', function(){
		$('#calendar').fullCalendar('next');
	});

	$('#calendar').fullCalendar('gotoDate', finalDay);

});

// new custom function
Date.prototype.minusDays = function(days) {

	var date = new Date( this.valueOf() );
	date.setDate( date.getDate() - days );

	return date;

}