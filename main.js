(function(){
  function init() {
    document.getElementById("searchinput").value = "";
    document.getElementById("searchinput").placeholder = "Search";
    bindEvents();
  };
  
  function bindEvents() {
    var option = "";
    $("#options").click(function() {
      document.getElementById('droptarget').addEventListener('click',function(event) {
        option = event.target.textContent;
        console.log(option);
        $("#display").text(option);
        if (option === "Game & Channel") {
          document.getElementById('searchinput').placeholder = "Game name, channel";
        } else {
          document.getElementById('searchinput').placeholder = 'Search specific ' + option.toLowerCase();
        }
      });
    });
   $("#menu-link-2").click(function() {
    $("#slide-1").hide();
    $("#slide-2").show();
    });
   $("#menu-link-1").click(function() {
      $("#slide-2").hide();
      $("#slide-1").show();
    });
   $("#searchbutton").click(handleClick);
  };

  function handleClick() {
    var inp = document.getElementById("searchinput").value
    if(inp) {
      fixFormat(inp);
    } else {
      apiHandler(inp);
    } 
  };

  function fixFormat(input) {
  console.log('yello',input);
    var dict = {
      "!":"%20;",
      ":":"%3A",
      ";":"%3B",
      " ":"+"
    };
    input =  input.replace(/[!:;' ']/g,function(match) {
      return dict[match];
    });

    apiHandler(input);
  };

  function apiHandler(input){ 
      switch(document.getElementById("display").textContent) {
      case "Games":
        gameOnlyCall(input);
        break;
      case "Game & Channel":
        input = input.split(',');
        console.log(input);
        gameAndChannel(input);
        break;
      case "Channel":
        channelOnlyCall(input);
        break;
      default:
        var query = document.getElementById("searchinput").value;
        if (query) {
          console.log(' yo search here');
          callApi(input);
        }
      }    
  };

  function gameOnlyCall(input) {  
    if (input) {
    $.getJSON('https://api.twitch.tv/kraken/streams?game='+input)
    .success(function(data){handleGenResult(data)})
    .error(function(data) {handleError(data,input)});
    } else {
    console.log('hello data');
    $.getJSON('https://api.twitch.tv/kraken/streams?game')
    .success(function(data){handleGenResult(data)})
    .error(function(data) {handleError(data)});
    }
  };
 
  function channelOnlyCall(input) {
    if (input) {
      $.getJSON('https://api.twitch.tv/kraken/streams?channel='+input)
      .success(function(data){handleSpecificResult(data,input)})
      .error(function(data) {handleError(data,input)});
    } else {
      $.getJSON('https://api.twitch.tv/kraken/streams/')
      .success(function(data) {handleGenResult(data)})
      .error(function(data) {handleError(data)});
    }
  };

  function gameAndChannel(input) {
     var first = input.shift();
     $.getJSON('https://api.twitch.tv/kraken/streams?game='+first+'&channel='+input)
      .success(function(data) {handleSpecificResult(data,input)})
      .error(function(data) {handleError(data)});
  };

  function callApi(input) {
    console.log('second');
    $.getJSON('https://api.twitch.tv/kraken/streams/'+input)
    .success(function(data) {handleSpecificResult(data,input)})
    .error(function() {  console.log('error!')});
  };

  function handleSpecificResult(data,input) {
    console.log('spec',data,input);
    if(data._total === 0 || data.stream === null) {
      handleOffLine(input);
    } else { //display results
      console.log(data);
      isOnline(data); 
    } 
  };
 
  function isOnline(data) {
    var html = "";
    html += "<div class='row'>";
    html += "<div class='col-md-4'>";
    if (data.stream.length === undefined) {
      for (var i = 0;i< 1 ; i++) {
        console.log(data.stream);
        html += "<a href='" + data.stream.channel.url + "'>";
        html += "<img class='img-responsive user' src='" + data.stream.channel.logo + "'>";
        html += "</a>";
        html += "<h2 class='text'>" + data.stream.channel.name + " is online! </h2></div>";
        html += "<div class='col-md-4'>";
        html += "<h2 class='text'>" + data.stream.channel.name + " is playing: " + data.stream.game + "</h2>";
        html += "<img class='img-responsive game' src='" + data.stream.preview.medium + "'>";
        html += "<h3 class='text'>" + data.stream.channel.status + "</h3></div></div>";
      }
    } else {
    var i = 0; 
    while ( i < data.streams.length) {
      html += "<a href='" + data.streams[i].channel.url + "'>";
      html += "<img class='img-responsive user' src='" + data.streams[i].channel.logo + "'>"
      html += "</a>";
      html += "<h2 class='text'>" + data.streams[i].channel.name + " is online! </h2></div>";
      html += "<div class='col-md-4'>";
      html += "<h2 class='text'>" + data.streams[i].channel.name + " is currently playing: " + data.streams[i].game + "</h2>";
      html += "<img class='img-responsive game' src='" + data.streams[i].preview.medium + "'>";
      html += "<h3 class='text'>" + data.streams[i].channel.status + "</h3></div> </div>";
      i++;
    };
    }
    $("#message1").append(html);
  };
 
  function handleOffLine(inp) {
      console.log(inp);
      $(".message").text("This user is offline! Would you like to be notified when they are online?");
      var html = "";
      html += "<div class='row'>";
      html += "<div class='col-lg-6'>";
      html += "<div class='input-group'>";
      html += "<span class='input-group-btn'>";
      html += "<button class='btn btn-default' type='button' id='yes'>Yes</button>";
      html += "<button class='btn btn-default ' type='button' id='no'>No</button>";
      html += "</span>";
      html += "</div>";
      html += "</div>";
      html += "</div>";
      $("#message1").html(html);
      next(inp);
  };
  //update display
  function next(inp) {
    console.log(inp);
    $("#message1").on('click',function(event) {
      var ev = event.target.id;
      if (ev === "yes") {
        saveOffLine(inp);
      } else {
        $(".message").html('Got it!');
        $("#message1").html("");
        document.getElementById("searchinput").value = "";
        document.getElementById("searchinput").placeholder = "Search";
       setTimeout(function() {

        $(".message").fadeOut("slow");
      },2000);
      }
    });
  };

  function saveOffLine(inp) {
    if (!localStorage.getItem(inp)) {
      localStorage.setItem(inp,inp);
    }
    updateDisplay(inp) 
    interval();
  };

  function interval() {
    var i = 0;
    var arr = [];
    while ( i < localStorage.length) {
      arr.push(localStorage.getItem(localStorage.key(i)));
      i++;
    };
    var html = "";
    console.log(arr);
    var inte = setInterval(function() {
      arr.forEach(function(a) {
      $.getJSON('https://api.twitch.tv/kraken/streams?channel='+a,function(data) {
        //remember to change this to not online and 
        if (data._total !== 0) {
          html += "<div class='alert alert-success fade in'>" + a + " is online!</div>";
          $(".navbar-right").html(html);
          localStorage.removeItem(a);
          var ind = arr.indexOf(a);
          arr.splice(ind,1);
          updateDisplay(data)
          $(".navbar-right").fadeOut(6000);
        }
      }); 
      });
      
    },1000);
   };

  function updateDisplay(data) {
  // add click to main init 
  $("#menu-link-2").click(function() {
  if (typeof data !== Object) {
    console.log('hihisdffs',data);
    var html = "";
    html += "<span>" + data + "</span>"
    html += "<div class='col-md-4-col-xs-4'><span class='stat'> offline</span></div>";
    $('#data').append(html);
  } else { 
    var html = ""; 
    for (var i = 0;i< 1 ; i++) {
     html += "<a href='" + data.stream.channel.url + "'>";
     html += "<img class='img-responsive user' src='" + data.stream.channel.logo + "'>";
     html += "</a>";
     html += "<h2 class='text'>" + data.stream.channel.name + " is online! </h2></div>";
     html += "<div class='col-md-4'>";
     html += "<h2 class='text'>" + data.stream.channel.name + " is playing: " + data.stream.game + "</h2>";
     html += "<img class='img-responsive game' src='" + data.stream.preview.medium + "'>";
     html += "<h3 class='text'>" + data.stream.channel.status + "</h3></div></div>";
    $("#data").append(html);
    } 
    }
  });
  } 
  
  function newResultFromInterval(data) {
    console.log('hihi',data,Array.isArray(data));
    if ( data._total ===  0 ) {
      var html = "";
      html += "<div class='alert'> still offline!</div>"; 
    }
    $("#message1").append(html);
  };

  function handleGenResult(data) {

    var dataLength = Object.keys(data);
    var display = document.getElementById("display").textContent;
      var html = "";
      html += "<div class='row'>";
      html += "<div class='col-lg-12'>";
      html += "<h1 class='header'>";
      html += "All " + display;
      html += "</h1> </div> </div>";
      var count = 0;
      html += "<div class='row'>";

    for (var i = 0; i < data.streams.length-1; i++ ) {
      html += "<div class='col-md-3 col-xs-3'>";
      html += "<a href='"+ data.streams[i].channel.url + "'>";
      html += "<img class='img-responsive' alt='' src='"+ data.streams[i].preview.small + "'>";
      html += "</a>"
      html += "<h4 class='gamename'>" + data.streams[i].game + "</h4> <h5 class='playername'> Player: " + data.streams[i].channel.display_name + "</h5>" 
      html += "<h5 class='view'> Total Views: " + data.streams[i].channel.views + "</h5>   </div>";
      count++; 

      if (count % 3 === 0) {
        html += "</div> <div class='row'>" 
      }
    }
   $("#message1").append(html); 
  };
  
  function handleError(data) {
    $(".message").text('No results found!');
  };

  init();
})();
