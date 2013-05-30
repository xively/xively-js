describe("XivelyJS", function() {
  describe(".feed", function() {
    describe(".subscribe", function() {
      beforeEach(function() {
        this.oldWebSocket = window.WebSocket;
        delete window.WebSocket;
        this.oldMozWebSocket = window.MozWebSocket;
        delete window.MozWebSocket;
        this.oldSockJS = window.SockJS;
        delete window.SockJS;

        xively.setKey("my_key");
        this.mockSocket = {};
        window.WebSocket = jasmine.createSpy("WebSocket");
        this.endpoint = "http://example.com";
        xively.setWSEndpoint(this.endpoint);
      });

      afterEach(function() {
        window.WebSocket = this.oldWebSocket;
        window.MozWebSocket = this.oldMozWebSocket;
        window.SockJS = this.oldSockJS;
      });

      it("should connect over websockets", function() {
        xively.feed.subscribe(123);
        expect(window.WebSocket).toHaveBeenCalledWith(this.endpoint);
      });

      it("should prefer MozWebSocket if available", function() {
        window.MozWebSocket = jasmine.createSpy("MozWebSocket");

        xively.feed.subscribe(123);

        expect(window.WebSocket).not.toHaveBeenCalled();
        expect(window.MozWebSocket).toHaveBeenCalledWith(this.endpoint);
      });

      it("should prefer sock.js if available", function() {
        window.MozWebSocket = jasmine.createSpy("MozWebSocket");
        window.SockJS = jasmine.createSpy("SockJS")

        xively.feed.subscribe(123);

        expect(window.WebSocket).not.toHaveBeenCalled();
        expect(window.MozWebSocket).not.toHaveBeenCalled();
        expect(window.SockJS).toHaveBeenCalledWith(this.endpoint + ':8094');
      });
    });
  });
});
