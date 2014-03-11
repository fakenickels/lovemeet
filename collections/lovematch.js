LoveMatches = new Meteor.Collection('lovematches');

LoveMatches.allow({
	insert: function(userID, lovematch){
		return userID && (lovematch.first == userID || lovematch.second == userID);
	},

	update: function(){
		return false;
	},

	remove: function(userID, lovematch){
		return lovematch.first == userID || lovematch.second == userID; 	
	}
})