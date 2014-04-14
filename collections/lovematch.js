LoveMatches = new Meteor.Collection('lovematches');

LoveMatches.getFbId = function( userID ){
	return FacebookIds.findOne({ userId: userID }).fbId;
}

LoveMatches.checkMatch = function( loveId ){
	var match = LoveMatches.findOne({
		$or: [
			{first: loveId, matched: true}, {second: loveId, matched: true}
		]
	});

	return match;
}

LoveMatches.findMatched = function(){
	return LoveMatches.find({ matched: true }).fetch();
}

LoveMatches.getMatchedsFbId = function(){
	var userFbId = LoveMatches.getFbId( Meteor.userId() ),
		
		matchedIds = _.map( LoveMatches.findMatched(), function( love ){
			var lovedId = love.first == userFbId ? love.second : love.first;

			return lovedId; 
		});

	return matchedIds;
} 

LoveMatches.findNotMatched = function(){
	return LoveMatches.find({ matched: false }).fetch();
}

LoveMatches.getNotMatchedsFbId = function(){
	var userFbId = LoveMatches.getFbId( Meteor.userId() ),
		matchedIds = _.map( LoveMatches.findNotMatched(), function( love ){
			var lovedId = love.first == userFbId ? love.second : love.first;

			return lovedId; 
		}); 

	return matchedIds;
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