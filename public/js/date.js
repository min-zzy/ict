const clock = document.querySelector('.h1-clock');


function getTime(){
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth();
    const day = time.getDate();
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    //clock.innerHTML = hour +":" + minutes + ":"+seconds;
    clock.innerHTML = `${year}/${month+1<10 ? `0${month+1}`:month+1}/${day<10 ? `0${day}`:day} ${hour<10 ? `0${hour}`:hour}:${minutes<10 ? `0${minutes}`:minutes}:${seconds<10 ? `0${seconds}`:seconds}`
}


function init(){
    setInterval(getTime, 1000);
}

init();
