Meteor.publish('lovematches', function(){
	var userId = this.userId;

	if( userId ) fbId = Meteor.users.findOne( userId ).fbId;
	
	return LoveMatches.find({
		$or: [{ first: fbId }, { second: fbId }]
	});
});