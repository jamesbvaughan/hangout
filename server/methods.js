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
		var date = data.start.toDateString();
		Email.send({
			from:	"notification@hangout.jamesbvaughan.com",
			to:	Meteor.user().services.facebook.email,
			subject:	"You added a new hangout!",
			html:	"<h1>Next Steps</h1>" +
					"<p>You added a hangout on " + date + "! (" + data.title + ")</p>" +
					"<p>All you need to do now is sit back and wait for someone to join! Just make sure you don't plan anything else at that time. You should probably add it to your personal calendar so that you can remeber to keep that time open.</p>"
		});
	},
	"updateHangout": function (hangout, data) {
		var hang = Hangouts.findOne(hangout);
		if (!this.userId || hang.owner != this.userId || hang.guest) {
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
		if (hang.guest) {
			Email.send({
				from:	"notification@hangout.jamesbvaughan.com",
				to:	Meteor.users.findOne(hang.guest).services.facebook.email,
				subject:	"Someone cancelled a hangout that you joined.",
				html:	"<h1>Sad Day</h1>" +
						"<p>Someone cancelled a hangout on " + date + " that you had joined. (" + hang.title + ")</p>" +
						"<p>This is a bummer. Head over to <a href=\"http://hangout.jamesbvaughan.com/calendar\">the hangout calendar</a> to join another one.</p>"
			});
		}
	},
	"joinHangout": function (hangout) {
		var hang = Hangouts.findOne(hangout);
		if (!this.userId || hang.owner == this.userId || hang.guest) {
			throw new Meteor.Error("not-authorized");
		}
		Hangouts.update(hangout, {$set: {
			guest: this.userId
		}});
		var date = hang.start.toDateString();
		Email.send({
			from:	"notification@hangout.jamesbvaughan.com",
			to:	Meteor.user().services.facebook.email,
			subject:	"You joined a hangout!",
			html:	"<h1>Next Steps</h1>" +
					"<p>You joined a hangout on " + date + "! (" + hang.title + ")</p>" +
					"<p>All you need to do now is remember to show up and make sure you don't plan anything else at that time. You should probably add it to your personal calendar so that you can remeber to keep that time open.</p>"
		});
		Email.send({
			from:	"notification@hangout.jamesbvaughan.com",
			to:	 Meteor.users.findOne(hang.owner).services.facebook.email,
			subject:	"Someone joined your hangout!",
			html:	"<h1>Next Steps</h1>" +
					"<p>Someone joined your hangout on " + date + "! (" + hang.title + ")</p>" +
					"<p>All you need to do now is remember to show up and make sure you don't plan anything else at that time. You should probably add it to your personal calendar if you haven't already so that you can remeber to keep that time open.</p>"
		});
	},
	"leaveHangout": function (hangout) {
		var hang = Hangouts.findOne(hangout);
		if (!this.userId || hang.owner == this.userId || hang.guest != this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		Hangouts.update(hangout, {$unset: {
			guest: ""
		}});
		var ownerEmail = Meteor.users.findOne(hang.owner).services.facebook.email;
		Email.send({
			from:	"notification@hangout.jamesbvaughan.com",
			to:	 ownerEmail,
			subject:	"Someone left your hangout.",
			html:	"<h1>Sad Day</h1>" +
					"<p>Someone who had joined your hangout on " + date + " just left it. (" + hang.title + ")</p>" +
					"<p>This is unfortunate, but hopefully someone else will join. At this point you can either cancel the hangout by removing it <a href=\"http://hangout.jamesbvaughan.com/hangout/" + hangout + "\">here</a> or you can wait for someone else to join.</p>"
		});
	},
	"removeAllHangouts": function (pass) {
		// Please don't do this.
		if (pass == "bad password") {
			Hangouts.remove({});
		}
	}
});

