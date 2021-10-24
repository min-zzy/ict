const startingMinutes = 0;
let time = startingMinutes * 60;

const countdownEl = document.getElementById('countdown');

let interval = setInterval(updateCountdown, 1000);

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    countdownEl.innerHTML = `${minutes}m ${seconds}s`;
    time--;
    time = time < 0 ? 0 : time; 

}


let toggle = true;

function stopCountdown() {
    
    if(toggle){
        clearInterval(interval)
        toggle = false;
    }
    
    else{
        interval = setInterval(updateCountdown, 1000)
        toggle = true;
    }
}