
(function(){
  function init() {
    bindEvents();
    
  };
  
  function bindEvents() {
    $("#searchbutton").click(handleClick);
    $("#options").click(function() {
      document.getElementById('droptarget').addEventListener('click',function(event) {
        $("#display").text(event.target.textContent);
      });
    });
  };

  function handleClick() {
    var inp = document.getElementById("searchinput").value
    if(inp) {
      fixFormat(inp);
    }
  };

  function fixFormat(input) {
  console.log('yello');
    var dict = {
      "!":"%20;",
      ":":"%3A",
      ";":"%3B",
      " ":"+"
    };
    input =  input.replace(/[!:;' ']/g,function(match) {
      return dict[match];
    });
      switch(document.getElementById("display").textContent) {
      case "Games":
        gameOnlyCall(input);
        break;
      case "Game & Channel":
      //function for g&c
        break;
      case "Channel":
      //function for jsut channel
        break;
      default:
        callApi(input);
      }    
  };
  function gameOnlyCall(input) {  
    $.getJSON('https://api.twitch.tv/kraken/streams?game='+input+'&limit=5')
    .success(function(data){handleResult(data)})
    .error(function(data) {handleError(data,input)});
  };
 
  function callApi(input) {
    $.getJSON('https://api.twitch.tv/kraken/streams/freecodecamp')
    .success(function(data) {handleResult(data)})
    .error(function() {  console.log('error!')});
  } 
  function handleResult(data) {
    console.log(data);
  }

  init();
})();
