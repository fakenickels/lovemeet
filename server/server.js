Meteor.publish('lovematches', function(){
	return LoveMatches.find({
		$or: [{ first: this.userId() }, { second: this.userId() }]
	});
});