var socket = io.connect('http://localhost:8124'); // Use a dynamic dns service like noip.com to make it public available

  socket.on('updateleds', function ( data ) {
    var holder = data.split(':');
    $updatethis = $('.table-control a[data-row=' + holder[0] + '][data-col=' + holder[1] + ']');
    holder[2] = parseInt(holder[2]);

    switch( holder[2]) {
      case 0:
        $updatethis
          .removeClass('waiting')
          .removeClass('on')
          .addClass('off')
          .data('state', '1');
        break;
      case 1:
        $updatethis
                .removeClass('waiting')
          .removeClass('off')
                .addClass('on')
                .data('state', '0');
        break;
    }
    
  });

  socket.on('allleds', function( data ) {
    //console.log(data);
    //window.da = data;
    for(var r = 0; r<data.length; r++) {
      for (var c = 0; c<data[r].length; c++) {
        var $statebutton = $('.table-control a.button[data-row=' + r + '][data-col=' + c + ']');
        switch (data[r][c]) {
          case 0:
            $statebutton
              .removeClass('on')
              .removeClass('off')
              .removeClass('waiting')
              .addClass('on')
              .data('state', 0);
            break;
          case 1:
            $statebutton
              .removeClass('on')
              .removeClass('off')
              .removeClass('waiting')
              .addClass('off')
              .data('state', 1);
            break;
        }
      
      }
    }
  });

  socket.on('updatewaiting', function (data) {
    var holder = data.split(':');
    $updatethis = $('.table-control a[data-row=' + holder[0] + '][data-col=' + holder[1] + ']');
    $updatethis.addClass('waiting');

  });


// on page load
$(function(){

  var active = true;

  function activateButton() {
    active = true;
  }
  
  // when the client clicks SEND
  $('.table-control a.button').click( function(e) {
    $this = $(this);
    if ( active == true && $.isNumeric( $this.data('row') ) && $.isNumeric( $this.data('col') ) && $.isNumeric( $this.data('state') ) ) {
      // console.log('isnum');
      active = false;
      setTimeout(activateButton, 0); // props to @coutoantisocial for preventing multiple clicks
      if ( $this.hasClass('waiting') ){
        console.log('do not send waiting');
        e.preventDefault();
        return false;
      } else {
        var message = $this.data('row') + ':' + $this.data('col') + ":" + $this.data('state');
        $(this).removeClass('on').removeClass('off');
        $(this).addClass('waiting');
        // tell server to execute 'buttonclick' and send along one parameter
        socket.emit('buttonclick', message);
      }
    } else {
      //console.log('not numeric');
      e.preventDefault();
      return false;
    }
  });        

});


window.onbeforeunload = function(e) {
    socket.emit('fdisconnect');
};