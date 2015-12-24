Template.calendar.helpers({
	calendarOptions: function () {
		return {
			id: "main-calendar",
			defaultView: "agendaWeek",
			minTime: "07:00:00",
			contentHeight: "auto",
			selectable: Meteor.userId(),
			selectHelper: true,
			// views: {
			// 	agendaWeek: {
			// 		intervalStart: function () {
			// 			return moment().stripTime();
			// 		}
			// 	}
			// },
			select: function (start, end) {
				var title = prompt("What should this hangout be titled");
				if (title) {
					Meteor.call("addHangout", title, start.toDate(), end.toDate());
				}
				$("#main-calendar").fullCalendar("unselect");
			},
			eventDrop: function (event) {
				Meteor.call("moveHangout", event.id, event.start.toDate(), event.end.toDate());
			},
			eventResize: function (event) {
				Meteor.call("moveHangout", event.id, event.start.toDate(), event.end.toDate());
			},
			allDaySlot: false,
			timezone: "local",
			eventColor: "#000000",
			eventClick: function (event) {
				Router.go("/hangout/" + event.id);
			}
		};
	}
});

Template.calendar.onRendered(updateCalendar);
Tracker.autorun(updateCalendar);

function updateCalendar() {
	$("#main-calendar").fullCalendar("removeEvents");
	Hangouts.find().forEach(function (hang) {
		titleText = hang.title;
		color = '#f2777a';
		if (hang.owner == Meteor.userId()) {
			titleText = titleText + " (You are the owner)";
			color = '#cc99cc';
			if (hang.guest) {
				color = '#6699cc';
			}
		}
		if (hang.guest) {
			if (hang.guest == Meteor.userId()) {
				titleText = titleText + " (You are the guest)";
				color = '#99cc99';
			}
			titleText = titleText + " (Guest Added)";
		}
		$("#main-calendar").fullCalendar(
			"renderEvent",
			{
				id: hang._id,
				title: titleText,
				start: moment(hang.start),
				end: moment(hang.end),
				editable: (Meteor.userId() && Meteor.userId() == hang.owner),
				color: color,
				className: 'calEvent'
			},
			true);
	});
}
