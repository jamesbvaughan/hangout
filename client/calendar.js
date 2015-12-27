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
				Session.set("start", start.toDate());
				Session.set("end", end.toDate());
				$("#hangout-title").val('');
				$("#add-modal").modal("show");
			},
			eventDrop: function (event) {
				updateHangout(event);
			},
			eventResize: function (event) {
				updateHangout(event);
			},
			allDaySlot: false,
			timezone: "local",
			eventColor: "#cc99cc",
			eventClick: function (event) {
				Router.go("/hangout/" + event.id);
			}
		};
	}
});

Template.calendar.onRendered(updateCalendar);
Tracker.autorun(updateCalendar);

function updateHangout(event) {
	Meteor.call("updateHangout", event.id, {
		start: event.start.toDate(),
		end: event.end.toDate()
	});
}

function updateCalendar() {
	$("#main-calendar").fullCalendar("removeEvents");
	Hangouts.find().forEach(function (hang) {
		if (hang.owner == Meteor.userId() || hang.guest == Meteor.userId() || !hang.guest) {
			color = '#f2777a';
			if (hang.owner == Meteor.userId()) {
				color = '#cc99cc';
				if (hang.guest) {
					color = '#6699cc';
				}
			} else if (hang.guest == Meteor.userId()) {
				color = "#99cc99";
			}
			$("#main-calendar").fullCalendar(
				"renderEvent",
				{
					id: hang._id,
					title: hang.title,
					start: moment(hang.start),
					end: moment(hang.end),
					editable: (Meteor.userId() && Meteor.userId() == hang.owner),
					color: color,
					className: 'calEvent'
				},
				true);
		}
	});
}

Template.addHangoutModal.events({
	"submit form": function (event) {
		event.preventDefault();
		var title = event.target.title.value;
		if (title) {
			Meteor.call("addHangout", {
				title: title,
				start: Session.get("start"),
				end: Session.get("end")
			});
		}
		$("#add-modal").modal("hide");
		$("#main-calendar").fullCalendar("unselect");
	},
	"click .add-btn": function (event) {
		event.preventDefault();
		var title = $("#hangout-title").val();
		if (title) {
			Meteor.call("addHangout", {
				title: title,
				start: Session.get("start"),
				end: Session.get("end")
			});
		}
		$("#add-modal").modal("hide");
		$("#main-calendar").fullCalendar("unselect");
	},
	"shown.bs.modal #add-modal": function (event) {
		$("#hangout-title").focus();
	}

});
