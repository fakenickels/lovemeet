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

    var data = Meteor.sync(function(done) {
		self.fb[method](query, function(err, res) {
			done(null, res);
		});
	});

	return data.result;
}

Facebook.prototype.getUserData = function(){
	return this.query('me');
}

Facebook.prototype.getFriends = function(){
	return this.query('me/friends?limit=5000')
}

Facebook.prototype.userPhoto = function( id ){
	if( !id ) return this.query('/me/picture');
	else return this.query('/' + id + '/picture');
} 

Meteor.methods({
	getUserData: function(){
		var fb = new Facebook(Meteor.user().services.facebook.accessToken),
			data = fb.getUserData();
		return data;
	},

	getFriends: function(){
		var fb = new Facebook(Meteor.user().services.facebook.accessToken),
			data = fb.getFriends();
			
		return data;
	},

	getUserPhoto: function( id ){
		var fb = new Facebook( Meteor.user().services.facebook.accessToken );

		if( id ) id =  Meteor.users.findOne( id ).facebook.id;

		return fb.getUserPhoto( ID );
	}
});