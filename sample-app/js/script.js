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
        value,
        // function for setting up the toggle inputs
        handleToggle = function ( datastreamID, value ) {
          var $toggle = $(".js-"+ datastreamID +"-toggle");

          if ( value ) {
            // lights are on
            ui.toggle.on( $toggle, true );
          }
          else {
            // lights are off
            ui.toggle.off( $toggle, true );
          }

          // save changes
          $(".js-"+ datastreamID).on("change", function(){
            $(".app-state").addClass("loading").fadeIn(200);

            if ( this.checked ) {
              xively.datastream.update(feedID, datastreamID, { "current_value": 1 }, function(){
                $(".app-state").removeClass("loading").fadeOut(200);
              });
            }
            else {
              xively.datastream.update(feedID, datastreamID, { "current_value": 0 }, function(){
                $(".app-state").removeClass("loading").fadeOut(200);
              });
            }
          });

          // make it live
          xively.datastream.subscribe(feedID, datastreamID, function ( event, data ) {
            ui.fakeLoad();

            if ( parseInt(data["current_value"]) ) {
              // lights are on
              ui.toggle.on( $toggle, true );
            }
            else {
              // lights are off
              ui.toggle.off( $toggle, true );
            }
          });
        };

    // loop through datastreams

    for (var x = 0, len = feed.datastreams.length; x < len; x++) {
      datastream = feed.datastreams[x];
      value = parseInt(datastream["current_value"]);

      // LIGHTS

      if ( datastream.id === "lights" ) {
        handleToggle( "lights", value );
      }

      // TV

      if ( datastream.id === "tv-state" ) {
        handleToggle( "tv-state", value );
      }

      // MUSIC

      if ( datastream.id === "volume" ) {
        var $range = $(".js-volume");
        
        // set value
        $range.val(value);

        // save changes
        $range.on("custom-change", function( event, val ) {
          $(".app-state").addClass("loading").fadeIn(200);
          xively.datastream.update(feedID, "volume", { "current_value": val }, function(){
            $(".app-state").removeClass("loading").fadeOut(200);
          });
        });

        // make it live
        xively.datastream.subscribe(feedID, "volume", function ( event, data ) {
          ui.fakeLoad();
          $range.val(parseInt(data["current_value"]));
        });

      }      

      // TEMPERATURE

      if ( datastream.id === "temperature" ) {
        var $temperature = $(".js-temperature");

        $temperature.html( datastream["current_value"] );

        // save changes
        $temperature.on("custom-change", function( event, val ) {
          $(".app-state").addClass("loading").fadeIn(200);
          xively.datastream.update(feedID, "temperature", { "current_value": val }, function(){
            $(".app-state").removeClass("loading").fadeOut(200);
          });
        });

        // make it live
        xively.datastream.subscribe( feedID, "temperature", function ( event , data ) {
          ui.fakeLoad();
          $temperature.html( data["current_value"] );
        });
      }
    }

    // SHOW UI

    $(".app-loading").fadeOut(200, function(){
     $(".app-content-inner").addClass("open");
    });
  });


})( jQuery );
