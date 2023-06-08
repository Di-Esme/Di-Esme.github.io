const dropZones = document.querySelectorAll(".zone");
const button = document.querySelectorAll(".button");
const progressbar = document.getElementById('progressbar');
const results = document.getElementById('results');
const showBtn = document.getElementById('show');
const next = document.getElementById('next-level');
const levels = document.getElementById('levels');
const lvlNew = localStorage.getItem("savelvl");
const saveResults = document.querySelector(".saveres");
const showRes = document.getElementById('show-results');
const modal = document.querySelector(".modal");
const modaltext = document.querySelector(".modal-text");
const musiclevel = document.getElementById('music-level');
const resultInfo = JSON.parse(localStorage.getItem("resultInfo"));
const overlay = document.querySelector(".overlay");
const closeModalBtn = document.querySelector(".btn-close");
const results_wrapper = document.querySelector(".results__wrapper");
const listNew = JSON.parse(localStorage.getItem("resList"));
const trackPlayed = document.getElementById("mainaudio").addEventListener("loadeddata", exTime);


button.forEach(button => {
    button.addEventListener("dragstart", handlerDragstart);
    button.addEventListener("dragend", handlerDragend);
})

dropZones.forEach(dropZones => {
    dropZones.addEventListener("dragenter",  (event) => {event.preventDefault();});
    dropZones.addEventListener("dragover", (event) => {event.preventDefault();});
    dropZones.addEventListener("drop", handlerDrop);
})


let leavedZone = null;
let draggedBtn = null;
let buttCont = null;
let moveCount = 1;

function handlerDragstart(event) {
    this.classList.add("button--active");
    draggedBtn = this;
    leavedZone = this.closest('div');
}

function handlerDragend(event) {
    buttCont = $(".buttons__content .button").toArray().map(el => el.id);
    progressBar(this.closest('div'));

    this.classList.remove("button--active");   
}

var corAnswersCounter = 0;
var incorAnswersCounter = 0;
var hintProgress = 0;
var progress = 0;
let r = 0;
let min = 0;
let sec = 0;


/* Время прохождения задания */

var exTime = setInterval(function tick() {
    sec++;
    if (sec >= 60) {
        min++;
        sec = sec - 60;
    }
}, 1000);


/* Высвечивание подсказки */

var timerId = setInterval(function timer(){
    if (lvlNew > 0){
        $(showBtn).show('slow');
        setTimeout(function () { $(showBtn).hide('slow'); }, 5000);
    }
}, lvlNew * 10000);

/* Определение уровня + добавление данных в массив + информация о результатах */

function nextLevel(incorAnswersCounter, corAnswersCounter, hintProgress, min, sec) {
    let lvl = 0;
    let answersCounter = incorAnswersCounter + corAnswersCounter;
    let res = incorAnswersCounter / answersCounter;
    let list = [];
    let m = 0;
    let time = min + ':' + sec;

    /* Определение уровня */

    for (var i = 0.6; i >= 0.15; i -= 0.05) {
        if (res <= i && res > i - 0.05) {
            lvl += 1;
            break;
        }else{
            if (res > 0.6){
                lvl = 1;
                break;
            }else{
                if (res < 0.15){
                    lvl = 10;
                    break;
                }else{
                    lvl += 1;
                }
            }
        }
    }

    /* Добавление данных в массив результатов */

    let newTry = {
        diflvl: resultInfo.difficulty,
        namelvl: resultInfo.name,
        tryCount: 0,
        correct: corAnswersCounter,
        all: answersCounter,
        hint: hintProgress,
        time: time,
        lvl: lvl,        
    }

    if (listNew !== null){
        if (listNew.length !== 0){
            if (listNew[listNew.length-1].namelvl == newTry.namelvl){
                m = listNew[listNew.length-1].tryCount + 1;
            }
            else{ m = 1;}
            
            newTry.tryCount = m;  
            list = listNew;
            list.push(newTry);
            localStorage.setItem("resList", JSON.stringify(list));
        }
    }else{
        m = 1;
        newTry.tryCount = m;
        list.push(newTry);
        localStorage.setItem("resList", JSON.stringify(list));
    }  
 

    addResults(list);

     /* Информация о результатах */
   
    if (typeof results.innerText !== 'undefined') {
        if (newTry.lvl < 10){
            results.innerText = "Пока что у Вас дольно много ошибок. Продолжим!";
            next.style.display = 'inline-block';
        }
        else{
            if(newTry.hint == 0){
                results.innerText = "Вы достигли максимального уровня!";
                levels.style.display = 'inline-block';
            }
            else{
                results.innerText = "Вы справились, но использовали подсказку. Повторите тест без использования подсказки";
                next.style.display = 'inline-block';
            }                   
        }  
    }      
    localStorage.setItem("savelvl", lvl);    
}

/* Функции для модального окна */

const addRow = function(trylist, m){


    let rowLast = document.createElement('div');
    rowLast.classList.add("row"); 
    rowLast.classList.add("take_"+ m);   
    results_wrapper.append(rowLast);


    const newRow = document.querySelector(".take_" + m);


    for (let i = 2; i < Object.keys(trylist).length; ++i){
        let colLast = document.createElement('div');
        colLast.classList.add("col");
        colLast.innerHTML = Object.values(trylist)[i];
        newRow.append(colLast);
    }   
}

const addResults = function(list) { 

    for (let i = 0; i < list.length; ++i){

        if (i != 0 && list[i].namelvl !== list[i-1].namelvl){
            let infolvl = document.createElement('h4');
            infolvl.classList.add("music-level");
            infolvl.innerHTML = list[i].diflvl + '  ' + list[i].namelvl;
            results_wrapper.append(infolvl);
            addRow(list[i], i);
        }
        else{
            if(i == 0){
                let infolvl = document.createElement('h4');
                infolvl.classList.add("music-level");
                infolvl.innerHTML = list[i].diflvl + '  ' + list[i].namelvl;
                results_wrapper.append(infolvl); 
            }
            addRow(list[i], i);
        }
    }  
}

const openModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

};

const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

if (showRes){
    showRes.addEventListener("click", openModal);
}

if (closeModalBtn){
    closeModalBtn.addEventListener("click", closeModal);
}

/* Сохранение результатов в PDF */

saveResults.addEventListener("click", (event) => {
    event.preventDefault();

    var opt =
    {
        margin: 0.3,
        filename: 'Results.pdf',
        html2canvas: {scale: 3},
        jsPDF: {unit: 'in', format: 'A3', orientation: 'portrait'}
    }

    html2pdf().set(opt).from(modaltext).save();

});

/* Клик по подсказке - показать прогресс */

if (showBtn) {
    showBtn.addEventListener("click", function() {
        hintProgress +=1;
        progressbar.style.display = 'block';
    
        setTimeout(function(){
            progressbar.style.display = 'none';
        }, 8000);    
    });
}

/*  Линия прогресса */

function progressBar(zone) {

    if (zone !== leavedZone) {
        if (draggedBtn.classList.contains(zone.dataset.id)) {
            if (leavedZone.classList.contains('buttons__content')) {
                corAnswersCounter += 1;
                progress = progress + 12.5;
                progressbar.style.width = `${progress}%`;
            }
            else {
                corAnswersCounter += 1;
                progress = progress + 6.25 * moveCount;
                moveCount = 1;
                progressbar.style.width = `${progress}%`;
            }
        }
        else {
            if (zone.classList.contains('buttons__content')) {
                if (draggedBtn.classList.contains(leavedZone.dataset.id)) {
                    incorAnswersCounter += 1;
                    progress = progress - 12.5;
                    progressbar.style.width = `${progress}%`;
                }
                else {
                    corAnswersCounter += 1;
                    progress = progress + 6.25 * (moveCount - 2);
                    progressbar.style.width = `${progress}%`;
                    moveCount = 1;
                }
            }
            else {
                if (leavedZone.classList.contains('buttons__content')) {
                    incorAnswersCounter += 1;
                    progress = progress - 6.25;
                    progressbar.style.width = `${progress}%`;
                    moveCount += 2;
                }
                else {
                    if (draggedBtn.classList.contains(leavedZone.dataset.id)) {
                        incorAnswersCounter += 1;
                        moveCount += 1;
                        progress = progress - 6.25 * moveCount;
                        progressbar.style.width = `${progress}%`;
                    }
                    else {
                        incorAnswersCounter += 1;
                        progress = progress - 12.5;
                        progressbar.style.width = `${progress}%`;
                        moveCount += 2;
                    }
                }
            }
        }
    }

    draggedBtn = null;
    leavedZone = null;

    /* Подсказка для первого уровня */

    if (listNew === null){
        if (incorAnswersCounter > 15){
            progressbar.style.display = 'block';
        }    
    }

    if (progressbar.style.width === "100%"){
        clearInterval(timerId);
        clearInterval(exTime);
        nextLevel(incorAnswersCounter, corAnswersCounter, hintProgress, min, sec);
        showRes.style.display = 'inline-block';   
    }
    else{
        if (typeof results.innerText !== 'undefined') {
            if (buttCont.length == 0){
                results.innerText = "Прослушайте изначальный вариант и Ваш еще раз, где-то есть ошибки";
            }
            else{
                results.innerText = "";
            }
        }
    }    
}

/*  Сбрасывание кнопки в зону */

function handlerDrop(event) {

    var d = $(".buttons__content .button").toArray().map(el => el.id);

    if (this.classList.contains('full') === false) {
        if (this.classList.contains('buttons__content') === true) {
            if (d.length == 0){
                this.append(draggedBtn);
            }
            else{
                d.every(i => {
                    if (draggedBtn.id < i) {
                        this.insertBefore(draggedBtn, document.getElementById(i));
                        return false;
                    }
                    else {
                        this.append(draggedBtn); 
                        return true;
                    }
                });
            }         
        }
        else {
            this.append(draggedBtn);
        }

        leavedZone.classList.remove("full");
    }

    if (this.classList.contains('answer') === true) {
        this.classList.add("full");
    }
}


