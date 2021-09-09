let player;  //지정한 id명
function showVideo(){
  player = new YT.Player('player', {
    height:'400',
    width:'90%',
    videoId : 'videoId'
    playerVars:{
      'autoplay' : 1,
      'controls' : 1,
      'loop' : 1,
    },
    events: {
      'onReady' : load,
    }
  })
}
function load(e){
  e.target.playVideo();
}
