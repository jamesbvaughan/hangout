Template.hangout.events({
	"click .delete": function () {
		if (confirm("For real?")) {
			Meteor.call("removeHangout", this._id);
		}
		Router.go('/');
	},
	"click .join": function () {
		Meteor.call("joinHangout", Session.get("selectedEvent"));
	},
	"click .leave": function () {
		Meteor.call("leaveHangout", Session.get("selectedEvent"));
	},
	"click .back": function () {
		Router.go('/');
	},
	"submit form": function (event) {
		event.preventDefault();
		var data = event.target;
		var title = data.title.value;
		var date = data.date.value;
		var startVal = data.start.value;
		var endVal = data.end.value;
		var newStart = moment(date + " " + startVal, "D MMMM, YYYY h:mm A");
		var newEnd = moment(date + " " + endVal, "D MMMM, YYYY h:mm A");
		Meteor.call("updateHangout", this._id, {
			title: title,
			start: newStart.toDate(),
			end: newEnd.toDate()
		});
		$(".saved").append("Saved Successfully!");
	}
});

Template.hangout.helpers({
	ownsEvent: function () {
		return Meteor.userId() && this.owner == Meteor.userId();
	},
	joinable: function () {
		return Meteor.userId() && this.owner != Meteor.userId() && !this.guest;
	},
	joined: function () {
		return Meteor.userId() && this.owner != Meteor.userId() && this.guest == Meteor.userId();
	},
	startPlaceholder: function () {
		var date = moment(this.start);
		return date.format("h:mm A");
	},
	endPlaceholder: function () {
		var date = moment(this.end);
		return date.format("h:mm A");
	},
	datePlaceholder: function () {
		var months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		];
		var date = this.start;
		var monthNum = date.getMonth();
		return (date.getDate() + " " + months[monthNum] + ", " + date.getFullYear());
	}
});

Template.hangout.onRendered(function () {
	$(".datepicker").pickadate({
		min: true,
		max: 50
	});
	$(".startpicker").pickatime({
		min: [7,0],
		max: [23,0]
	});
	$(".endpicker").pickatime({
		min: this.data.start
	});
});
