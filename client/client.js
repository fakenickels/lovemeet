Template.lovematches.user_matches = function(){
	return LoveMatches.find({}, { sorte: [{match: true}] });
}

Template.love_select.friends = function(){
	return Meteor.call('getUserFriends').data;
}