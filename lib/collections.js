Hangouts = new Mongo.Collection("hangouts");

var guestRule = {
	type: "method",
	name: function (name) {
		return (name == "joinHangout" || name == "leaveHangout");
	}
};

DDPRateLimiter.addRule(guestRule, 1, 30000);
DDPRateLimiter.setErrorMessage(function (timeToReset) {
	$("#too-much").show();
	return "You're doing that too much.";
});
