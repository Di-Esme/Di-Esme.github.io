const dropZones = document.querySelectorAll(".zone");
const button = document.querySelectorAll(".button");
const progressbar = document.getElementById('progressbar');
const results = document.getElementById('results');
const showBtn = document.getElementById('show');
const next = document.getElementById('next-level');
const lvlNew = localStorage.getItem("savelvl");
const showRes = document.getElementById('show-results');
const modal = document.querySelector(".modal");
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
let moveCount = 1;

function handlerDragstart(event) {
    this.classList.add("button--active");
    draggedBtn = this;
    leavedZone = this.closest('div');
}

function handlerDragend(event) {
    this.classList.remove("button--active");
    draggedBtn = null;
    
}

var corAnswersCounter = 0;
var incorAnswersCounter = 0;
var answersCounter = 0;
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

function nextLevel(incorAnswersCounter, corAnswersCounter, answersCounter, hintProgress, min, sec) {
    let lvl = 0;
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

    let resultsList = [corAnswersCounter, answersCounter, hintProgress, time, lvl];

    if (listNew !== null){
        if (listNew.length !== 0){
            m = listNew.length + 1;
            list = listNew;
            resultsList.splice(0, 0, m);
            list.push(resultsList);
            console.log("скачанный + текущая попытка", list);
            localStorage.setItem("resList", JSON.stringify(list));
        }
    } 
    else{
        m = 1;
        resultsList.splice(0, 0, m);
        console.log("Лист без текущей попытки ", list);
        list.push(resultsList);
        console.log("Лист с текущей попыткой ", list);
        localStorage.setItem("resList", JSON.stringify(list));
    }

    addResults(list);

     /* Информация о результатах */
   
    if (typeof results.innerText !== 'undefined') {
        if (lvl < 10){
            results.innerText = "Вы справились! Ваш уровень " + lvl + " !";
            next.style.display = 'inline-block';
        }
        else{
            results.innerText = "Вы достигли максимального уровня!";
            showRes.style.display = 'inline-block';          
        }  
    }      
    localStorage.setItem("savelvl", lvl);    
}

/* Функции для модального окна */

const addResults = function(list) {
    for (var value in list){
        let rowLast = document.createElement('div');
        rowLast.classList.add("row"); 
        rowLast.classList.add("take_"+ value[0]);   
        results_wrapper.append(rowLast);

        const newRow = document.querySelector(".take_" + value[0]);
        
        for (var item in list[value]){            
            let colLast = document.createElement('div');
            colLast.classList.add("col");
            colLast.innerHTML = list[value][item];
            newRow.append(colLast);
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

function progressBar(zone, buttCont) {
    if ((zone !== leavedZone) & (zone.classList.contains('full') === false)) {
        if (draggedBtn.classList.contains(zone.dataset.id)) {
            if (leavedZone.classList.contains('buttons__content')) {
                answersCounter += 1;
                corAnswersCounter += 1;
                progress = progress + 12.5;
                progressbar.style.width = `${progress}%`;
            }
            else {
                answersCounter += 1;
                corAnswersCounter += 1;
                progress = progress + 6.25 * moveCount;
                moveCount = 1;
                progressbar.style.width = `${progress}%`;
            }
        }
        else {
            if (zone.classList.contains('buttons__content')) {
                if (draggedBtn.classList.contains(leavedZone.dataset.id)) {
                    answersCounter += 1;
                    incorAnswersCounter += 1;
                    progress = progress - 12.5;
                    progressbar.style.width = `${progress}%`;
                }
                else {
                    answersCounter += 1;
                    corAnswersCounter += 1;
                    progress = progress + 6.25 * (moveCount - 2);
                    progressbar.style.width = `${progress}%`;
                    moveCount = 1;
                }
            }
            else {
                if (leavedZone.classList.contains('buttons__content')) {
                    answersCounter += 1;
                    incorAnswersCounter += 1;
                    progress = progress - 6.25;
                    progressbar.style.width = `${progress}%`;
                    moveCount += 2;
                }
                else {
                    if (draggedBtn.classList.contains(leavedZone.dataset.id)) {
                        answersCounter += 1;
                        incorAnswersCounter += 1;
                        moveCount += 1;
                        progress = progress - 6.25 * moveCount;
                        progressbar.style.width = `${progress}%`;
                    }
                    else {
                        answersCounter += 1;
                        incorAnswersCounter += 1;
                        progress = progress - 12.5;
                        progressbar.style.width = `${progress}%`;
                        moveCount += 2;
                    }

                }

            }
        }
    }

    if (progressbar.style.width === "100%"){
        clearInterval(timerId);
        clearInterval(exTime);
        nextLevel(incorAnswersCounter, corAnswersCounter, answersCounter, hintProgress, min, sec);
    }
    else{
        if (typeof results.innerText !== 'undefined') {
            if (buttCont.length < 2){
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

    progressBar(this, d);

    leavedZone = null;

    if (this.classList.contains('answer') === true) {
        this.classList.add("full");
    }
}

