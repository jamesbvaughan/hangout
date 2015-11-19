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
				console.log("Trying to add event " + title +
							" starting at " + start.format() +
							" and ending at " + end.format());
				if (title) {
					eventData = {
						title: title,
						start: start.toDate(),
						end: end.toDate()
					};
					console.log("Made thing for event " + title +
								" starting at " + start.format() +
								" and ending at " + end.format());
					Meteor.call("addHangout", eventData);
					console.log("CLIENT: " + Hangouts.find().fetch())
					console.log(Hangouts.find().fetch())
					//$("#main-calendar").fullCalendar('renderEvent', eventData, true);
				}
				$("#main-calendar").fullCalendar("unselect");
			},
			editable: true,
			timezone: "local"
		};
	},
	events: function () {
		return Hangouts.find().fetch();
	}
});

Template.calendar.onRendered(function () {
	updateCalendar();
});

function updateCalendar() {
	$("#main-calendar").fullCalendar("removeEvents");
	Hangouts.find().forEach(function (hang) {
		$("#main-calendar").fullCalendar(
			"renderEvent",
			{
				title: hang.title,
				start: moment(hang.start),
				end: moment(hang.end)
			},
			true);
	});
}

Tracker.autorun(updateCalendar);

Template.event.events({
	"click .delete": function () {
		Meteor.call("removeHangout", this._id);
	}
});
