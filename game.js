var buttonColours = ["red","blue","green","yellow"];

var userClickedPattern = [];

var gamePattern = [];

var level =0;   // to keep track of level count

//code to get the pattern in which buttons got clicked
$(".btn").click(function()
{
  var userChosenColour = $(this).attr("id");

  userClickedPattern.push(userChosenColour);

  checkAnswer(userClickedPattern.length-1);

  playSound(userChosenColour);

  animatePress(userChosenColour);
});


function nextSequence()
{
  //once nextSequence is triggered set userClickedPattern to an empty array
  userClickedPattern = [];

  var randomNumber = Math.floor(Math.random()*4);

  var randomChosenColour = buttonColours[randomNumber];

  gamePattern.push(randomChosenColour);

  $("#"+randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

  playSound(randomChosenColour);



  $("h1").html("Level " + level);

  level++;

}

function playSound(name)
{
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColour)
{
   $("#"+currentColour).addClass("pressed");
   setTimeout(function(){
         $("#"+currentColour).removeClass("pressed");
    }, 100);

}
var started = false; //game hasnt started

$(document).keypress(function()
{
  if(!started)
  {
      nextSequence();
      started = true;
  }


});

//function to check if users answer is correct
function checkAnswer(currentLevel)
{
    if(userClickedPattern[currentLevel]===gamePattern[currentLevel])
    {
      console.log("success");

      if(userClickedPattern.length === gamePattern.length)
      {
        setTimeout(function()
      {
        nextSequence();
      },1000);
      }
    }
    else
    {

       var wrong_audio = new Audio("sounds/wrong.mp3");
       wrong_audio.play();
       $("body").addClass("game-over");
       setTimeout(function()
       {
          $("body").removeClass("game-over");
       },200);

       $("#level-title").html("Game Over, Press any Key to Restart");
       startover();
    }

}

function startover()
{
  level =0;
  gamePattern = [];
  started=false;
}
