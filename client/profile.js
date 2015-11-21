Template.profile.helpers({
	name:  Meteor.user().profile.name
});

Template.profile.events({
	"click .logout": function () {
		Meteor.logout();
	}
});
