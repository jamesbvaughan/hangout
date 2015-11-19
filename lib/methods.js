Meteor.methods({
	addHangout: function (eventData) {
		console.log("Added event: " + eventData.title);
		Hangouts.insert(eventData);
		console.log(Hangouts.find().fetch());
	},
	removeAll: function () {
		Hangouts.remove({});
	}
});
