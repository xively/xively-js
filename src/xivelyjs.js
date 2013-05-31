(function() {
  "use strict";

  // Save a reference to the global object ('window' in the browser, ,'exports'
  // on the server.
  var root = this,

      // Allow use of jQuery, Zepto or ender with Xively.js in the style of Backbone
      $ = root.jQuery || root.Zepto || root.ender || root.$;

  var XivelyClient = function() {

    // private stuff
    var version = "1.0.4-alpha",

        apiEndpoint = "https://api.xively.com/v2",

        wsEndpoint = "ws://api.xively.com:8080",

        sockjsEndpoint = "https://api.xively.com:8093/sockjs",

        cacheRequest = false,

        apiKey,

        // var which will hold the public API we are going to expose
        methods,

        execute = function ( arr ) {
          if ( typeof arr === "function" ) {
            arr.apply( this, Array.prototype.slice.call( arguments, 1 ));
          }
          else if ( Object.prototype.toString.apply(arr) === '[object Array]' ) {
            var x = arr.length;
            while (x--) {
              arr[x].apply( this, Array.prototype.slice.call( arguments, 1 ));
            }
          }
        },

        // log helper method that doesn't break in environments
        log = function(msg) {
          if (window.console && window.console.log) {
            window.console.log( msg );
          }
        },

        // Ajax request
        request = function(options) {
          var settings = $.extend({
                type      : 'get'
              }, options);

          if ( !apiKey ) {
            return log( "(xivelyJS) ::: No API key ::: Set your API key first with xively.setKey( YOUR_API_KEY ) before using any methods. Check docs for more info." );
          }

          if ( !settings.url ) { return; }
          settings.type = settings.type.toUpperCase();

          if ( settings.type === "PUT" || settings.type === "POST" ) {
            if ( !settings.data || typeof settings.data !== 'object' ) {
              return;
            }
            else {
              settings.data = JSON.stringify(settings.data);
            }
          }

          $.ajax({
            url         : settings.url,
            type        : settings.type,
            headers     : {
              "X-ApiKey" : apiKey
            },
            data        : settings.data,
            crossDomain : true,
            dataType    : 'json',
            cache       : cacheRequest
          })
          .done(settings.done)
          .fail(settings.fail)
          .always(settings.always);
        },

        ws = {
          socket: false,
          socketReady: false,
          queue: [],
          resources: [],
          connect: function(callback) {
            var SocketProvider = (window.SockJS || window.MozWebSocket || window.WebSocket),
                socketEndpoint;

            if ( !ws.socket && SocketProvider ) {
              if ( window.SockJS ) {
                socketEndpoint = sockjsEndpoint;
              } else {
                socketEndpoint = wsEndpoint;
              }

              ws.socket = new SocketProvider(socketEndpoint);

              ws.socket.onerror = function( e ) {
                if ( ws.error ) { ws.error( e, this ); }
                ws.connect();
              };

              ws.socket.onclose = function( e ) {
                if ( ws.close ) { ws.close( e, this ); }
                ws.connect();
              };

              ws.socket.onopen = function( e ) {
                ws.socketReady = true;
                if ( ws.open )         { ws.open( e, this ); }
                if ( ws.queue.length )  { execute( ws.queue ); }
                if ( callback )         { callback( this ); }
              };

              ws.socket.onmessage = function( e ) {
                var data      = e.data,
                    response  = JSON.parse( data );
                if ( response.body ) {
                  $('body').trigger( "xively."+ response.resource, response.body );
                }
              };
            }
          },
          subscribe: function(resource, callback) {
            var request  = '{"headers":{"X-ApiKey":"' + apiKey + '"}, "method":"subscribe", "resource":"'+ resource +'"}';

            if ( !apiKey ) {
              return log( "(xivelyJS) ::: No API key ::: Set your API key first with xively.setKey( YOUR_API_KEY ) before using any methods. Check docs for more info." );
            }

            if ( ws.resources.indexOf(resource) < 0 ) {
              ws.resources.push( resource );

              if ( !ws.socketReady ) {
                ws.connect();
                ws.queue.push(function() {
                  ws.socket.send( request );
                });
              }
              else {
                ws.socket.send( request );
              }
            }

            if ( callback && typeof callback === "function" ) {
              $( document ).on( "xively."+ resource, callback );
            }
          },
          unsubscribe: function(resource) {
            var index = ws.resources.indexOf(resource);

            if (index >= 0) {
              ws.resources.splice(index, 1);
            }

            var request  = '{"headers":{"X-ApiKey":"' + apiKey + '"}, "method":"unsubscribe", "resource":"'+ resource +'"}';

            if ( !apiKey ) {
              return log( "(xivelyJS) ::: No API key ::: Set your API key first with xively.setKey( YOUR_API_KEY ) before using any methods. Check docs for more info." );
            }

            if ( ws.socket ) {
              ws.socket.send( request );
            }
          }
        };

    // disable caching
    $.ajaxSetup ({
      cache: cacheRequest
    });

    this.version = function() {
      return version;
    };

    // ---------------------------------
    // Set api credentials and endpoints
    //
    this.setKey = function(newKey) {
      apiKey = newKey;
    };

    this.setApiEndpoint = function(endpoint) {
      apiEndpoint = endpoint;
    };

    this.setWsEndpoint = function(endpoint) {
      wsEndpoint = endpoint;
    };

    this.setSockJSEndpoint = function(endpoint) {
      sockjsEndpoint = endpoint;
    };

    // ---------------------------------
    // Expose api endpoint
    //
    this.apiEndpoint = apiEndpoint;

    // ---------------------------------
    // General API interaction functions
    //
    this.request = request;

    this.subscribe = ws.subscribe.bind(ws);

    this.unsubscribe = ws.unsubscribe.bind(ws);

    this.live = function ( selector, resource ) {
      var callback = function ( event, data ) {
        var response = event.current_value ? event : data;
        if ( response.current_value ) {
          $( selector ).each(function() {
            $( this ).html( response.current_value ).attr( 'data-xively-resource', resource );
          });
        }
      };
      request({
        url    : apiEndpoint + resource,
        always : callback
      });
      ws.subscribe( resource, callback );
    };

    this.stop = function ( selector ) {
      ws.unsubscribe( $( selector ).first().attr( 'data-xively-resource' ) );
    };

    // ---------------------------------
    // Feed module
    //
    this.feed = {
      get: function(id, callback) {
        request({
          url: apiEndpoint + "/feeds/" + id,
          always: callback
        });
      },

      update: function(id, data, callback) {
        request({
          type    : "put",
          url     : apiEndpoint +"/feeds/"+ id +".json",
          data    : data,
          always  : callback
        });
      },

      'new': function(data, callback) {
        request({
          type    : "post",
          url     : apiEndpoint +"/feeds",
          data    : data,
          always  : callback
        });
      },

      'delete' : function ( id, callback ) {
        request({
          type    : "delete",
          url     : apiEndpoint +"/feeds/"+ id,
          always  : callback
        });
      },

      history : function ( id, options, callback ) {
        request({
          url     : apiEndpoint +"/feeds/"+ id +".json",
          data    : options,
          always  : callback
        });
      },

      list : function ( options, callback ) {
        request({
          url     : apiEndpoint +"/feeds",
          data    : options,
          always  : callback
        });
      },

      subscribe: function(id, callback) {
        if (id) {
          ws.subscribe("/feeds/" + id, callback);
        }
      },

      unsubscribe : function ( id, callback ) {
        if ( id ) {
          ws.unsubscribe( "/feeds/"+ id );
        }
      }
    };

    // ---------------------------------
    // Datastream module
    //
    this.datastream = {
      get : function ( feed_id, datastream_id, callback ) {
        request({
          url    : apiEndpoint +"/feeds/"+ feed_id +"/datastreams/"+ datastream_id +".json",
          always : callback
        });
      },

      update : function ( feed_id, datastream_id, data, callback ) {
        request({
          type    : "put",
          url     : apiEndpoint +"/feeds/"+ feed_id +"/datastreams/"+ datastream_id +".json",
          data    : data,
          always  : callback
        });
      },

      'new' : function ( feed_id, data, callback ) {
        request({
          type    : "post",
          url     : apiEndpoint +"/feeds/"+ feed_id +"/datastreams",
          data    : data,
          always  : callback
        });
      },

      'delete' : function ( feed_id, datastream_id, callback ) {
        request({
          type    : "delete",
          url     : apiEndpoint +"/feeds/"+ feed_id +"/datastreams/"+ datastream_id,
          always  : callback
        });
      },

      history : function ( feed_id, datastream_id, options, callback ) {
        request({
          url     : apiEndpoint +"/feeds/"+ feed_id +"/datastreams/"+ datastream_id +".json",
          data    : options,
          always  : callback
        });
      },

      list : function ( feed_id, callback ) {
        request({
          url     : apiEndpoint +"/feeds/"+ feed_id +".json",
          always  : function ( data ) {
            callback.call( this, data.datastreams );
          }
        });
      },

      subscribe : function ( feed_id, datastream_id, callback ) {
        if ( feed_id && datastream_id ) {
          ws.subscribe( "/feeds/"+ feed_id +"/datastreams/"+ datastream_id, callback );
        }
      },

      unsubscribe : function ( feed_id, datastream_id, callback ) {
        if ( feed_id && datastream_id ) {
          ws.unsubscribe( "/feeds/"+ feed_id +"/datastreams/"+ datastream_id );
        }
      },

      live : function ( element, feed_id, datastream_id ) {
        if ( element && feed_id && datastream_id ) {
          this.live( element, "/feeds/"+ feed_id +"/datastreams/"+ datastream_id );
        }
      },

      stop : function ( element ) {
        if ( element ) {
          this.stop( element );
        }
      }

    };

    // ---------------------------------
    // Datapoint module
    //
    this.datapoint = {
      get : function ( feed_id, datastream_id, timestamp, callback ) {
        request({
          url    : apiEndpoint +"/feeds/"+ feed_id +"/datastreams/"+ datastream_id +"/datapoints/"+ timestamp,
          always : callback
        });
      },

      update : function ( feed_id, datastream_id, timestamp, value, callback ) {
        request({
          type    : "put",
          url     : apiEndpoint +"/feeds/"+ feed_id +"/datastreams/"+ datastream_id +"/datapoints/"+ timestamp,
          data    : {
            "value": value
          },
          always  : callback
        });
      },

      'new' : function ( feed_id, datastream_id, data, callback ) {
        request({
          type    : "post",
          url     : apiEndpoint +"/feeds/"+ feed_id +"/datastreams/"+ datastream_id +"/datapoints",
          data    : data,
          always  : callback
        });
      },

      'delete' : function ( feed_id, datastream_id, timestamp, callback ) {
        var req_options = {
          type   : "delete",
          always : callback
        };

        if ( typeof timestamp === "object" ) {
          req_options.url  = apiEndpoint +"/feeds/"+ feed_id +"/datastreams/"+ datastream_id +"/datapoints";
          req_options.data = timestamp;
        }
        else {
          req_options.url = apiEndpoint +"/feeds/"+ feed_id +"/datastreams/"+ datastream_id +"/datapoints/"+ timestamp;
        }

        request( req_options );
      },

      history : function ( feed_id, datastream_id, options, callback ) {
        request({
          url     : apiEndpoint +"/feeds/"+ feed_id +"/datastreams/"+ datastream_id +".json",
          data    : options,
          always  : function ( data ) {
            callback.call( this, data.datapoints );
          }
        });
      }
    };

    this._settings = function() {
      return {
        apiKey: apiKey,
        apiEndpoint: apiEndpoint,
        wsEndpoint: wsEndpoint,
        sockjsEndpoint: sockjsEndpoint,
        cacheRequest: cacheRequest
      };
    };

    return this;
  };

  root.XivelyClient = XivelyClient;
  root.xively = root.Xively = new XivelyClient();

}).call(this);
