/*
 *
 *   JQUERY PLUGIN
 *
 */

(function( $ ){
  var resourcify = function ( options ) {
        if ( typeof options === 'object' ) {
          return "/feeds/"+ options.feed + (options.datastream ? "/datastreams/"+ options.datastream : "");
        }
        else if ( typeof options === 'string' && options !== "" ) {
          return options;
        }
        else {
          return "";
        }
      },
      methods = {
        live : function ( options ) {
          xively.live( this, resourcify( options ) );
          return this;
        },
        get  : function ( options ) {
          var $this = $( this );
          xively.request({
            url    : xively.apiEndpoint + resourcify( options ) +".json",
            always : function ( data ) {
              $this.each(function(){
                $(this).html( data.current_value );
              });
            }
          });
          return this;
        },
        stop : function() {
          xively.stop( this );
          return this;
        }
      };

  $.fn.xively = function ( method ) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    }
    else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    }
    else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.xively' );
    }
  };
})( jQuery );
