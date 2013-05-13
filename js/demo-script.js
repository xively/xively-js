(function ( $ ){
  
  //
  // SET KEY
  //
  
  xively.setKey("yWYxyi3HpdqFCBtKHueTvOGoGROSAKxGRFAyQWk5d3JNdz0g");
  
  //
  // xively.feed.get()
  //
      
  $('#get-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    xively.feed.get($('#get-feed').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.feed.update()
  //
      
  $('#update-perform').on('click', function(){
    var value   = $('#update-value').val(),
        payload = {
          "version" : "1.0.0",
          "datastreams": [
            {
              "current_value" : value,
              "id" : "byxively"       
            }
          ]
        };
    
    if (value == '') { return false; }
    
    $(".showcase").addClass("showcase-open");

    xively.feed.update("89825", payload, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.feed.new()
  //
      
  $('#new-perform').on('click', function(){
    var title   = $('#new-title').val(),
        payload = {
          "title"       : title,
          "version"     : "1.0.0",
          "datastreams" : [
            {
              "id" : "test"
            }
          ]
        };
    
    if (title == '') { return false; }
    
    $(".showcase").addClass("showcase-open");

    xively.feed.new(payload, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.feed.delete()
  //
      
  $('#delete-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    xively.feed.delete($('#delete-feed').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.feed.history()
  //
      
  $('#history-perform').on('click', function(){
    var options = {
          start: "2012-11-20T07:00:00Z",
          end: "2012-11-20T08:00:00Z"
        };

    $(".showcase").addClass("showcase-open");

    xively.feed.history("61916", options, function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.feed.list()
  //
      
  $('#list-perform').on('click', function(){
    var user    = $('#list-user').val(),
        tag     = $('#list-tag').val(),
        options = {
          user : user,
          tag  : tag,
        };
    
    $(".showcase").addClass("showcase-open");

    xively.feed.list(options, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.feed.subscribe()
  //
      
  $('#subscribe-perform').on('click', function(){
    xively.subscribe("/feeds/" + $('#subscribe-feed').val(), function(event, data){
      console.log("socket callback for feed "+ data.id, data);
    });
  });
  
  //
  // xively.feed.unsubscribe()
  //
      
  $('#unsubscribe-perform').on('click', function(){
    xively.unsubscribe("/feeds/" +$('#unsubscribe-feed').val(), function(event, data){
      console.log("Unsubscribing feed "+ data.id, data);
    });
  });
  
  //
  // xively.datastream.get()
  //
      
  $('#getDatastream-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    xively.datastream.get($('#getDatastream-feed').val(), $('#getDatastream-datastream').val(), function(data){
      if (data) {
        $('#showcase').html(JSON.stringify(data, null, ' '));
      }
      else {
        $('#showcase').html('Not found');
      }
    });
  });
  
  //
  // xively.datastream.update()
  //
      
  $('#updateDatastream-perform').on('click', function(){
    var value   = $('#updateDatastream-value').val(),
        payload = {
          "current_value" : value,
          "id" : "test2"
        };
    
    if (value == '') { return false; }

    $(".showcase").addClass("showcase-open");
    
    xively.datastream.update("89825", "byxively", payload, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.datastream.new()
  //
      
  $('#newDatastream-perform').on('click', function(){
    var feed    = $('#newDatastream-feed').val(),
        id      = $('#newDatastream-id').val(),
        payload = {
          "version"     : "1.0.0",
          "datastreams" : [
            {
              "id"            : id
            }
          ]
        };
    
    if (feed == '' || id == "") { return false; }

    $(".showcase").addClass("showcase-open");
    
    xively.datastream.new(feed, payload, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.datastream.delete()
  //
      
  $('#deleteDatastream-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    xively.datastream.delete($('#deleteDatastream-feed').val(), $('#deleteDatastream-datastream').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.datastream.history()
  //
      
  $('#historyDatastream-perform').on('click', function(){
    var options = {
          start: "2012-11-20T07:00:00Z",
          end: "2012-11-20T08:00:00Z"
        };

    $(".showcase").addClass("showcase-open");
    
    xively.datastream.history("61916", "random5", options, function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.datastream.list()
  //
      
  $('#listDatastream-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    xively.datastream.list($('#listDatastream-feed').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.datastream.subscribe()
  //
      
  $('#subscribeDatastream-perform').on('click', function(){
    xively.datastream.subscribe($('#subscribeDatastream-feed').val(), $('#subscribeDatastream-datastream').val(), function(event, data){
      console.log("socket callback for datastream "+ data.id, data);
    });
  });
  
  //
  // xively.datastream.unsubscribe()
  //
      
  $('#unsubscribeDatastream-perform').on('click', function(){
    xively.datastream.unsubscribe($('#unsubscribeDatastream-feed').val(), $('#unsubscribeDatastream-datastream').val());
  });
  
  //
  // xively.datapoint.get()
  //
      
  $('#getDatapoint-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    xively.datapoint.get($('#getDatapoint-feed').val(), $('#getDatapoint-datastream').val(), $('#getDatapoint-timestamp').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.datapoint.update()
  //
      
  $('#putDatapoint-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    xively.datapoint.update(
      $('#putDatapoint-feed').val(), 
      $('#putDatapoint-datastream').val(), 
      $('#putDatapoint-timestamp').val(), 
      $('#putDatapoint-value').val(), 
      function(data){
        $('#showcase').html(JSON.stringify(data, null, ' '));
      });
  });
  
  //
  // xively.datapoint.new()
  //
      
  $('#newDatapoint-perform').on('click', function(){
    var feed        = "89825",
        datastream  = "test",
        payload     = {
                        "datapoints" : [
                          {"at":"2012-12-04T08:00:00Z","value":"094"},
                          {"at":"2012-12-04T09:00:00Z","value":"195"},
                          {"at":"2012-12-04T10:00:00Z","value":"296"},
                          {"at":"2012-12-04T11:00:00Z","value":"397"}
                        ]
                      };

    $(".showcase").addClass("showcase-open");

    xively.datapoint.new(feed, datastream, payload, function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.datapoint.delete()
  //
      
  $('#deleteDatapoint-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    xively.datapoint.delete($('#deleteDatapoint-feed').val(), $('#deleteDatapoint-datastream').val(), $('#deleteDatapoint-timestamp').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.datapoint.history()
  //
      
  $('#historyDatapoint-perform').on('click', function(){
    var options = {
          start: "2012-12-04T07:00:00Z",
          end: "2012-12-04T12:00:00Z"
        };

    $(".showcase").addClass("showcase-open");
    
    xively.datapoint.history("61916", "random5", options, function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // SHOWCASE LOGIC
  //

  $(".showcase-close").on("click", function ( event ) {
    event.preventDefault();
    $(this).closest(".showcase").removeClass("showcase-open").find("#showcase").html("Waiting for response ...");
  });

  $(document).on("keydown", function(e) {
    // ESCAPE key pressed
    if (e.keyCode == 27) {
      $(".showcase").removeClass("showcase-open").find("#showcase").html("Waiting for response ...");
    }
});

})( jQuery );
