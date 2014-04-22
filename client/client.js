Meteor.subscribe('lovematches');
Meteor.subscribe('fbIds');

Template.lovematches.user_matches = function(){
	return LoveMatches.find({
		matched: true
	});
}

Deps.autorun(function(){
	var user = Meteor.user();
	if( user && !Session.get('bkp_friends') ){
		NProgress.start();

		Meteor.call('getUserData', function(err, result){	
			if(result === null ) return;

			Session.set('userFbId', result.id);

			if( !FacebookIds.findOne({fbId: result.id}) ){
				FacebookIds.insert({ userId: Meteor.userId(), fbId: result.id });
			}	
				
		});

		Meteor.call('getFriends', function(err, result){
			if( result === null ) return;
 
			if( err ) Session.set('friends', { error: err });
			else {
				Session.set('friends', result.data.slice(0,50));
				Session.set('bkp_friends', result.data);
				NProgress.done();
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

			if( search != '' )
				Session.set( 'friends', 
					_.filter(friends, function(friend){
						return friend.name.toLowerCase().indexOf(search) != -1;
					})
				);
			else
				Session.set('friends', Session.get('bkp_friends').slice(0,50));
		}
	},

	'click .i-love': function( e ){
		var secondID = this.id.toString();

		var love = {
				first: Session.get('userFbId'),
				second: secondID, 
				matched: false 
			};

		NProgress.start();
		Meteor.call('verifyMatch', secondID, function(err, match){
			if( err ){
				console.log('Error at verifying match', err);
				return false;
			}

			if( !match ){
				LoveMatches.insert( love );
			}

			NProgress.done();
		});
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
		if( !offset ) offset = 50;
		offset = ~~offset; 

		NProgress.start();
		Meteor.call('getFriends', 50, offset, function(err, result){
			Session.set('friends', result);
			Session.set('offset', offset+50);
			NProgress.done();
			console.log(result)
		});
	},


	'click #friends-nav-left': function(){
		var offset = Session.get('lastOffset');
		if( !offset ) offset = 799;
		offset = ~~offset; 

		Meteor.call('getFriends', 50, offset, function(err, result){
			Session.set('friends', result);
			Session.set('offset', offset-50);
		});
	}	
});


// Navigation events
Template.container.events({

	'click .nav-tabs li': function( e ){
		$('.nav-tabs li.active').removeClass('active');
		$( e.currentTarget ).addClass('active');
	},

	'click #love-select': function( e ){
		e.preventDefault();

		Session.set('friends', Session.get('bkp_friends').slice(0,50));
	},

	'click #show-matched': function( e ){
		e.preventDefault();
		
		var matchedIds = LoveMatches.getMatchedsFbId();

		Session.set('friends', _.filter(Session.get('bkp_friends'), function( friend ){
			return matchedIds.indexOf( friend.id ) != -1;
		}));
	},

	'click #show-not-matched': function(e){
		e.preventDefault();
		
		var matchedIds = LoveMatches.getNotMatchedsFbId();

		Session.set('friends', _.filter(Session.get('bkp_friends'), function( friend ){
			return matchedIds.indexOf( friend.id ) != -1;
		}));		
	}			
})
