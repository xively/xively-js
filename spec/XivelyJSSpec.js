describe("XivelyJS", function() {
  beforeEach(function() {
    this.xively = new XivelyClient();
    this.xively.setKey("my_key");
  });

  describe("initialization", function() {
    it("should allow setting the apiEndpoint on our client instance", function() {
      this.xively = new XivelyClient("example.com");
      expect(this.xively._settings().apiHost).toEqual("example.com");
    });
  });

  describe(".setKey", function() {
    it("should set the key on our client instance", function() {
      expect(this.xively._settings().apiKey).toEqual("my_key");
    });
  });

  describe(".apiEndpoint", function() {
    it("should expose the api endpoint for use by the jquery plugin", function() {
      expect(this.xively.apiEndpoint).toEqual("http://api.xively.com/v2");
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

      expect(request.url).toMatch(/https?:\/\/api.xively.com\/v2\/feeds\/123/);
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

      it("should not subscribe if apikey is not set", function() {
        this.xively = new XivelyClient();
        this.xively.subscribe("/feeds/123", this.callback);
        expect(window.WebSocket).not.toHaveBeenCalled();
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

      it("should connect over MozWebSocket in preference to WebSocket if defined", function() {
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

      it("should connect over SockJS in preference to either MozWebSocket or WebSocket if defined", function() {
        this.xively.subscribe("/feeds/123", this.callback);
        expect(window.WebSocket).not.toHaveBeenCalled();
        expect(window.MozWebSocket).not.toHaveBeenCalled();
        expect(window.SockJS).toHaveBeenCalledWith("http://api.xively.com:8082/sockjs");
        expect(this.mockSocket.onopen).toEqual(jasmine.any(Function))
        this.mockSocket.onopen();
        expect(this.mockSocket.send).toHaveBeenCalledWith('{"headers":{"X-ApiKey":"my_key"}, "method":"subscribe", "resource":"/feeds/123"}');
      });
    });
  });

  describe(".unsubscribe", function() {
    beforeEach(function() {
      this.ws = { send: jasmine.createSpy('send') };
      this.xively._ws = this.ws;
      this.callback = jasmine.createSpy("callback");
    });

    it("should not unsubscribe if api key is not set", function() {
      this.xively = new XivelyClient();
      this.xively._ws = this.ws;
      this.xively.unsubscribe("/feeds/123");
      expect(this.ws.send).not.toHaveBeenCalled();
    });

    describe("when previously subscribed", function() {
      beforeEach(function() {
        this.xively.subscribe("/feeds/123", this.callback);
      });

      it("should unsubscribe", function() {
        this.xively.unsubscribe("/feeds/123");
        expect(this.ws.send).toHaveBeenCalledWith('{"headers":{"X-ApiKey":"my_key"}, "method":"unsubscribe", "resource":"/feeds/123"}');
      });
    });
  });

  describe(".feed", function() {
    describe(".subscribe", function() {
      beforeEach(function() {
        this.ws = { send: jasmine.createSpy('send') };
        this.xively._ws = this.ws;
        this.callback = jasmine.createSpy("callback");
      });

      it("should subscribe", function() {
        this.xively.feed.subscribe(123, this.callback);
        expect(this.ws.send).toHaveBeenCalledWith('{"headers":{"X-ApiKey":"my_key"}, "method":"subscribe", "resource":"/feeds/123"}');
      });

      it("should only subscribe once but hook up multiple callbacks", function() {
        this.callback2 = jasmine.createSpy("callback2");
        this.xively.feed.subscribe(123, this.callback);
        this.xively.feed.subscribe(123, this.callback2);
        expect(this.ws.send.callCount).toEqual(1);
        $( document ).trigger('xively./feeds/123', "some-data");
        expect(this.callback.callCount).toEqual(1);
        expect(this.callback2.callCount).toEqual(1);
      });

      it("should not subscribe if apikey is not set", function() {
        this.xively = new XivelyClient();
        this.xively.feed.subscribe(123, this.callback);
        expect(this.ws.send).not.toHaveBeenCalled();
      });

      it("should not subscribe if feed_id is not set", function() {
        this.xively = new XivelyClient();
        this.xively.feed.subscribe(null, this.callback);
        expect(this.ws.send).not.toHaveBeenCalled();
      });
    });

    describe(".unsubscribe", function() {
      beforeEach(function() {
        this.ws = { send: jasmine.createSpy('send') };
        this.xively._ws = this.ws;
        this.callback = jasmine.createSpy("callback");
      });

      it("should not unsubscribe if api key is not set", function() {
        this.xively = new XivelyClient();
        this.xively._ws = this.ws;
        this.xively.feed.unsubscribe(123);
        expect(this.ws.send).not.toHaveBeenCalled();
      });

      describe("when previously subscribed", function() {
        beforeEach(function() {
          this.xively.feed.subscribe(123, this.callback);
        });

        it("should unsubscribe", function() {
          this.xively.feed.unsubscribe(123, this.callback);
          expect(this.ws.send).toHaveBeenCalledWith('{"headers":{"X-ApiKey":"my_key"}, "method":"unsubscribe", "resource":"/feeds/123"}');
        });

        it("should not unsubscribe if no feed id is set", function() {
          this.xively.feed.unsubscribe(null, this.callback);
          expect(this.ws.send.callCount).toEqual(1);
        });
      });
    });
  });
});
