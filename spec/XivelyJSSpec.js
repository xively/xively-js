describe("XivelyJS", function() {
  beforeEach(function() {
    this.xively = new XivelyClient();
    this.xively.setKey("my_key");
  });

  describe("initialization", function() {
    it("should allow setting the apiEndpoint on our client instance", function() {
      this.xively = new XivelyClient("example.com");
      expect(this.xively._settings().apiEndpoint).toEqual("https://example.com/v2");
    });
  });

  describe(".setKey", function() {
    it("should set the key on our client instance", function() {
      expect(this.xively._settings().apiKey).toEqual("my_key");
    });
  });

  describe(".apiEndpoint", function() {
    it("should expose the api endpoint for use by the jquery plugin", function() {
      expect(this.xively.apiEndpoint).toEqual(this.xively._settings().apiEndpoint);
    });
  });

  describe(".version", function() {
    it("should expose the version string", function() {
      expect(this.xively.version()).toBeDefined();
    });
  });

  describe(".request", function() {
    beforeEach(function() {
      this.responses = {
        feed: {
          get: {
            status: 200,
            responseText: '{"id":"123","title":"title"}'
          }
        }
      };

      jasmine.Ajax.useMock();
      this.callback = jasmine.createSpy('callback');
    });

    it("should make a request to the api", function() {
      this.xively.feed.get(123);
      var request = mostRecentAjaxRequest();
      request.response(this.responses.feed.get);

      expect(request.url).toMatch("https:\/\/api.xively.com\/v2\/feeds\/123");
      expect(request.method).toEqual("GET");
      expect(request.requestHeaders["X-ApiKey"]).toEqual("my_key");
      expect(request.requestHeaders["Content-Type"]).toEqual("application/json");
      expect(request.requestHeaders["User-Agent"]).toContain("xively-js/");
    });
  });

  describe(".subscribe", function() {
    describe("standard WebSocket", function() {
      beforeEach(function() {
        this.oldWebSocket = window.WebSocket;
        this.mockSocket = {send: jasmine.createSpy("send")};
        window.WebSocket = jasmine.createSpy("WebSocket").andReturn(this.mockSocket);
        this.callback = jasmine.createSpy("callback");
      });

      afterEach(function() {
        window.WebSocket = this.oldWebSocket;
      });

      it("should subscribe over WebSocket", function() {
        this.xively.subscribe("/feeds/123", this.callback);
        expect(window.WebSocket).toHaveBeenCalledWith("ws://api.xively.com:8080");
        expect(this.mockSocket.onopen).toEqual(jasmine.any(Function))
        this.mockSocket.onopen();
        expect(this.mockSocket.send).toHaveBeenCalledWith('{"headers":{"X-ApiKey":"my_key"}, "method":"subscribe", "resource":"/feeds/123"}');
      });

      it("should only subscribe once but hook up multiple callbacks", function() {
        this.callback2 = jasmine.createSpy("callback2");
        this.xively.subscribe("/feeds/123", this.callback);
        this.xively.subscribe("/feeds/123", this.callback2);
        this.mockSocket.onopen();
        expect(this.mockSocket.send.callCount).toEqual(1);
        $( document ).trigger('xively./feeds/123', "some-data");
        expect(this.callback.callCount).toEqual(1);
        expect(this.callback2.callCount).toEqual(1);
      });
    });

    describe("Mozilla WebSocket", function() {
      beforeEach(function() {
        this.oldWebSocket = window.WebSocket;
        this.oldMozWebSocket = window.MozWebSocket;
        this.mockSocket = {send: jasmine.createSpy("send")};
        window.WebSocket = jasmine.createSpy("WebSocket");
        window.MozWebSocket = jasmine.createSpy("MozWebSocket").andReturn(this.mockSocket);
        this.callback = jasmine.createSpy("callback");
      });

      afterEach(function() {
        window.WebSocket = this.oldWebSocket;
        window.MozWebSocket = this.oldMozWebSocket;
      });

      it("should connect over MozWebSocket", function() {
        this.xively.subscribe("/feeds/123", this.callback);
        expect(window.WebSocket).not.toHaveBeenCalled();
        expect(window.MozWebSocket).toHaveBeenCalledWith("ws://api.xively.com:8080");
        expect(this.mockSocket.onopen).toEqual(jasmine.any(Function))
        this.mockSocket.onopen();
        expect(this.mockSocket.send).toHaveBeenCalledWith('{"headers":{"X-ApiKey":"my_key"}, "method":"subscribe", "resource":"/feeds/123"}');
      });
    });

    describe("SockJS", function() {
      beforeEach(function() {
        this.oldWebSocket = window.WebSocket;
        this.oldMozWebSocket = window.MozWebSocket;
        this.oldSockJS = window.SockJS;
        this.mockSocket = {send: jasmine.createSpy("send")};
        window.WebSocket = jasmine.createSpy("WebSocket");
        window.MozWebSocket = jasmine.createSpy("MozWebSocket");
        window.SockJS = jasmine.createSpy("SockJS").andReturn(this.mockSocket);
        this.callback = jasmine.createSpy("callback");
      });

      afterEach(function() {
        window.WebSocket = this.oldWebSocket;
        window.MozWebSocket = this.oldMozWebSocket;
        window.SockJS = this.oldSockJS;
      });

      it("should connect over SockJS", function() {
        this.xively.subscribe("/feeds/123", this.callback);
        expect(window.WebSocket).not.toHaveBeenCalled();
        expect(window.MozWebSocket).not.toHaveBeenCalled();
        expect(window.SockJS).toHaveBeenCalledWith("https://api.xively.com:8093/sockjs");
        expect(this.mockSocket.onopen).toEqual(jasmine.any(Function))
        this.mockSocket.onopen();
        expect(this.mockSocket.send).toHaveBeenCalledWith('{"headers":{"X-ApiKey":"my_key"}, "method":"subscribe", "resource":"/feeds/123"}');
      });
    });
  });

  describe(".unsubscribe", function() {
    
  });

  // describe(".feed", function() {
    // describe(".subscribe", function() {
      // beforeEach(function() {
        // this.oldWebSocket = window.WebSocket;
        // delete window.WebSocket;
        // this.oldMozWebSocket = window.MozWebSocket;
        // delete window.MozWebSocket;
        // this.oldSockJS = window.SockJS;
        // delete window.SockJS;

        // xively.setKey("my_key");
        // this.mockSocket = {};
        // window.WebSocket = jasmine.createSpy("WebSocket");
        // this.endpoint = "http://example.com";
        // xively.setWSEndpoint(this.endpoint);
        // xively.setSockJSEndpoint(this.endpoint);
      // });

      // afterEach(function() {
        // window.WebSocket = this.oldWebSocket;
        // window.MozWebSocket = this.oldMozWebSocket;
        // window.SockJS = this.oldSockJS;
        // xively.reset();
      // });

      // it("should connect over websockets", function() {
        // xively.feed.subscribe(123);
        // expect(window.WebSocket).toHaveBeenCalledWith(this.endpoint);
      // });

      // it("should prefer MozWebSocket if available", function() {
        // window.MozWebSocket = jasmine.createSpy("MozWebSocket");

        // xively.feed.subscribe(123);

        // expect(window.WebSocket).not.toHaveBeenCalled();
        // expect(window.MozWebSocket).toHaveBeenCalledWith(this.endpoint);
      // });

      // it("should prefer sock.js if available", function() {
        // window.MozWebSocket = jasmine.createSpy("MozWebSocket");
        // window.SockJS = jasmine.createSpy("SockJS")

        // xively.feed.subscribe(123);

        // expect(window.WebSocket).not.toHaveBeenCalled();
        // expect(window.MozWebSocket).not.toHaveBeenCalled();
        // expect(window.SockJS).toHaveBeenCalledWith(this.endpoint);
      // });
    // });
  // });
});
