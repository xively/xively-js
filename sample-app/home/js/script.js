(function ( $ ){
  "use strict";

  var feedID = 79650;

  // SET API KEY
  
  xively.setKey( "FzZOVUxKRPl_Tvvtr1z77b8gOVCSAKxlTnlwSzQrZ3U4MD0g" ); // do not use this one, create your own at xively.com

  // get all feed data in one shot

  xively.feed.get (feedID, function (data) {
    // this code is executed when we get data back from Xively

    var feed = data,
        datastream,
        value;

    // loop through datastreams

    for (var x = 0, len = feed.datastreams.length; x < len; x++) {
      datastream = feed.datastreams[x];
      value = parseInt(datastream["current_value"]);

      // LIGHTS

      if ( datastream.id === "lights" ) {
        ui.lights.auto( value );

        // make it live
        xively.datastream.subscribe( feedID, "lights", function ( event , data ) {
          ui.fakeLoad();
          ui.lights.auto( parseInt(data["current_value"]) );
        });
      }

      // TV

      if ( datastream.id === "tv-state" ) {
        ui.tv.auto( value );

        // make it live
        xively.datastream.subscribe( feedID, "tv-state", function ( event , data ) {
          ui.fakeLoad();
          ui.tv.auto( parseInt(data["current_value"]) );
        });
      }

      // MUSIC

      if ( datastream.id === "volume" ) {
        ui.volume.auto( value );

        // make it live
        xively.datastream.subscribe( feedID, "volume", function ( event , data ) {
          ui.fakeLoad();
          ui.volume.auto( parseInt(data["current_value"]) );
        });

        // set play
        document.getElementById("js-audio").play();
        $("body").addClass("music-on");
      }      

      // TEMPERATURE

      if ( datastream.id === "temperature" ) {
        $(".js-temperature").html( datastream["current_value"] );

        // make it live
        xively.datastream.subscribe( feedID, "temperature", function ( event , data ) {
          ui.fakeLoad();
          $(".js-temperature").html( data["current_value"] );
        });
      }
    }

    // SHOW UI

    $(".app-loading").fadeOut(200, function(){
      $(".app-content-inner").addClass("open");
    });
  });


})( jQuery );
