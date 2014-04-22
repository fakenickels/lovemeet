Handlebars.registerHelper('getUserPhoto', function( id ){
	return "http://graph.facebook.com/" + id + "/picture?height=200&type=normal&width=200"
});

Handlebars.registerHelper('matchesCounter', function(){
	return LoveMatches.find({ matched: true }).fetch().length;
});

Handlebars.registerHelper('notMatchedCounter', function(){
	return LoveMatches.find({ matched: false }).fetch().length;
});

Handlebars.registerHelper('checkLoveMatch', function(loveId){
	var match = LoveMatches.checkMatch( loveId );

	return match;
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
		if( !(/de|e/i).test( splited[1] ) ){
			return splited[ 0 ] + ' ' + splited[ 1 ];
		} else {
			return splited[ 0 ] + ' ' + splited[ 2 ];
		}
	} else {
		return name;
	}
});