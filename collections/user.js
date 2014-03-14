Meteor.users.allow({
	update: function( userId, user ){
		return userId === user._id;
	}
})