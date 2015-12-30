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
    .success(function(data){handleResult(data)})
    .error(function(data) {handleError(data,input)});
    } else {
      $.getJSON('https://api.twitch.tv/kraken/streams?game')
    .success(function(data){handleResult(data)})
    .error(function(data) {handleError(data)});
    }
  };
 
  function channelOnlyCall(input) {
    if (input) {
      $.getJSON('https://api.twitch.tv/kraken/streams?channel='+input)
      .success(function(data){handleResult(data)})
      .error(function(data) {handleError(data,input)});
    } else {
      $.getJSON('https://api.twitch.tv/kraken/streams?channel')
      .success(function(data) {handleResult(data)})
      .error(function(data) {handleError(data)});
    }
  };

  function gameAndChannel(input) {
     $.getJSON('https://api.twitch.tv/kraken/streams?game='+input[0]+'&channel='+input[1])
      .success(function(data) {handleResult(data)})
      .error(function(data) {handleError(data)});
  };

  function callApi(input) {
    $.getJSON('https://api.twitch.tv/kraken/streams/freecodecamp')
    .success(function(data) {handleResult(data)})
    .error(function() {  console.log('error!')});
  };

  function handleResult(data) {
    console.log(data);
    var dataLength = Object.keys(data);
    for (var prop in data) {
      console.log(data.streams[0].game);
    }
  }


  init();
})();
