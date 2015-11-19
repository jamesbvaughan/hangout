Template.calendar.helpers({
	calendarOptions: function () {
		return {
			id: "main-calendar",
			defaultView: "agendaWeek",
			minTime: "07:00:00",
			selectable: true,
			selectHelper: true,
			select: function (start, end) {
				var title = prompt("Where to go?");
				var eventData;
				console.log("Trying to add event " + title + " starting at " + start.format() + " and ending at " + end.format());
				if (title) {
					eventData = {
						title: title,
						start: start,
						end: end
					};
					console.log("Made thing for event " + title + " starting at " + start.format() + " and ending at " + end.format());
					Meteor.call("addHangout", eventData);
					//$("#main-calendar").fullCalendar('renderEvent', eventData, true);
				}
				$("#main-calendar").fullCalendar("unselect");
			},
			editable: true
		};
	}
});
