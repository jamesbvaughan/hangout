Template.hangout.events({
	"click .delete": function () {
		if (confirm("For real?")) {
			Meteor.call("removeHangout", Session.get("selectedEvent"));
		}
		Router.go('/');
	},
	"click .edit": function () {
		Router.go("/hangout/" + Session.get("selectedEvent"));
	},
	"click .join": function () {
		Meteor.call("joinHangout", Session.get("selectedEvent"));
	},
	"click .leave": function () {
		Meteor.call("leaveHangout", Session.get("selectedEvent"));
	},
	"click .back": function () {
		Router.go('/');
	}
});

Template.hangout.helpers({
	ownsEvent: function (template) {
		console.log("YOOOOOO");
		console.table(Template.instance().data);
		console.log(template);
		return Meteor.userId() && Template.instance().data.owner == Meteor.userId();
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

Template.hangout.onRendered(function () {
	$(".datepicker").pickadate();
});
