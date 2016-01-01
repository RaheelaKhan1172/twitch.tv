(function(){
  function init() {
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
        }
      });
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
        callApi(input);
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
    }
    $("#message1").html(html);
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
      $("#message1").append(html);
      next(inp);
  };

  function next(inp) {
    console.log(inp);
    $("#message1").on('click',function(event) {
      var ev = event.target.id;
      if (ev === "yes") {
        saveOffLine(inp);
      } else {
        //refresh page and tell em to seaerch again
      }
    });
  };

  function saveOffLine(inp) {
    if (!localStorage.getItem('inp')) {
      localStorage.setItem('inp',inp);
    }
    interval();
  };

  function interval() {
    var i = 0;
    console.log(localStorage.length);
    var arr = [];
    while ( i < localStorage.length) {
      arr.push(localStorage.getItem(localStorage.key(i)));
      i++;
    };
    setInterval(function() {
      $.getJSON('https://api.twitch.tv/kraken/streams/'+arr)
       .success(function(data) { newResultFromInterval(data)}); 
    },2000);
   };
  
  function newResultFromInterval(data) {
    console.log(data);
    if ( data.stream !== null ) {
      
    }
  };

  function handleGenResult(data) {
    console.log(data);
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
   $("#message1").html(html); 
  };



  init();
})();
