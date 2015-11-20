Meteor.methods({
	addHangout: function (eventData) {
		Hangouts.insert(eventData);
	},
	moveHangout: function (id, start, end) {
		Hangouts.update(id, {$set: {
			start: start,
			end: end
		}});
	},
	removeHangout: function (id) {
		Hangouts.remove(id);
	},
	removeAll: function () {
		Hangouts.remove({});
	}
});
