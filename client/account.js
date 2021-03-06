Template.account.helpers({
	name: function () {
		if (Meteor.user().account) {
			return Meteor.user().account.name;
		} else {
			return "Anon";
		}
	},
	numHangouts: function () {
		return Hangouts.find({owner: Meteor.user()._id}).count();
	},
	numJoined: function () {
		return Hangouts.find({guest: Meteor.user()._id}).count();
	}
});

Template.account.events({
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

Template.logoutModal.events({
	"click .logout-btn": function () {
		$("#logout-modal").modal("hide");
		Meteor.logout();
	}
});

