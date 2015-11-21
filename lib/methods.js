Meteor.methods({
	addHangout: function (title, start, end) {
		if (!Meteor.userId()) {
      		throw new Meteor.Error("not-authorized");
    	}
		Hangouts.insert({
			title: title,
			start: start,
			end: end,
			editable: false,
			createdAt: new Date(),
			owner: Meteor.userId()
		});
	},
	moveHangout: function (id, newStart, newEnd) {
		if (Meteor.userId() != Hangouts.findOne(id).owner) {
      		throw new Meteor.Error("not-authorized");
    	}
		Hangouts.update(id, {$set: {
			start: newStart,
			end: newEnd
		}});
	},
	removeHangout: function (id) {
		if (Meteor.userId() != Hangouts.findOne(id).owner) {
      		throw new Meteor.Error("not-authorized");
    	}
		Hangouts.remove(id);
	},
	removeAll: function () {
		Hangouts.remove({});
	}
});
