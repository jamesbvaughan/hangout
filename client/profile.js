Template.profile.helpers({
	name: function () {
		if (Meteor.user().profile) {
			return Meteor.user().profile.name;
		} else {
			return "Anon";
		}
	},
	numHangouts: function () {
		return Hangouts.find({owner: Meteor.user()._id}).count();
	},
	numJoined: function () {
		return Hangouts.find({guest: Meteor.user()._id}).count();
	}
});

Template.profile.events({
	"click .out": function () {
		if (confirm("Are you sure you want to log out?")) {
			console.log("logging out");
			Meteor.logout();
		} else {
			console.log("not logging out");
		}
	}
});
