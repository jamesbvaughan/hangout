Meteor.methods({
	"addHangout": function (title, start, end) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		Hangouts.insert({
			title: title,
			start: start,
			end: end,
			createdAt: new Date(),
			owner: this.userId
		});
	},
	"moveHangout": function (hangout, newStart, newEnd) {
		var hang = Hangouts.findOne(hangout);
		if (!this.userId || hang.owner != this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		Hangouts.update(hangout, {$set: {
			start: newStart,
			end: newEnd
		}});
	},
	"updateHangout": function (hangout, data) {
		var hang = Hangouts.findOne(hangout);
		if (!this.userId || hang.owner != this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		Hangouts.update(hangout, {$set: {
			title: data.title,
			start: data.start,
			end: data.end
		}});
	},
	"removeHangout": function (hangout) {
		var hang = Hangouts.findOne(hangout);
		if (!this.userId || hang.owner != this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		Hangouts.remove(hangout);
	},
	"joinHangout": function (hangout) {
		var hang = Hangouts.findOne(hangout);
		if (!this.userId || hang.owner == this.userId || hang.guest) {
			throw new Meteor.Error("not-authorized");
		}
		Hangouts.update(hangout, {$set: {
			guest: this.userId
		}});
	},
	"leaveHangout": function (hangout) {
		var hang = Hangouts.findOne(hangout);
		if (!this.userId || hang.owner == this.userId || hang.guest != this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		Hangouts.update(hangout, {$unset: {
			guest: ""
		}});
	}
});

