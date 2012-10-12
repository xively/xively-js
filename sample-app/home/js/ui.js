var ui      = {};

(function ( $ ){
  "use strict";

  // fake load to help user detect realtime changes
  ui.fakeLoad = function () {
    $(".app-state").addClass(".loading").fadeIn(200,function(){
      $(".app-state").removeClass("loading").fadeOut(200);
    });
  };

  // UI LIGHTS

  ui.lights = (function () {
    var methods   = {};

    // switch off
    methods.off = function () {
      $("body").addClass("lights-off");
    };

    // switch on
    methods.on = function () {
      $("body").removeClass("lights-off");
    };

    // figure it out
    methods.auto = function ( value ) {
      if ( value ) {
        methods.on();
      }
      else {
        methods.off();        
      }
    };

    return {
      on        : methods.on,
      off       : methods.off,
      auto      : methods.auto
    };
  })();

  // UI TV

  ui.tv = (function () {
    var methods   = {};

    // switch off
    methods.off = function () {
      $("body").removeClass("tv-on");
    };

    // switch on
    methods.on = function () {
      $("body").addClass("tv-on");
    };

    // figure it out
    methods.auto = function ( value ) {
      if ( value ) {
        methods.on();
      }
      else {
        methods.off();        
      }
    };

    return {
      on        : methods.on,
      off       : methods.off,
      auto      : methods.auto
    };
  })();

  // UI TV

  ui.volume = (function () {
    var methods   = {},
        $wrapper  = $(".js-home-music"),
        $low      = $wrapper.find(".icon-volume-low"),
        $med      = $wrapper.find(".icon-volume-medium"),
        $high     = $wrapper.find(".icon-volume-high");

    methods.mute = function () {
      $low.fadeOut();
      $med.fadeOut();
      $high.fadeOut();
    };

    methods.low = function () {
      $low.fadeIn();
      $med.fadeOut();
      $high.fadeOut();
    };

    methods.medium = function () {
      $low.fadeIn();
      $med.fadeIn();
      $high.fadeOut();
    };

    methods.high = function () {
      $low.fadeIn();
      $med.fadeIn();
      $high.fadeIn();
    };

    // figure it out
    methods.auto = function ( value ) {
      document.getElementById("js-audio").volume = (value / 100);

      if ( value <= 0 ) {
        methods.mute();
      }
      else if ( value <= 33 ) {
        methods.low();
      }
      else if ( value <= 66 ) {
        methods.medium();
      }
      else {
        methods.high();
      }
    };

    return {
      on        : methods.on,
      off       : methods.off,
      auto      : methods.auto
    };
  })();


})( jQuery );
