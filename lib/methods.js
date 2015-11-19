Meteor.methods({
	addHangout: function (eventData) {
		Hangouts.insert(eventData);
	},
	removeHangout: function (id) {
		Hangouts.remove(id);
	},
	removeAll: function () {
		Hangouts.remove({});
	}
});
