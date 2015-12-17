Hangouts = new Mongo.Collection("hangouts");

Hangouts.allow({
	insert: function (userId, doc) {
		return (userId
				&& doc.owner == userId);
	},
	update: function (userId, doc, fields, mod) {
		return (userId == doc.owner
				|| _.isEqual(mod, {$set: {guest: userId}})
				|| _.isEqual(mod, {$unset: {guest: ""}}));
	},
	remove: function (userId, doc) {
		return userId == doc.owner;
	},
	fetch: ['owner', 'guest']
});

Hangouts.deny({
	update: function (userId, doc, fields, mod) {
		return (_.contains(fields, 'owner')
				|| _.contains(fields, 'createdAt'));
	}
});
