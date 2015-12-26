Meteor.methods({
	"addHangout": function (data) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		check(data, {
			title: String,
			start: Date,
			end: Date
		});

		Hangouts.insert({
			title: data.title,
			start: data.start,
			end: data.end,
			createdAt: new Date(),
			owner: this.userId
		});
	},
	"updateHangout": function (hangout, data) {
		var hang = Hangouts.findOne(hangout);
		if (!this.userId || hang.owner != this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		check(data, {
			title: Match.Optional(String),
			start: Date,
			end: Date
		});

		if (data.title) {
			Hangouts.update(hangout, {$set: {
				title: data.title
			}});
		}
		Hangouts.update(hangout, {$set: {
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
	},
	"checkPassword": function (pass) {
		return pass == "sigmaetapi";
	}
});

