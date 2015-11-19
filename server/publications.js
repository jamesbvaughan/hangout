Meteor.publish("hangouts", function () {
	return Hangouts.find();
});
