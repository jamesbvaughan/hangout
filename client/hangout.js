Template.hangout.events({
	"click .join": function () {
		Meteor.call("joinHangout", this._id);
	},
	"click .leave": function () {
		Meteor.call("leaveHangout", this._id);
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
		$(".saved").show();
	}
});

Template.hangout.helpers({
	ownsEvent: function () {
		return Meteor.userId() && this.owner == Meteor.userId() && !this.guest;
	},
	joinable: function () {
		return Meteor.userId() && this.owner != Meteor.userId() && !this.guest;
	},
	joined: function () {
		return Meteor.userId() && this.owner != Meteor.userId() && this.guest == Meteor.userId();
	},
	start: function () {
		return moment(this.start).format("h:mm A");
	},
	end: function () {
		return moment(this.end).format("h:mm A");
	},
	date: function () {
		return moment(this.start).format("DD MMMM, YYYY");
	},
	fancyDate: function () {
		return moment(this.start).format("MMMM Do, YYYY");
	},
	tooMuch: function () {
		return "You're doing that too much! Try again in a few minutes.";
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
	$(".saved").hide();
	$("#too-much").hide();
	Session.set("selectedHangout", this.data._id);
});

Template.deleteModal.events({
	"click .delete-btn": function () {
		var hangout = Session.get("selectedHangout");
		Meteor.call("removeHangout", hangout);
		Router.go('/');
	}
});
