// cosmJS
// version 1.0.0a
// (c) 2012 pete correia [contact@petecorreia.com]
// http://petecorreia.com/cosmjs/
// released under the MIT license

var cosm = (function() {

  /*
  *
  *   PRIVATE VARS & METHODS
  *
  */
	
  var APIkey = "QiKJDoIHZt-7sxtavM1jRhS39B-SAKxFWHZIM0ZMSUV2ND0g",  // THIS SHOULD BE CHANGED WITH SETKEY()
      APIendpoint = "http://api.cosm.com/v2/",
      methods,
  
      // ---------------------
      // HELPERS 
      //
      
      serialize = function( obj ) {
        var str = [];
        for( var p in obj )
           str.push( p + "=" + obj[p] );
        return str.join( "&" );
      },
      
      merge = function ( obj1 , obj2 ) {
        for( var i in obj2 ) { obj1[i] = obj2[i]; }
        return obj1;
      };
  
      // ---------------------
      // REQUEST (PRIVATE)
      //

      request = function( options ) {
        
        var settings = merge({
              type      : 'get'
            }, options);
        
        if ( !settings.url ) { return; }
        settings.type = settings.type.toUpperCase();
            
        if ( settings.type == "PUT" || settings.type == "POST" ) {
          if ( !settings.data || typeof settings.data !== 'object' ) {
            return;
          }
          else {
            settings.data = JSON.stringify(settings.data);
          }
        }
            
        $.ajax({
          url        : settings.url,
          type       : settings.type,
          headers    : {
            "X-ApiKey" : APIkey
          },
          data       : settings.data,
          dataType   : "json",
          cache      : false
        })
        .done(settings.done)
        .fail(settings.fail)
        .always(settings.always);
    	},
  
      // ---------------------
      // WEBSOCKET
      //
      
      ws = {
        socket    : false,
        callbacks : {}
      };
    
  // ON MESSAGE 
  
  ws.message   = function ( event, data, socket ) { 
    if ( data.body && ws.callbacks[data.resource] ) {
      ws.callbacks[data.resource](data.body);
    }
  };
  
  // CONNECT 
  
  ws.connect   = function ( callback ) {
    if ( window.MozWebSocket ) {
      window.WebSocket = window.MozWebSocket;
    } 
    
    if ( !ws.socket && window.WebSocket ) { 
      ws.socket = new WebSocket("ws://api.cosm.com:8080/");
    
      ws.socket.onerror = function( e ) {
        if ( ws.error ) { ws.error( e, this ) }
        ws.connect();
      };
    
      ws.socket.onclose = function( e ) {
        if ( ws.close ) { ws.close( e, this ); }
        ws.connect();
      };
    
      ws.socket.onopen = function( e ) {
        if ( callback ) { callback( this ); }
        if ( ws.error ) { ws.open( e, this ); }
      };
    
      ws.socket.onmessage = function( e ) {
        var data = e.data;
        response = JSON.parse( data );
        ws.message( e, response, this );
      };
    }
  };
  
  // SUBSCRIBE 
  
  ws.subscribe = function ( resource, callback ) {
    var request  = '{"headers":{"X-ApiKey":"' + APIkey + '"}, "method":"subscribe", "resource":"'+ resource +'"}';
  
    if ( !ws.callbacks[resource] ) { 
      ws.callbacks[resource] = callback;
    
      if ( !ws.socket ) {
        ws.connect(function( socket ){
          socket.send( request );
        });
      }
      else {
        ws.socket.send( request );
      }
    }
  };
  
  // SUBSCRIBE 
  
  ws.unsubscribe = function ( resource ) {
    var request  = '{"headers":{"X-ApiKey":"' + APIkey + '"}, "method":"unsubscribe", "resource":"'+ resource +'"}';
  
    if ( ws.callbacks[resource] && ws.socket ) {
      ws.socket.send( request );
      delete ws.callbacks[resource];
    }
  };
    	
  // disable caching
  $.ajaxSetup ({
    cache: false
  });

  /*
  *
  *   PUBLIC VARS & METHODS
  *
  */

	public = {
    endpoint : APIendpoint,
  
    // ---------------------
    // SET API KEY 
    //
    
    setKey : function ( newKey ) {
      APIkey = newKey;
    },
  
    // ---------------------
    // REQUEST
    //
    
    request : function ( options ) {
      request( options );
    },
  
    // ---------------------
    // SUBSCRIBE
    //
    
    subscribe : function ( resource, callback ) {
      ws.subscribe( resource,callback );
    },
  
    // ---------------------
    // UNSUBSCRIBE
    //
    
    unsubscribe : function ( resource ) {
      ws.unsubscribe( resource );
    },
  
    // ---------------------
    // LIVE
    //
    
    live : function ( selector, resource ) {
      var callback = function ( data ) {
            if ( data.current_value ) {
              $( selector ).each(function() {
                $( this ).html( data.current_value ).attr( 'data-cosmjs-resource', resource );
              });
            }
          };
      request({
        url    : APIendpoint + resource, 
        always : callback
      });
      ws.subscribe( resource, callback );
    },
  
    // ---------------------
    // STOP
    //
    
    stop : function ( selector ) {
      ws.unsubscribe( $( selector ).first().attr( 'data-cosmjs-resource' ) );
    },
  
    // ---------------------
    // FEED 
    //
    
    feed : {
    
      // GET
    
      get : function ( opt_feed, opt_callback ) {
        request({
          url     : APIendpoint +"feeds/"+ opt_feed +".json", 
          always  : opt_callback
        });
      },
    
      // UPDATE 
      
      update : function ( opt_feed, opt_data, opt_callback ) {
        request({
          type    : "put",
          url     : APIendpoint +"feeds/"+ opt_feed +".json", 
          data    : opt_data,
          always  : opt_callback
        });
      },
    
      // NEW 
      
      new : function ( opt_data, opt_callback ) {
        request({
          type    : "post",
          url     : APIendpoint +"feeds", 
          data    : opt_data,
          always  : opt_callback
        });
      },
    
      // DELETE 
      
      delete : function ( opt_feed, opt_callback ) {      
        request({
          type    : "delete",
          url     : APIendpoint +"feeds/"+ opt_feed,
          always  : opt_callback
        });
      },
    
      // HISTORY 
      
      history : function ( opt_feed, opt_options, opt_callback ) {            
        request({
          url     : APIendpoint +"feeds/"+ opt_feed +".json",
          data    : serialize( opt_options ),
          always  : opt_callback
        });
      },
    
      // LIST 
      
      list : function ( opt_options, opt_callback ) {      
        request({
          url     : APIendpoint +"feeds",
          data    : serialize( opt_options ),
          always  : opt_callback
        });
      },
    
      // SUBSCRIBE 
      
      subscribe : function ( opt_feed, opt_callback ) {
        if ( opt_feed ) {
          ws.subscribe( "/feeds/"+ opt_feed, opt_callback );
        }       
      },
    
      // SUBSCRIBE 
      
      unsubscribe : function ( opt_feed, opt_callback ) {
        if ( opt_feed ) {
          ws.unsubscribe( "/feeds/"+ opt_feed );
        }
      }
    
    },
  
    // ---------------------
    // DATASTREAM 
    //
    
    datastream : {
    
      // GET
    
      get : function ( opt_feed, opt_datastream, opt_callback ) {
        request({
          url    : APIendpoint +"feeds/"+ opt_feed +"/datastreams/"+ opt_datastream +".json", 
          always : opt_callback
        });
      },
    
      // UPDATE
    
      update : function ( opt_feed, opt_datastream, opt_data, opt_callback ) {
        request({
          type    : "put",
          url     : APIendpoint +"feeds/"+ opt_feed +"/datastreams/"+ opt_datastream +".json", 
          data    : opt_data,
          always  : opt_callback
        });
      },
    
      // NEW
    
      new : function ( opt_feed, opt_data, opt_callback ) {
        request({
          type    : "post",
          url     : APIendpoint +"feeds/"+ opt_feed +"/datastreams", 
          data    : opt_data,
          always  : opt_callback
        });
      },
    
      // DELETE 
      
      delete : function ( opt_feed, opt_datastream, opt_callback ) {
        request({
          type    : "delete",
          url     : APIendpoint +"feeds/"+ opt_feed +"/datastreams/"+ opt_datastream,
          always  : opt_callback
        });
      },
    
      // HISTORY 
      
      history : function ( opt_feed, opt_datastream, opt_options, opt_callback ) {            
        request({
          url     : APIendpoint +"feeds/"+ opt_feed +"/datastreams/"+ opt_datastream +".json",
          data    : serialize( opt_options ),
          always  : opt_callback
        });
      },
    
      // LIST
    
      list : function ( opt_feed, opt_callback ) {
        request({
          url     : APIendpoint +"feeds/"+ opt_feed +".json", 
          always  : function ( data ) {
            opt_callback.call( this, data.datastreams );
          }
        });
      },
    
      // SUBSCRIBE 
      
      subscribe : function ( opt_feed, opt_datastream, opt_callback ) {
        if ( opt_feed && opt_datastream ) {
          ws.subscribe( "/feeds/"+ opt_feed +"/datastreams/"+ opt_datastream, opt_callback );
        }
      },
    
      // SUBSCRIBE 
      
      unsubscribe : function ( opt_feed, opt_datastream, opt_callback ) {
        if ( opt_feed && opt_datastream ) {
          ws.unsubscribe( "/feeds/"+ opt_feed +"/datastreams/"+ opt_datastream );
        }
      },
    
      // LIVE 
      
      live : function ( opt_element, opt_feed, opt_datastream ) {
        if ( opt_element && opt_feed && opt_datastream ) {
          public.live( opt_element, "/feeds/"+ opt_feed +"/datastreams/"+ opt_datastream );
        }
      },
    
      // STOP 
      
      stop : function ( opt_element ) {
        if ( opt_element ) {
          public.stop( opt_element );
        }
      }
    
    },
  
    // ---------------------
    // DATAPOINT 
    //
    
    datapoint : {
    
      // GET
    
      get : function ( opt_feed, opt_datastream, opt_timestamp, opt_callback ) {
        request({
          url    : APIendpoint +"feeds/"+ opt_feed +"/datastreams/"+ opt_datastream +"/datapoints/"+ opt_timestamp, 
          always : opt_callback
        });
      },
    
      // UPDATE
    
      update : function ( opt_feed, opt_datastream, opt_timestamp, opt_value, opt_callback ) {
        request({
          type    : "put",
          url     : APIendpoint +"feeds/"+ opt_feed +"/datastreams/"+ opt_datastream +"/datapoints/"+ opt_timestamp, 
          data    : {
            "value": opt_value
          },
          always  : opt_callback
        });
      },
    
      // NEW
    
      new : function ( opt_feed, opt_datastream, opt_data, opt_callback ) {
        request({
          type    : "post",
          url     : APIendpoint +"feeds/"+ opt_feed +"/datastreams/"+ opt_datastream +"/datapoints", 
          data    : opt_data,
          always  : opt_callback
        });
      },
    
      // DELETE
    
      delete : function ( opt_feed, opt_datastream, opt_timestamp, opt_callback ) {
        var req_options = {
          type   : "delete",
          always : opt_callback
        };
        
        if ( typeof opt_timestamp === "object" ) {
          req_options.url  = APIendpoint +"feeds/"+ opt_feed +"/datastreams/"+ opt_datastream +"/datapoints";
          req_options.data = serialize( opt_timestamp );
        }
        else {
          req_options.url = APIendpoint +"feeds/"+ opt_feed +"/datastreams/"+ opt_datastream +"/datapoints/"+ opt_timestamp;
        }        
        
        request( req_options );
      },
    
      // HISTORY 
      
      history : function ( opt_feed, opt_datastream, opt_options, opt_callback ) {            
        request({
          url     : APIendpoint +"feeds/"+ opt_feed +"/datastreams/"+ opt_datastream +".json",
          data    : serialize( opt_options ),
          always  : function ( data ) {
            opt_callback.call( this, data.datapoints );
          }
        });
      }
    }
	};

  /*
  *
  *   RETURN PUBLIC
  *
  */
  
	return public;
})();

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
        else if ( typeof options === 'string' && options != "" ) {
          return options;
        }
        else {
          return "";
        }        
      },
      methods = {
        live : function ( options ) {
          cosm.live( this, resourcify( options ) );
          return this;
        },
        get  : function ( options ) {
          var $this = $( this );
          cosm.request({
            url    : cosm.endpoint + resourcify( options ) +".json", 
            always : function ( data ) {
              $this.each(function(){
                $(this).html( data.current_value );
              });
            }
          });
          return this;
        }
      };

  $.fn.cosm = function ( method ) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } 
    else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } 
    else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }
  };
})( jQuery );