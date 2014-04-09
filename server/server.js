Meteor.publish('lovematches', function(){
	var userId = this.userId;

	if( userId ) fbId = FacebookIds.findOne({ userId: userId }).fbId;
	
	return LoveMatches.find({
		$or: [{ first: fbId }, { second: fbId }]
	});
});

Meteor.publish('fbIds', function(){
	var userId = this.userId;

	return FacebookIds.find({ userId: userId });
});