//const btn = document.getElementById("mic");
const outputme = document.querySelector(".sent_box");
const outputbot = document.querySelector(".recieve_box");
const socket = io();

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "ko-KR";
recognition.interimResults = false;
recognition.addEventListener("end", recognition.start);
recognition.maxAlternatives = 5000;

recognition.start();

recognition.onresult = function (event) {
  const last = event.results.length - 1;
  const text = event.results[last][0].transcript;
  console.log(text);

  
  if (text.indexOf('쿠쿠') != -1) {
  outputme.textContent = text;
  console.log('사용자 명령');
  socket.emit("chat message", text);
  } else {console.log('사용자명령 아님')}
  
};

const botReply = (text) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.rate = 1;
  utterance.text = text;
  utterance.pitch = 1;
  utterance.volume = 1;
  synth.speak(utterance);
};

socket.on("bot reply", (text) => {
  
  outputbot.textContent = text;
  botReply(text);
    if(text.indexOf('좋아요. 먼저') != -1) {
      document.getElementById('nextbtn').click();
      setTimeout(function () {
        botReply("칼을 쓰실 땐 조심해주세요");
      }, 10000);
    } else if(text.indexOf('소고기는 키친타올에') != -1) {
      document.getElementById('nextbtn').click();
    } else if(text.indexOf('대파도 송송 썰거나') != -1) {
      document.getElementById('nextbtn').click();
    } else if(text.indexOf('냄비에 참기름 1큰술') != -1) {
      document.getElementById('nextbtn').click();
    } else if(text.indexOf('고기의 겉면이') != -1) {
      document.getElementById('nextbtn').click();
    } else if(text.indexOf('무와 고기가 익으면') != -1) {
      document.getElementById('nextbtn').click();
    } else if(text.indexOf('소고기가 부드러워지면') != -1) {
      document.getElementById('nextbtn').click();
    } else if(text.indexOf('마무리해주세요') != -1) {
      document.getElementById('nextbtn').click();
    } else if(text.indexOf('타이머') != -1) {
      document.getElementById('countdown').click();
    }
});
/*
*/