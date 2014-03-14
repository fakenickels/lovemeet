Meteor.subscribe('lovematches');

if( Meteor.isClient ){
	Handlebars.registerHelper('getUserPhoto', function( id ){
		return "http://graph.facebook.com/" + id + "/picture?height=200&type=normal&width=200"
	});

	Handlebars.registerHelper('matchesCounter', function(){
		
	});
	
	Handlebars.registerHelper('checkLoveMatch', function(id){
		var match = LoveMatches.find({ $or: [{first: id}, {matched: true}]});

		return match.fetch();
	});

	Handlebars.registerHelper('userHasLoved', function(id){
		var match = LoveMatches.find({first: Session.get('userFbId'), second: id, matched: false});

		return match.fetch();
	});	

	Handlebars.registerHelper('fbLink', function(id){
		return 'https://www.facebook.com/' + id;
	});

	Handlebars.registerHelper('shrinkName', function( name ){
		var splited = name.split(' ');

		if( splited.length > 2 ){
			return splited[ 0 ] + ' ' + splited[ 1 ];
		} else {
			return name;
		}
	});

	Template.lovematches.user_matches = function(){
		return LoveMatches.find({
			matched: true
		});
	}

	Deps.autorun(function(){
		var user = Meteor.user();
		if( user && !Session.get('bkp_friends') ){
			Meteor.call('getUserData', function(err, result){
				Session.set('userFbId', result.id);

				if( !Meteor.user().fbId ){
					Meteor.users.update( Meteor.user()._id, { $set: { fbId: result.id } } );
				}				
			});

			Meteor.call('getFriends', function(err, result){
				if( err ) Session.set('friends', { error: err });
				else {
					Session.set('friends', result.data.slice(0,50));
					Session.set('bkp_friends', result.data);
				}
			});		
		}
	});

	Template.love_select.friends = function(){
		return Session.get('friends');
	}

	Template.header.events({
		'click #fbLogin': function(){
			Meteor.loginWithFacebook({
				'requestPermissions': ['user_friends']
			}, function(err, data){
				if(err) Session.set('errorMessage', err.reason || 'Unknown error');
			})
		}
	});

	Template.love_select.events({
		'keypress #love-search': function(e){
			if( e.keyCode === 13 ){//
				e.preventDefault();

				var friends = Session.get('bkp_friends'),
					search = $('#love-search').val().toLowerCase();

				Session.set( 'friends', 
					_.filter(friends, function(friend){
						return friend.name.toLowerCase().indexOf(search) != -1;
					})
				);
			}//

			// Template.love_select({ friends: friends });
		},

		'click .i-love': function( e ){
			var secondID = this.id;

			var isMatch = LoveMatches.findOne({ first: ''+secondID, second: Session.get('userFbId') }); 

			if( isMatch ){
				LoveMatches.update(isMatch._id, { $set: { matched: true } });
				$( e.toElement ).text('É um encontro!')
			} else {
				LoveMatches.insert({
					first: Session.get('userFbId'),
					second: ''+secondID,
					matched: false 
				});
			}
		},

		'click .i-unlove': function(){
			var secondID = this.id,
				unlove = LoveMatches.findOne({ 
					second: secondID, 
					matched: false 
				});


			if( unlove ){
				LoveMatches.remove(unlove._id);
			}
		},

		'click #friends-nav-right': function(){
			var offset = Session.get('lastOffset');
			if( !offset ) offset = 800;
			offset = ~offset; 
 
			Meteor.call('getFriends', 50, offset, function(err, result){
				Session.set('friends', result);
				Session.set('offset', offset+50);
			});
		},


		'click #friends-nav-left': function(){
			var offset = Session.get('lastOffset');
			if( !offset ) offset = 799;
			offset = ~offset; 
 
			Meteor.call('getFriends', 50, offset, function(err, result){
				Session.set('friends', result);
				Session.set('offset', offset-50);
			});
		}		
	})
}