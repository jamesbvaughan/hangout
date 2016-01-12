Meteor.methods({
	"addHangout": function (data) {
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
		Hangouts.remove(hangout);
	},
	"joinHangout": function (hangout) {
		var hang = Hangouts.findOne(hangout);
		Hangouts.update(hangout, {$set: {
			guest: Meteor.userId()
		}});
	},
	"leaveHangout": function (hangout) {
		var hang = Hangouts.findOne(hangout);
		Hangouts.update(hangout, {$unset: {
			guest: ""
		}});
	}
});
