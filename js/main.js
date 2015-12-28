$(document).ready( function(){

	// Get this from user
	var finalDay = new Date('2016-05-27');
	var eventArray = [
		{
			title: "退伍日",
			start: moment("2016-05-27", "YYYY-MM-DD"),
			allDay: true,
			className: 'retireDate'
		}
	];

	for( i = 0; i < 5; i++ ) {
		var newEvent = {
			title: "*",
			start: finalDay.minusDays(),
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

// new custom function
Date.prototype.minusDays = function() {

	var date = new Date( this );
	date.setDate( date.getDate() - 10 );

	return date;

}

Date.prototype.yyyymmdd = function() {

	// year
	var yyyy = this.getFullYear().toString();
	// month
	var mm = this.getMonth() +1;
	mm = mm < 10 ? "0" + mm.toString() : mm.toString();
	// date
	var dd = this.getDate();
	dd = dd < 10 ? "0" + dd.toString() : dd.toString();

	return yyyy + "-" + mm + "-" + dd;

}