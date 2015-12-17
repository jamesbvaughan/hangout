Hangouts = new Mongo.Collection("hangouts");

Hangouts.allow({
	insert: function (userId, doc) {
		return (userId && doc.owner == userId);
	},
	update: function (userId, doc, fields, mod) {
		var guesting = (userId && fields == ['guest'] && !doc.guest);
		return (userId == doc.owner || guesting);
	},
	remove: function (userId, doc) {
		return userId == doc.owner;
	},
	fetch: ['owner', 'guest']
});

Hangouts.deny({
	update: function (userId, doc, fields, mod) {
		return _.contains(fields, 'owner') || _.contains(fields, 'createdAt');
	}
});
