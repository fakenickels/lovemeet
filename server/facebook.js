function Facebook(accessToken) {
	this.fb = Meteor.require('fbgraph');
	this.accessToken = accessToken;
	this.fb.setAccessToken(this.accessToken);
		this.options = {
		timeout: 3000,
		pool: {maxSockets: Infinity},
		headers: {connection: "keep-alive"}
	}
	this.fb.setOptions(this.options);
}


Facebook.prototype.query = function(query, method){
	var self = this, 
		method = (typeof method === 'undefined') ? 'get' : method;

    var data = Meteor.sync(function(done){
		self.fb[method](query, function(err, res) {
			done(null, res);
		});
	});

	return data.result;
}

Facebook.prototype.getUserData = function(){
	return this.query('me');
}

Facebook.prototype.getFriends = function( limit, offset ){
	if( limit === undefined )
		return this.query('me/friends?limit=5000');
	else
		return this.query('me/friends?limit=' + limit + '&offset=' + offset);
}

Facebook.prototype.getAllFriends = function(){
	return this.query
}

Meteor.methods({
	getUserData: function(){
		var fb = new Facebook(Meteor.user().services.facebook.accessToken),
			data = fb.getUserData();
		return data;
	},

	getFriends: function( limit, offset ){
		var fb = new Facebook(Meteor.user().services.facebook.accessToken),
			data = fb.getFriends( limit, offset );
			
		return data;
	},

	verifyMatch: function( friendFbId ){
		var loverFbId = FacebookIds.getFbById( Meteor.userId() ),
			match = LoveMatches.findOne({ first: friendFbId, second: loverFbId });
			
		if( match ){
			LoveMatches.update(match._id, {
				$set: {
					matched: true
				}
			});
		}

		return match;	
	}
});