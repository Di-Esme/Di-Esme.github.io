const toTest = document.getElementsByClassName('level__button');
const easySecond = document.getElementById('easy-level-second');
const easyThird = document.getElementById('easy-level-third');
const middleLevel = document.getElementById('middle-level');
const hardLevel = document.getElementById('hard-level');
const disabledBtn = document.querySelectorAll('button[disabled]');
const listNew1 = JSON.parse(localStorage.getItem("resList"));
const resultInfo1 = JSON.parse(localStorage.getItem("resultInfo"));
const prewList = JSON.parse(localStorage.getItem("listNow"));
const checkbox = document.querySelectorAll("input");

const checkedboxesList = JSON.parse(localStorage.getItem("checkedboxes"));

let m = [];
let checkedboxes = []
/* Обновление отмеченных ранее чекбоксов */

Object.entries(checkbox).forEach(([key, value]) =>{
  if (checkedboxesList !== null){
    for (i in checkedboxesList){
      if (value.id == checkedboxesList[i]){
        value.checked = "true";
      }
    }
  }
})


/* Работа с чекбоксами и сохранение текущих чекбоксов */

if (listNew1 !== null && JSON.stringify(listNew1) !== JSON.stringify(prewList)) { 
  if (listNew1[listNew1.length - 1].lvl === 10 && listNew1[listNew1.length - 1].hint === 0) {
    Object.entries(checkbox).forEach(([key, value]) => {
      if (value.id === resultInfo1.id + '-check') {
        value.checked = true;
        if (checkedboxesList === null) {
          checkedboxes.push(value.id);
        } else {
          checkedboxes = checkedboxesList;
          let m = 0;
          for (let i in checkedboxesList) {
            if (checkedboxesList[i] === value.id) {
              m++;
            }
          }
          if (m === 0) {
            checkedboxes.push(value.id);
          }
        }
        localStorage.setItem("checkedboxes", JSON.stringify(checkedboxes));
      } 
    });
  }
  let listNow = listNew1;
  localStorage.setItem("listNow", JSON.stringify(listNow));
}


/* Отмена блокировки кнопок */

if (checkedboxesList !== null){  
  if (checkedboxesList.length > 2 && checkedboxesList.length < 6){
    for (l = 0; l < 3; ++l){
      disabledBtn[l].disabled = false;
    }
  }
  else{
    if (checkedboxesList.length > 5){
      for (l = 0; l < 6; ++l){
        disabledBtn[l].disabled = false;
      }
    }
  }
}




Array.from(toTest).forEach((btn) => {
  btn.addEventListener("click", function(e) {
    // localStorage.clear();
    e.preventDefault();

    let trackName = btn.parentNode.previousElementSibling.textContent;
    let lvlName = btn.closest('.levels-list').firstElementChild.textContent;
    let idButton = btn.id;
    
    let resultInfo = {
      difficulty: lvlName,
      name:trackName,
      id: idButton
    }
        
    localStorage.setItem("resultInfo", JSON.stringify(resultInfo));
    const musicList = btn.getElementsByClassName('hidden');

    Array.from(musicList).forEach((track) => {
      m.push(track.textContent);
    });
    localStorage.setItem("linkButtonClicked", JSON.stringify(m));
    location.href = "test.html";
  });
})