(function(){

////////////
// Models //
/******************************************************************************/

	var User = Backbone.Model.extend({
		urlRoot: '/user',
		defaults: {
			name: '',
			email: ''
		}
	});

	var Song = Backbone.Model.extend({
		defaults: {
			trackInfo: {}
		}
	});

/*____________________________________________________________________________*/


/////////////////
// Collections //
/******************************************************************************/

	// Holds the models for each search result song
	var searchResultsCollection = Backbone.Collection.extend({
		model: Song,
		addSong: function(trackInfo){
			// Add default artwork if none provided
			if(!trackInfo.artwork_url){
				trackInfo.artwork_url = "images/no_art.png";
			}

			var newModel = new Song({
				trackInfo: trackInfo
			});
			this.add(newModel);
		}
	});


	// Holds the models for each playlist song
	var playlistCollection = Backbone.Collection.extend({
		model: Song,
		addSong: function(trackInfo){
			// Add default artwork if none provided
			if(!trackInfo.artwork_url){
				trackInfo.artwork_url = "images/no_art.png";
			}

			var newModel = new Song({
				trackInfo: trackInfo
			});
			this.add(newModel);
		},
		nextTrack: function(){
			this.remove(this.first());
		}
	});

/*____________________________________________________________________________*/


///////////
// Views //
/******************************************************************************/

	// View for the search input box
	var SearchView = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		render: function(){
			var template = _.template( $("#search-template").html(), {} );
			this.$el.html( template );
		},
		addResult: function(){
			var self = this;

			// remove all songs from collection
			self.options.songCollection.reset();

			// Use timeout to prevent request on ever single keystroke
			clearTimeout(this.delayer);
			this.delayer = setTimeout(function(){
				$('#search-results').html("Searching...");

				// make search query to soundcloud
				var queryString = $('#search-input').val();
				SC.get('/tracks', { q: queryString }, function(tracks) {
					for(var i=0; i<tracks.length; i++){
						self.options.songCollection.addSong(tracks[i]);
					}
				});
			}, 400);
		},
		events: {
			"keyup #search-input": "addResult"
		}
	});



	// View for a single search result
	var SongView = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		render: function(){
			var templateData = {
				isSearchResult: this.options.isSearchResult,
				trackInfo: this.options.trackInfo
			};
			var template = _.template( $("#song-template").html(), templateData );
			$(this.el).html(template);
		},
		events: {
			"click": "selectSong"
		},
		selectSong: function(){
			if(this.options.isSearchResult){
				playlist.addSong(this.options.trackInfo);
			}
		}
	});


	// View for the search results list
	var SearchResultsView = Backbone.View.extend({
		initialize: function(){
			this.collection.on('add', this.render, this);
			this.collection.on('remove', this.render, this);
			this.collection.on('reset', this.render, this);
		},
		render: function(){
			var self = this;
			// clear the list dom elements
			this.$el.html("");

			var songList = this.collection.toJSON();

			// Print each song to result list
			_.each(songList, function(song, i){
				var result = new SongView({
					trackInfo: song.trackInfo,
					isSearchResult: true
				});

				self.$el.append( result.el );
			});

		}
	});


	// View for the playlist
	var PlaylistView = Backbone.View.extend({
		initialize: function(){
			this.collection.on('add', this.render, this);
			this.collection.on('remove', this.render, this);
			this.collection.on('reset', this.render, this);
		},
		render: function(){
			var self = this;
			// clear the list dom elements
			this.$el.html("");

			var songList = this.collection.toJSON();

			// clear player if playlist empty
			if(songList.length === 0){
				$('#player').html("");
			}

			// Print each song to result list
			_.each(songList, function(song, i){
				// If first track, send to player
				if( i===0 ){
					if(thePlayer.options.trackInfo !== song.trackInfo){
						thePlayer.options.trackInfo = song.trackInfo;
						thePlayer.render();
					}
				}else{
					var result = new SongView( {trackInfo: song.trackInfo} );
					self.$el.append( result.el );
				}
			});

		}
	});


	// View for the music player
	var PlayerView = Backbone.View.extend({
		render: function(){
			var self = this;
			var templateData = {
				trackInfo: this.options.trackInfo
			};
			var template = _.template( $("#player-template").html(), templateData );
			this.$el.html(template);

			// Load the stream
			SC.stream("/tracks/"+this.options.trackInfo.id, function(sound){
				SC.currentSong = sound;
				sound.setVolume(50);
				if(SC.isPlaying){
					self.togglePlaySong();
				}
			});
		},
		events: {
			"click .play-btn": "togglePlaySong"
		},
		togglePlaySong: function(){
			if(SC.currentSong.playState === 0){
				SC.currentSong.play({
					onfinish: function(){
						playlist.nextTrack();
					}
				});
				SC.isPlaying = true;
				this.$el.find('.play-btn').addClass('pause-btn');
			}else{
				SC.currentSong.togglePause();
				if(SC.isPlaying){
					SC.isPlaying = false;
					this.$el.find('.play-btn').removeClass('pause-btn');
				}else{
					SC.isPlaying = true;
					this.$el.find('.play-btn').addClass('pause-btn');
				}
			}
		}
	});

/*____________________________________________________________________________*/


////////////////////
// Initialization //
/******************************************************************************/

	// Initialize Soundcloud API
	SC.initialize({
		client_id: '97bd5272192a2be98231dfa55a57a85d'
	});
	SC.isPlaying = false;

	// Create search results collection
	var searchResults = new searchResultsCollection();
	var resultsView = new SearchResultsView({
		el: $('#search-results'),
		collection: searchResults
	});

	// Add search box
	var musicSearch = new SearchView({
		el: $("#search-container"),
		songCollection: searchResults
	});


	// create playlist collection & view
	var playlist = new playlistCollection();
	var thePlaylistView = new PlaylistView({
		el: $('#playlist'),
		collection: playlist
	});

	// Player view
	var thePlayer = new PlayerView({
		el: $('#player')
	});

	window.rs = searchResults;

/*____________________________________________________________________________*/

})();