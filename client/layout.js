Template.layout.onRendered(function () {
	var template = this;
	slideout = new Slideout({
		'panel': template.$(".content").get(0),
		'menu': template.$("#slideout-menu").get(0),
		'padding': 256,
		'tolerance': 70
	});
});

Template.layout.events({
	"click .toggle-button": function () {
		slideout.toggle();
	},
	"click #howto-link": function () {
		Router.go("/howto");
	},
	"click #calendar-link": function () {
		Router.go("/calendar");
	},
	"click #profile-link": function () {
		Router.go("/profile");
	},
	"click #login-link": function () {
		Router.go("/login");
	}
});
