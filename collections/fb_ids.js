FacebookIds = new Meteor.Collection('fbIds');

FacebookIds.findByFbId = function( id ){
	return FacebookIds.findOne({ userId: id }).fbId;
}

FacebookIds.getFbById = function( id ){
	return FacebookIds.findOne({userId: id}).fbId;
}


FacebookIds.allow({
	insert: function(userId, fb){
		return !!userId;
	},

	update: function(userId, fb){
		return fb.userId == userId; 
	},

	remove: function(userId, fb){
		return fb.userId == userId; 
	}
});