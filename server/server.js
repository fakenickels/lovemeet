Meteor.publish('lovematches', function(){
	var userId = this.userId;
	
	return LoveMatches.find({
		$or: [{ first: userId }, { second: userId }]
	});
});