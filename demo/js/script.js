(function ( $ ){
  
  //
  // SET KEY
  //
  
  cosm.setKey("yFZXnmdNZnI6_q-0lKlgXf26CemSAKxBdFg4d3dzbUczYz0g");
  
  //
  // cosm.feed.get()
  //
      
  $('#get-perform').on('click', function(){
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
    
    cosm.feed.update("89825", payload, function(data) {
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
    
    cosm.feed.new(payload, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.feed.delete()
  //
      
  $('#delete-perform').on('click', function(){
    cosm.feed.delete($('#delete-feed').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.feed.history()
  //
      
  $('#history-perform').on('click', function(){
    var options = {
          start: "2012-11-20T07:00:00Z",
          end: "2012-11-20T12:00:00Z"
        };
    
    cosm.feed.history("61916", options, function(data){
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
    
    cosm.feed.list(options, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.feed.subscribe()
  //
      
  $('#subscribe-perform').on('click', function(){
    cosm.subscribe("/feeds/" +$('#subscribe-feed').val(), function(event, data){
      console.log("socket callback for feed "+ data.id, data);
    });
  });
  
  //
  // cosm.feed.unsubscribe()
  //
      
  $('#unsubscribe-perform').on('click', function(){
    cosm.unsubscribe("/feeds/" +$('#subscribe-feed').val(), function(event, data){
      console.log("socket callback for feed "+ data.id, data);
    });
  });
  
  //
  // cosm.datastream.get()
  //
      
  $('#getDatastream-perform').on('click', function(){
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
    
    cosm.datastream.update("89825", "bycosm", payload, function(data) {
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
    
    cosm.datastream.new(feed, payload, function(data) {
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.datastream.delete()
  //
      
  $('#deleteDatastream-perform').on('click', function(){
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
    
    cosm.datastream.history("89825", "bycosm", options, function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.datastream.list()
  //
      
  $('#listDatastream-perform').on('click', function(){
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
    cosm.datapoint.get($('#getDatapoint-feed').val(), $('#getDatapoint-datastream').val(), $('#getDatapoint-timestamp').val(), function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.datapoint.update()
  //
      
  $('#putDatapoint-perform').on('click', function(){
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
    var feed        = "89825",
        datastream  = "bycosm",
        payload     = {
                        "datapoints" : [
                          {"at":"2012-04-20T08:00:00Z","value":"094"},
                          {"at":"2012-04-20T09:00:00Z","value":"195"},
                          {"at":"2012-04-20T10:00:00Z","value":"296"},
                          {"at":"2012-04-20T11:00:00Z","value":"397"}
                        ]
                      };
    
    cosm.datapoint.new(feed, datastream, payload, function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });
  
  //
  // cosm.datapoint.delete()
  //
      
  $('#deleteDatapoint-perform').on('click', function(){
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
    
    cosm.datapoint.history("89825", "bycosm", options, function(data){
      $('#showcase').html(JSON.stringify(data, null, ' '));
    });
  });

})( jQuery );
