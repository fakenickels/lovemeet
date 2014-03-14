Meteor.publish('lovematches', function(){
	var userId = this.userId, fbId = 0;

	if( Meteor.user() ) fbId = Meteor.users.findOne( userId ).fbId;
	
	return LoveMatches.find({
		$or: [{ first: fbId }, { second: fbId }]
	});
});