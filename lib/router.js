Router.configure({
	layoutTemplate: "layout",
	waitOn: function () {
		return Meteor.subscribe("hangouts");
	}
});

Router.route('/', function () {
	this.render("calendar");
});

Router.route('/messages', function () {
	this.render("messages");
});

Router.route('/profile', function () {
	this.render("profile");
});
