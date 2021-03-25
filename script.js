// Game Const
const clueHoldTime = 500; // 500 millisecond hold
const cluePauseTime = 333; // 333 millisecond pause
const nextClueWaitTime = 250; // 250 millisecond until next clue

// Game Var
var pattern = [3, 4, 3, 3, 3, 3, 3, 2, 2, 1, 2, 3]; // Fiddler on the Roof
var progress = 0; 
var gamePlaying = false;
var guessCounter = 0;

// Sound Var
var tonePlaying = false;
var volume = 0.5;  // needs to be 0.5 to 1.0

//Game functions
function startGame(){
    progress = 0;
    gamePlaying = true;
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence();
}

function stopGame(){
    progress = 0;
    gamePlaying = true;
    document.getElementById("stopBtn").classList.add("hidden");
    document.getElementById("startBtn").classList.remove("hidden");
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function guess(btn){ 
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  if(pattern[guessCounter] == btn){
    if (guessCounter == progress){
      if(guessCounter == pattern.length - 1){
        winGame();
      }
      else{
        progress += 1;
        playClueSequence();
      }
    }
    else{
      guessCounter += 1;
    }
  }
  else{
    loseGame();
  }
  
}

function loseGame(){
  stopGame();
  alert("Game Over. Better Luck Next Time!");
}

function winGame(){
  stopGame();
  alert("Congratulations, You win!");
}


// Sound Synthesis Functions
const freqMap = {
  1: 164.814,
  2: 174.61,
  3: 195.988,
  4: 261.63
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

