LoveMatches = new Meteor.Collection('lovematches');

LoveMatches.allow({
	insert: function(userID, lovematch){
		return !!userID;
	},

	update: function(userID, lovematch){
		return lovematch.second == userID;
	},

	remove: function(userID, lovematch){
		return lovematch.first == userID || lovematch.second == userID; 	
	}
})