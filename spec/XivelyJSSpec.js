describe("XivelyJS", function() {
  beforeEach(function() {
    // this.xively = new XivelyClient();
  });

  // describe(".setKey", function() {
    // it("should allow setting the api key", function() {
      // expect(xively.setKey).toBeDefined();
    // });
  // });

  // describe(".VERSION", function() {
    // it("should expose the version string", function() {
      // expect(xively.VERSION).toBeDefined();
    // });
  // });

  // describe(".setEndpoint", function() {
    // it("should allow setting the endpoint", function() {
    // });
  // });

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
