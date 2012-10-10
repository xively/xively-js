(function ( $ ){
  
  //
  // SET KEY
  //
  
  cosm.setKey("yWYxyi3HpdqFCBtKHueTvOGoGROSAKxGRFAyQWk5d3JNdz0g");
  
  //
  // cosm.feed.get()
  //
      
  $('#get-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    cosm.feed.get($('#get-feed').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.feed.update()
  //
      
  $('#update-perform').on('click', function(){
    var value   = $('#update-value').val(),
        payload = {
          "version" : "1.0.0",
          "datastreams": [
            {
              "current_value" : value,
              "id" : "bycosm"       
            }
          ]
        };
    
    if (value == '') { return false; }
    
    $(".showcase").addClass("showcase-open");

    cosm.feed.update("61021", payload, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.feed.new()
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

    cosm.feed.new(payload, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.feed.delete()
  //
      
  $('#delete-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    cosm.feed.delete($('#delete-feed').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.feed.history()
  //
      
  $('#history-perform').on('click', function(){
    var options = {
          start: "2012-04-20T07:00:00Z",
          end: "2012-04-20T12:00:00Z"
        };

    $(".showcase").addClass("showcase-open");

    cosm.feed.history("61021", options, function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.feed.list()
  //
      
  $('#list-perform').on('click', function(){
    var user    = $('#list-user').val(),
        tag     = $('#list-tag').val(),
        options = {
          user : user,
          tag  : tag,
        };
    
    $(".showcase").addClass("showcase-open");

    cosm.feed.list(options, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.feed.subscribe()
  //
      
  $('#subscribe-perform').on('click', function(){
    cosm.subscribe("/feeds/" + $('#subscribe-feed').val(), function(event, data){
      console.log("socket callback for feed "+ data.id, data);
    });
  });
  
  //
  // cosm.feed.unsubscribe()
  //
      
  $('#unsubscribe-perform').on('click', function(){
    cosm.unsubscribe("/feeds/" +$('#unsubscribe-feed').val(), function(event, data){
      console.log("Unsubscribing feed "+ data.id, data);
    });
  });
  
  //
  // cosm.datastream.get()
  //
      
  $('#getDatastream-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    cosm.datastream.get($('#getDatastream-feed').val(), $('#getDatastream-datastream').val(), function(data){
      if (data) {
        $('#showcase').html(JSON.stringify(data, null, ' '));
      }
      else {
        $('#showcase').html('Not found');
      }
    });
  });
  
  //
  // cosm.datastream.update()
  //
      
  $('#updateDatastream-perform').on('click', function(){
    var value   = $('#updateDatastream-value').val(),
        payload = {
          "current_value" : value,
          "id" : "bycosm"
        };
    
    if (value == '') { return false; }

    $(".showcase").addClass("showcase-open");
    
    cosm.datastream.update("61021", "bycosm", payload, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.datastream.new()
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
    
    cosm.datastream.new(feed, payload, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.datastream.delete()
  //
      
  $('#deleteDatastream-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    cosm.datastream.delete($('#deleteDatastream-feed').val(), $('#deleteDatastream-datastream').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.datastream.history()
  //
      
  $('#historyDatastream-perform').on('click', function(){
    var options = {
          start: "2012-04-20T07:00:00Z",
          end: "2012-04-20T12:00:00Z"
        };

    $(".showcase").addClass("showcase-open");
    
    cosm.datastream.history("61021", "bycosm", options, function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.datastream.list()
  //
      
  $('#listDatastream-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    cosm.datastream.list($('#listDatastream-feed').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.datastream.subscribe()
  //
      
  $('#subscribeDatastream-perform').on('click', function(){
    cosm.datastream.subscribe($('#subscribeDatastream-feed').val(), $('#subscribeDatastream-datastream').val(), function(event, data){
      console.log("socket callback for datastream "+ data.id, data);
    });
  });
  
  //
  // cosm.datastream.unsubscribe()
  //
      
  $('#unsubscribeDatastream-perform').on('click', function(){
    cosm.datastream.unsubscribe($('#unsubscribeDatastream-feed').val(), $('#unsubscribeDatastream-datastream').val());
  });
  
  //
  // cosm.datapoint.get()
  //
      
  $('#getDatapoint-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    cosm.datapoint.get($('#getDatapoint-feed').val(), $('#getDatapoint-datastream').val(), $('#getDatapoint-timestamp').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.datapoint.update()
  //
      
  $('#putDatapoint-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    cosm.datapoint.update(
      $('#putDatapoint-feed').val(), 
      $('#putDatapoint-datastream').val(), 
      $('#putDatapoint-timestamp').val(), 
      $('#putDatapoint-value').val(), 
      function(data){
        $('#showcase').html(JSON.stringify(data, null, ' '));
      });
  });
  
  //
  // cosm.datapoint.new()
  //
      
  $('#newDatapoint-perform').on('click', function(){
    var feed        = "61021",
        datastream  = "bycosm",
        payload     = {
                        "datapoints" : [
                          {"at":"2012-04-20T08:00:00Z","value":"094"},
                          {"at":"2012-04-20T09:00:00Z","value":"195"},
                          {"at":"2012-04-20T10:00:00Z","value":"296"},
                          {"at":"2012-04-20T11:00:00Z","value":"397"}
                        ]
                      };

    $(".showcase").addClass("showcase-open");

    cosm.datapoint.new(feed, datastream, payload, function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.datapoint.delete()
  //
      
  $('#deleteDatapoint-perform').on('click', function(){
    $(".showcase").addClass("showcase-open");

    cosm.datapoint.delete($('#deleteDatapoint-feed').val(), $('#deleteDatapoint-datastream').val(), $('#deleteDatapoint-timestamp').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.datapoint.history()
  //
      
  $('#historyDatapoint-perform').on('click', function(){
    var options = {
          start: "2012-04-20T07:00:00Z",
          end: "2012-04-20T12:00:00Z"
        };

    $(".showcase").addClass("showcase-open");
    
    cosm.datapoint.history("61021", "bycosm", options, function(data){
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