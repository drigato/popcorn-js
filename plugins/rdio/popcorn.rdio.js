// Rdio Plug-in
/**
  * Rdio popcorn plug-in
  * Appends Rdio album track listings to an element on the page.
  * Can also append a user's playlist to an element on the page.
  * Option paramter can be in two forms:
  * Options parameter will take a start, end, target, artist, album, and type or
  * Options parameter will take a start, end, target, person, id, playlist, and type
  * Start is the time that you want this plug-in to execute
  * End is the time that you want this plug-in to stop executing
  * Target is the id of the document element that the images are appended to
  * Artist is the name of who's album image will display
  * Album is the album that will display of the specified Artist
  * Person is the Rdio member who's playlist will display
  * ID is the playlist's unqiue Rdio playlist identifier
  * Playlist is the name of the playlist
  * Type specifies if the element is an album or playlist
  *

  *
  * @param {Object} options
  *
  * Example 1:
  var p = Popcorn( "#video" )
  .rdio({
    start: 2,
    end: 10,
    target: "rdiodiv",
    artist: "Jamiroquai",
    album: "Synkronized",
    type: "album"
  })
  *
  * Example 2:
  var p = Popcorn( "#video" )
  .rdio({
    start: 10,
    end: 20,
    target: "rdiodiv",
    person: "diggywiggy",
    id: 413517,
    playlist: "sunday",
    type: "playlist"
  })
**/

(function( Popcorn ) {
  var _album = {},
  _container = {},
  _target = {},
  _rdioURL = "http://www.rdio.com/api/oembed/?format=json&url=http://www.rdio.com/%23",

  _loadResults = function( data ) {
    if( data && data.title && data.html ) {
      _album[ data.title ].htmlString = "<div>" + data.html + "</div>";
    } else {
      if( Popcorn.plugin.debug ) {
        throw new Error( "Did not receive data from server." );
      }
    }
  },

  // Handle AJAX Request
  _getResults = function( options ) {
    var urlBuilder = {
      playlist : ( function() {
        return _rdioURL + "/people/" + ( options.person ) + "/playlists/" + options.id + "/" + options.playlist + "/&callback=_loadResults";
      }()),
      album : ( function() {
        return _rdioURL + "/artist/" + ( options.artist ) + "/album/" + options.album + "/&callback=_loadResults";
      }())
    },
    url = urlBuilder[ options.type ];
    Popcorn.getJSONP( url, _loadResults, false );
  };

  // Arguments for Plugin
  var _args = {
    options: {
      start: {
        elem: "input",
        type: "text",
        label: "In"
      },
      end: {
        elem: "input",
        type: "text",
        label: "Out"
      },
      target: "rdio",
      artist: {
        elem: "input",
        type: "text",
        label: "Artist"
      },
      album: {
        elem: "input",
        type: "text",
        label: "Album"
      },
      person: {
        elem: "input",
        type: "text",
        label: "Person"
      },
      id: {
        elem: "input",
        type: "text",
        label: "Id"
      },
      playlist: {
        elem: "input",
        type: "text",
        label: "Playlist"
      }
    }
  };

  Popcorn.plugin( "rdio", ( function( options ) {
    return {
  
      _setup: function( options ) {
        var key = ( options.album || options.playlist );
        _target[ key ] = document.getElementById( options.target );
        if( !_target[ key ] && Popcorn.plugin.debug ) {
          throw new Error( "Target container could not be found." );
        }
        _container[ key ] = document.createElement( "div" );
        _container[ key ].style.display = "none";
        _container[ key ].innerHTML = "";
        _target[ key ] && _target[ key ].appendChild( _container[ key ] );
        _album[ key ] = {
          htmlString: ( options.playlist || "Unknown Source" ) || ( options.album || "Unknown Source" )
        };
        _getResults( options );
      },
      start: function( event, options ) {
        var key = ( options.album || options.playlist );
        _container[ key ].innerHTML = _album[ key ].htmlString;
        _container[ key ].style.display = "inline";
      },
      end: function( event, options ) {
        var key = ( options.album || options.playlist );
        _container[ key ].style.display = "none";
        _container[ key ].innerHTML = "";
      },
      _teardown: function( options ) {
        var key = ( options.album || options.playlist );
        _target[ key ] = document.getElementById( options.target );
        _album[ key ].count && delete album[ key ];
        _target[ key ] && _target[ key ].removeChild( _container[ key ] );
      }
	
    };
  }()), _args );
}( Popcorn ));