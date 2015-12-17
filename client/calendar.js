Template.calendar.helpers({
	calendarOptions: function () {
		return {
			id: "main-calendar",
			defaultView: "agendaWeek",
			minTime: "07:00:00",
			contentHeight: "auto",
			selectable: Meteor.userId(),
			selectHelper: true,
			select: function (start, end) {
				var title = prompt("Where to go?");
				if (title) {
					Hangouts.insert({
						title: title,
						start: start.toDate(),
						end: end.toDate(),
						createdAt: new Date(),
						owner: Meteor.userId()
					});
				}
				$("#main-calendar").fullCalendar("unselect");
			},
			views: {
				agendaWeek: {
					intervalStart: function () {
						return moment().stripTime();
					}
				}
			},
			eventDrop: function (event) {
				Hangouts.update(event.id, {$set: {
					start: event.start.toDate(),
					end: event.end.toDate()
				}});
			},
			eventResize: function (event) {
				Hangouts.update(event.id, {$set: {
					start: event.start.toDate(),
					end: event.end.toDate()
				}});
			},
			timezone: "local",
			allDaySlot: false,
			eventClick: function (event) {
				Session.set("selectedEvent", event.id);
			},
			eventColor: "#000000"
		};
	},
	isEventSelected: function () {
		return Hangouts.findOne(Session.get("selectedEvent"));
	},
	ownsSelectedEvent: function () {
		var event = Hangouts.findOne(Session.get("selectedEvent"));
		return Meteor.userId() && event.owner == Meteor.userId();
	},
	joinable: function () {
		var event = Hangouts.findOne(Session.get("selectedEvent"));
		return Meteor.userId() && event.owner != Meteor.userId() && !event.guest;
	},
	joined: function () {
		var event = Hangouts.findOne(Session.get("selectedEvent"));
		return Meteor.userId() && event.owner != Meteor.userId() && event.guest == Meteor.userId();
	},
	selectedTitle: function () {
		var selected = Session.get("selectedEvent");
		if (Hangouts.findOne(selected)) {
			return Hangouts.findOne(selected).title;
		} else {
			return "No event selected";
		}
	}
});

Template.calendar.onRendered(function () {
	updateCalendar();
});

function updateCalendar() {
	$("#main-calendar").fullCalendar("removeEvents");
	Hangouts.find().forEach(function (hang) {
		titleText = hang.title;
		if (hang.guest) {
			titleText = titleText + " (Guest Added)";
			if (hang.guest == Meteor.userId()) {
				titleText = titleText + " (You are the guest)";
			}
		}
		if (hang.owner == Meteor.userId()) {
			titleText = titleText + " (You are the owner)";
		}
		$("#main-calendar").fullCalendar(
			"renderEvent",
			{
				id: hang._id,
				title: titleText,
				start: moment(hang.start),
				end: moment(hang.end),
				editable: (Meteor.userId() && Meteor.userId() == hang.owner)
			},
			true);
	});
}

Tracker.autorun(updateCalendar);

Template.calendar.events({
	"click .delete": function () {
		Hangouts.remove(Session.get("selectedEvent"));
	},
	"click .join": function () {
		Hangouts.update(Session.get("selectedEvent"), {$set: {
			guest: Meteor.userId()
		}});
	},
	"click .leave": function () {
		Hangouts.update(Session.get("selectedEvent"), {$unset: {
			guest: ""
		}});
	}
});
