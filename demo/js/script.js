(function ( $ ){
  
  //
  // SET KEY
  //
  
  xively.setKey("yFZXnmdNZnI6_q-0lKlgXf26CemSAKxBdFg4d3dzbUczYz0g");
  
  //
  // xively.feed.get()
  //
      
  $('#get-perform').on('click', function(){
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
    
    xively.feed.new(payload, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.feed.delete()
  //
      
  $('#delete-perform').on('click', function(){
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
          end: "2012-11-20T12:00:00Z"
        };
    
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
    
    xively.feed.list(options, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.feed.subscribe()
  //
      
  $('#subscribe-perform').on('click', function(){
    xively.subscribe("/feeds/" +$('#subscribe-feed').val(), function(event, data){
      console.log("socket callback for feed "+ data.id, data);
    });
  });
  
  //
  // xively.feed.unsubscribe()
  //
      
  $('#unsubscribe-perform').on('click', function(){
    xively.unsubscribe("/feeds/" +$('#subscribe-feed').val(), function(event, data){
      console.log("socket callback for feed "+ data.id, data);
    });
  });
  
  //
  // xively.datastream.get()
  //
      
  $('#getDatastream-perform').on('click', function(){
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
          "id" : "byxively"
        };
    
    if (value == '') { return false; }
    
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
    
    xively.datastream.new(feed, payload, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.datastream.delete()
  //
      
  $('#deleteDatastream-perform').on('click', function(){
    xively.datastream.delete($('#deleteDatastream-feed').val(), $('#deleteDatastream-datastream').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.datastream.history()
  //
      
  $('#historyDatastream-perform').on('click', function(){
    var options = {
          start: "2012-04-20T07:00:00Z",
          end: "2012-04-20T12:00:00Z"
        };
    
    xively.datastream.history("89825", "byxively", options, function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.datastream.list()
  //
      
  $('#listDatastream-perform').on('click', function(){
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
    xively.datapoint.get($('#getDatapoint-feed').val(), $('#getDatapoint-datastream').val(), $('#getDatapoint-timestamp').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.datapoint.update()
  //
      
  $('#putDatapoint-perform').on('click', function(){
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
        datastream  = "byxively",
        payload     = {
                        "datapoints" : [
                          {"at":"2012-04-20T08:00:00Z","value":"094"},
                          {"at":"2012-04-20T09:00:00Z","value":"195"},
                          {"at":"2012-04-20T10:00:00Z","value":"296"},
                          {"at":"2012-04-20T11:00:00Z","value":"397"}
                        ]
                      };
    
    xively.datapoint.new(feed, datastream, payload, function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.datapoint.delete()
  //
      
  $('#deleteDatapoint-perform').on('click', function(){
    xively.datapoint.delete($('#deleteDatapoint-feed').val(), $('#deleteDatapoint-datastream').val(), $('#deleteDatapoint-timestamp').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // xively.datapoint.history()
  //
      
  $('#historyDatapoint-perform').on('click', function(){
    var options = {
          start: "2012-04-20T07:00:00Z",
          end: "2012-04-20T12:00:00Z"
        };
    
    xively.datapoint.history("89825", "byxively", options, function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });

})( jQuery );
