var buttonColours = ["red","blue","green","yellow"];

var userClickedPattern = [];
var gamePattern = [];
var level = 0;
var started = false; // Game started flag
var highScore = 0;
var isMuted = false; // Sound muted state

// Difficulty settings
var currentDifficulty = "medium"; // Default difficulty
var difficultySettings = {
  easy: { speed: 150, initialLength: 1 },
  medium: { speed: 100, initialLength: 1 },
  hard: { speed: 70, initialLength: 2 }
};

// Set Medium as selected by default
$(document).ready(function() {
  // Load high score
  var storedHighScore = localStorage.getItem('simonHighScore');
  if (storedHighScore) {
    highScore = parseInt(storedHighScore);
  }
  $("#high-score").text(highScore);
  $("#current-score").text(0); // Initialize current score display

  // Set Medium as selected by default
  $("#medium").addClass("selected-difficulty");
  // Set initial title
  $("#level-title").text("Press A Key to Start (Medium)");

  // Sound toggle button event listener
  $("#toggle-sound").click(function() {
    isMuted = !isMuted; // Toggle the muted state
    if (isMuted) {
      $(this).text("Unmute");
    } else {
      $(this).text("Mute");
    }
  });
});

// Difficulty button event listeners
$(".btn-difficulty").click(function() {
  var chosenDifficulty = $(this).attr("id");
  currentDifficulty = chosenDifficulty;

  $(".btn-difficulty").removeClass("selected-difficulty");
  $(this).addClass("selected-difficulty");

  if (started) {
    startover();
    $("#level-title").text("Press A Key to Start (" + currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1) + ")");
  } else {
     $("#level-title").text("Press A Key to Start (" + currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1) + ")");
  }
});

// Game button click handler
$(".btn").click(function() {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
  playSound(userChosenColour);
  animatePress(userChosenColour);
});

function nextSequence() {
  userClickedPattern = [];
  level++; // Increment level at the start
  $("#level-title").text("Level " + level);
  $("#current-score").text(level - 1); // Update current score

  var difficulty = difficultySettings[currentDifficulty];
  var speed = difficulty.speed;

  var itemsToGenerate = 1;
  if (currentDifficulty === "hard" && level === 1) {
    itemsToGenerate = difficulty.initialLength;
  }

  function flashButton(color, delay) {
    setTimeout(function() {
      $("#" + color).fadeIn(speed).fadeOut(speed).fadeIn(speed);
      playSound(color);
    }, delay);
  }

  for (var i = 0; i < itemsToGenerate; i++) {
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    // Sequentially flash buttons with a delay, especially for Hard mode's initial sequence
    flashButton(randomChosenColour, i * (speed * 2 + 50)); // delay increases for each button
  }
}

function playSound(name) {
  if (isMuted) {
    return; // Do nothing if muted
  }
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColour) {
  var speed = difficultySettings[currentDifficulty].speed;
  $("#" + currentColour).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColour).removeClass("pressed");
  }, speed); // Use difficulty-based speed
}

// Keypress to start the game
$(document).keypress(function() {
  if (!started) {
    // Level is 0 if starting fresh or after startover()
    // nextSequence will increment it to 1 for the first level
    if (level === 0) { 
      $("#level-title").text("Level " + (level + 1)); // Show "Level 1" immediately
      nextSequence(); // Call nextSequence which now handles level increment
    }
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

       // Game over sound should also respect mute state
       // var wrong_audio = new Audio("sounds/wrong.mp3");
       // wrong_audio.play();
       playSound("wrong"); // Use our modified playSound function

       $("body").addClass("game-over");
       setTimeout(function()
       {
          $("body").removeClass("game-over");
       },200);

       $("#level-title").html("Game Over, Press any Key to Restart");

       // Check and update high score
       var finalScore = level - 1;
       if (finalScore > highScore) {
         highScore = finalScore;
         localStorage.setItem('simonHighScore', highScore);
         $("#high-score").text(highScore);
       }

       startover();
    }

}

function startover() {
  level = 0;
  gamePattern = [];
  userClickedPattern = []; // Clear user's pattern too
  started = false;
  $("#current-score").text(0); // Reset current score display
  // Title will be updated by difficulty button click or next keypress to start
}
