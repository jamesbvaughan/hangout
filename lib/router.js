Router.configure({
	layoutTemplate: "layout",
	waitOn: function () {
		return Meteor.subscribe("hangouts");
	}
});

Router.onBeforeAction(function () {
	if (Meteor.userId()) {
		this.next();
	} else {
		this.render('profile');
	}
}, {
	except: ['howto', 'login']
});

Router.route('/', function () {
	this.redirect('/calendar');
});

Router.route('/howto');
Router.route('/calendar');
Router.route('/profile');

Router.route('/login', {
	template: 'profile',
	name: 'login'
});

Router.route('/hangout/:_id', function () {
	this.render('hangout', {
		data: function () {
			return Hangouts.findOne(this.params._id);
		}
	});
});

Router.onStop(function () {
	if (slideout) {
		slideout.close();
	}
});
