$(document).ready(function() {
	// appends a <span> for each of the day from the fullCalendar table
	// the purpose of the <span> is to hold the total accumulated amount
	// of the day, based on the user input
	function appendDayTotal() {
      $("#calendar .fc-day").each(function() {
		$(this).append('<span></span>');
	  });
	}

    // we get access to the angular $scope variable
	$angularScope = angular.element('#controller').scope();

    // custom object calendar
	var calendar = {
	  // whenever a calendar day is being tapped from the table
	  // it will trigger a click event on the #add anchor
	  // gets the date and store it on the app_dialog.date
      dayIsClicked: function() {
        $('#add').trigger('click');
        $angularScope.app_dialog.date = $(this).attr('data-date');
      }
	};

    // add the leanModal whenever this anchor is being clicked
	$('#add').leanModal();  

    // creates the fullCaledar
	$("#calendar").fullCalendar({
      dayClick: calendar.dayIsClicked
	});

	$(".dialog button").click(function() {
	  $(".dialog").removeAttr("style");
	});

	$('.fc-toolbar button').bind('click', function() {
	  // we need to rerun this whenever the calendar buttons are being clicked
      appendDayTotal();
      // also this one in order to make sure that the total count will display
      $angularScope.app_calendar.retrieveData();
	});

    // run this command to append the day total count wrapper
	appendDayTotal();
});