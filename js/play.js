
const glavTreck = document.getElementById('glavrtack');
const TrakLinks = JSON.parse(localStorage.getItem("linkButtonClicked"));

glavTreck.src = TrakLinks[0];


var dict = {
  "1": new Audio([TrakLinks[1]]),
  "2": new Audio([TrakLinks[2]]),
  "3": new Audio([TrakLinks[3]]),
  "4": new Audio([TrakLinks[4]]),
  "5": new Audio([TrakLinks[5]]),
  "6": new Audio([TrakLinks[6]]),
  "7": new Audio([TrakLinks[7]]),
  "8": new Audio([TrakLinks[8]])
};

const numbers = []
const getRandomNumber = () => {
    const number = Math.floor(1 + Math.random() * 8)
    if (numbers.includes(number)) return getRandomNumber()
    else {
      numbers.push(number)
      return number
    }
}

var playlist = function() {
  var els = document.getElementsByClassName('button');
  Array.from(els).forEach((playbtn) => {
    var pl;
    var track = getRandomNumber();
    pl = dict[track];
    playbtn.classList.add(track);
    playbtn.innerText = playbtn.id;
    playbtn.addEventListener("click", function() {       
      if (pl.paused) {
          pl.play();
          this.classList.add("button--active");
          setTimeout(() => {
            this.classList.remove("button--active");
          }, 5600);
      } else {
          pl.pause();
          this.classList.remove("button--active");
          pl.currentTime = 0;
      }              
    });   
  });
}

document.addEventListener("DOMContentLoaded", playlist);
