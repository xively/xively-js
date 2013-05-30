var xively = (function() {
  "use strict";

  // private stuff
  var VERSION = "1.0.4.alpha",
      DEFAULT_API_ENDPOINT = "https://api.xively.com/v2/",
      DEFAULT_WS_ENDPOINT = "ws://api.xively.com:8080",
      DEFAULT_SOCKJS_ENDPOINT = "https://api.xively.com:8093/sockjs",
      cacheRequest = false,
      Module,

      log = function(msg) {
        if (window.console && window.console.log) {
          window.console.log( msg );
        }
      }

  Module = {
    version: function() {
      return VERSION;
    },

    setKey: function(newKey) {
      this.apiKey = newKey;
    },

    setApiEndpoint: function(endpoint) {
      this.apiEndpoint = endpoint;
    },

    _settings: function() {
      return {
        apiKey: this.apiKey,
        apiEndpoint: this.apiEndpoint || DEFAULT_API_ENDPOINT
      }
    }
  }

  return Module;
}());
