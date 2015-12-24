Router.configure({
	layoutTemplate: "layout",
	waitOn: function () {
		return Meteor.subscribe("hangouts");
	}
});

Router.route('/', function () {
	this.render("calendar");
});

Router.route('/messages');
Router.route('/profile');
Router.route('/howto');

Router.route('/hangout/:_id', function () {
	this.render('hangout', {
		data: function () {
			return Hangouts.findOne(this.params._id);
		}
	});
});
