Template.profile.helpers({
	name: function () {
		return Meteor.user().profile.name
	}
});

Template.profile.events({
	"click .logout": function () {
		Meteor.logout();
	}
});
