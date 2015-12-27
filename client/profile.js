Template.profile.helpers({
	name: function () {
		if (Meteor.user().profile) {
			return Meteor.user().profile.name;
		} else {
			return "Anon";
		}
	},
	numHangouts: function () {
		return Hangouts.find({owner: Meteor.user()._id}).count();
	},
	numJoined: function () {
		return Hangouts.find({guest: Meteor.user()._id}).count();
	},
	allowed: function () {
		return Session.get("allowed");
	}
});

Template.profile.events({
	"submit form": function (event) {
		event.preventDefault();
		var pass = event.target.pass.value;
		Meteor.call("checkPassword", pass, function (err, val) {
			Session.set("allowed", val);
			if (!val) {
				$("#wrongPass").show();
			}
		});
	}
});

Template.profile.onRendered(function () {
	$("#wrongPass").hide();
});

Template.logoutModal.events({
	"click .logout-btn": function () {
		$("#logout-modal").modal("hide");
		Meteor.logout();
	}
});

