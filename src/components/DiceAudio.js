const DiceRollAudio = () => {
  // Create a new Audio instance and play it

  const audio = new Audio("/diceroll.mp3");
  if (audio.canPlayType("audio/mpeg")) {
    audio.play();
  } else {
    console.error("MP3 format not supported.");
  }
};

export default DiceRollAudio;
