var windowH;
var windowW;

$(document).ready( function(){

	windowW = $(window).width();
	windowH = $(window).height();

	// Initialize calendar
	$('#calendar').fullCalendar({});

	// Trigger calendar to next/prev month
	$('.month-btn.prev').on( 'click', function(){
		$('#calendar').fullCalendar('prev');
	});
	$('.month-btn.next').on( 'click', function(){
		$('#calendar').fullCalendar('next');
	});

	var finalDay = new Date('2016/05/27');

});

// new custom function
Date.prototype.minusDays = function(days) {

	var date = new Date( this.valueOf() );
	date.setDate( date.getDate() - days );

	return date;

}