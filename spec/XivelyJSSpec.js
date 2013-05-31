describe("XivelyJS", function() {
  beforeEach(function() {
    this.xively = new XivelyClient();
  });

  describe(".setKey", function() {
    it("should set the key on our client instance", function() {
      this.xively.setKey("my_key");
      expect(this.xively._settings().apiKey).toEqual("my_key");
    });
  });

  describe(".setApiEndpoint", function() {
    it("should allow setting the apiEndpoint on our client instance", function() {
      this.xively.setApiEndpoint("http://example.com");
      expect(this.xively._settings().apiEndpoint).toEqual("http://example.com");
    });
  });

  describe(".setWsEndpoint", function() {
    it("should allow setting the web socket endpoint on our client instance", function() {
      this.xively.setWsEndpoint("ws://example.com");
      expect(this.xively._settings().wsEndpoint).toEqual("ws://example.com");
    });
  });

  describe(".setSockJSEndpoint", function() {
    it("should allow setting the sockJS endpoint on our client instance", function() {
      this.xively.setSockJSEndpoint("http://example.com");
      expect(this.xively._settings().sockjsEndpoint).toEqual("http://example.com");
    });
  });

  describe(".apiEndpoint", function() {
    it("should expose the api endpoint for use by the jquery plugin", function() {
      expect(this.xively.apiEndpoint).toEqual(this.xively._settings().apiEndpoint);
    });
  });

  describe(".version", function() {
    it("should expose the version string", function() {
      expect(xively.version()).toBeDefined();
    });
  });

  describe(".request", function() {

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
