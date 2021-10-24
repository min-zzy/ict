var slides = document.querySelector('.slides'),
    slide = document.querySelectorAll('.slides li'),
    currentIdx = 0,
    slidecount = slide.length,
    slideheight = 160,
    prevbtn = document.querySelector('.prev'),
    nextbtn = document.querySelector('.next');

slides.style.height = slideheight * slidecount + 'px';

function moveSlide(num){
  slides.style.top = -num * 160 + 'px';
  currentIdx = num;
}

nextbtn.addEventListener('click', function(){
  if(currentIdx < slidecount - 3){
    moveSlide(currentIdx + 1);
    document.getElementsByClassName('list')[currentIdx].style.fontSize = '25px';
    document.getElementsByClassName('list')[currentIdx + 1].style.fontSize = '45px';
  }else{
    // moveSlide(0);
    // document.getElementsByClassName('list')[9].style.fontSize = '25px';
    // document.getElementsByClassName('list')[1].style.fontSize = '45px';
    document.location.href='index_last.html';
  }
});

prevbtn.addEventListener('click', function(){
  if(currentIdx > 0){
    moveSlide(currentIdx - 1);   
    document.getElementsByClassName('list')[currentIdx + 2].style.fontSize = '25px';
    document.getElementsByClassName('list')[currentIdx + 1].style.fontSize = '45px';
  }else{
    document.location.href='index0.html';
  }
});