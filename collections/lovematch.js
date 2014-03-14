LoveMatches = new Meteor.Collection('lovematches');

LoveMatches.getFbId = function( userID ){
	return Meteor.users.findOne( userID ).fbId;
}

LoveMatches.allow({
	insert: function(userID, lovematch){
		return !!userID;
	},

	update: function(userID, lovematch){
		var fbId = LoveMatches.getFbId( userID );

		return lovematch.second == fbId || lovematch.first == fbId;
	},

	remove: function(userID, lovematch){
		var fbId = LoveMatches.getFbId( userID );

		return lovematch.first == fbId || lovematch.second == fbId; 	
	}
});