Meteor.subscribe('lovematches');

if( Meteor.isClient ){
	Handlebars.registerHelper('getUserPhoto', function( id ){
		return "http://graph.facebook.com/" + id + "/picture?height=200&type=normal&width=200"
	});

	Template.lovematches.user_matches = function(){
		return LoveMatches.find({}, { sorte: [{match: true}] });
	}

	Deps.autorun(function(){
		if( Meteor.user() ){
			Meteor.call('getFriends', function(err, result){
				if( err ) Session.set('friends', { error: err });
				else {
					Session.set('friends', result.data);
					Session.set('bkp_friends', result.data);
				}
			});		
		}			
	})

	Template.love_select.friends = function(){
		return Session.get('friends');
	}

	Template.love_select.events({
		'keypress #love-search': function(e){
			if( e.keyCode === 13 ){
				e.preventDefault();

				var friends = Session.get('bkp_friends'),
					search = $('#love-search').val().toLowerCase();
				Session.set( 'friends', 
					_.filter(friends, function(friend){
						return friend.name.toLowerCase().indexOf(search) != -1;
					})
				);
			}

			// Template.love_select({ friends: friends });
		},

		'click .i-love': function(){
			var secondID = this.id;

			Meteor.call('getUserData', function(err, result){
				var isMatch = LoveMatches.findOne({ first: secondID, second: result.id }); 

				if( isMatch ){
					LoveMatches.update(isMatch._id, { $set: { matched: true } });
				} else {
					LoveMatches.insert({
						first: result.id,
						second: secondID,
						matched: false 
					});
				}
			});
		}
	})
}