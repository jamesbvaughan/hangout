Template.temp.events({
	"submit form": function (event) {
		event.preventDefault();
		var pass = event.target.pass.value;
		Meteor.call("checkPassword", pass, function (err, val) {
			if (val) {
				Router.go("/login", {
					pass: pass
				});
			} else {
				$("#wrongPass").append("Whoops, that wasn't correct!");
			}
		});
	}
});
