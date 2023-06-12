const main = document.querySelector(".results-main");
const listNew2 = JSON.parse(localStorage.getItem("resList"));
const saveResults1 = document.querySelector(".saveres");


/* Сохранение результатов в PDF */

saveResults1.addEventListener("click", (event) => {
    console.log('CLICK');
    event.preventDefault();

    var opt =
    {
        margin: 0.2,
        filename: 'Графики результатов.pdf',
        html2canvas: {scale: 1},
        jsPDF: {unit: 'in', format: 'A4', orientation: 'landscape'}
    }
    html2pdf().set(opt).from(main).save();

});


/* Создание графиков */



function createData(timeList, namelvl, idNew, lvlList, corrList, allList){
    var densityData = {
        label: namelvl,
        data: timeList,
        backgroundColor: [
            'rgba(0, 99, 132, 0.6)',
            'rgba(30, 99, 132, 0.6)',
            'rgba(60, 99, 132, 0.6)',
            'rgba(90, 99, 132, 0.6)',
            'rgba(120, 99, 132, 0.6)',
            'rgba(150, 99, 132, 0.6)',
            'rgba(180, 99, 132, 0.6)',
            'rgba(210, 99, 132, 0.6)',
            'rgba(240, 99, 132, 0.6)'
        ],
        borderColor: [
            'rgba(0, 99, 132, 1)',
            'rgba(30, 99, 132, 1)',
            'rgba(60, 99, 132, 1)',
            'rgba(90, 99, 132, 1)',
            'rgba(120, 99, 132, 1)',
            'rgba(150, 99, 132, 1)',
            'rgba(180, 99, 132, 1)',
            'rgba(210, 99, 132, 1)',
            'rgba(240, 99, 132, 1)'
        ],
        borderWidth: 2,
        hoverBorderWidth: 0
    };

    var options = {
        datasets:{
            fontSize: 35
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Уровень",
                    fontColor: "gray",
                    fontFamily: "'Yanone Kaffeesatz', sans-serif",
                    fontSize: 25
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Время в секундах",
                    fontColor: "gray",
                    fontFamily: "'Yanone Kaffeesatz', sans-serif",
                    fontSize: 25
                }
            }]
        }
    };

    const ctx = document.getElementById(idNew);

    new Chart(ctx, {
        
        type: 'bar',
        data: {
            labels: lvlList,
            datasets: [densityData]
        },
        options: options
           
    });
    
}    



/* Создание новых контейнеров для графиков */

function addNewElement(tryCount, time, namelvl, timeList, lvlList, corrList, allList) {
    let trackInfo = document.createElement('div');
    trackInfo.classList.add("results-main-canvas");
    trackInfo.setAttribute('id', timeList[timeList.length-1] + '.'+ time);
    main.append(trackInfo);

    const trackInfo1 = document.getElementById(timeList[timeList.length-1] + '.'+ time);

    let newCanvas = document.createElement('canvas');
    newCanvas.classList.add("canvas");
    newCanvas.setAttribute('id', timeList[timeList.length-1] + '.'+ time +'-canvas');
    trackInfo1.append(newCanvas);

    let idNew = timeList[timeList.length-1] + '.'+ time +'-canvas';

    
    createData(timeList, namelvl, idNew, lvlList, tryCount, corrList, allList);
}


/* Преобразование данных для формирования элементов на странице и графиков */

let newArr = [];
let objList = [];
let prevNamelvl = null;
if (listNew2 !== null){
    Object.entries(listNew2).forEach(([key, value]) => {
        const currentNamelvl = listNew2[key].namelvl; 
        
        if (prevNamelvl === null || prevNamelvl === currentNamelvl) {
        newArr.push(listNew2[key]);
        } else {

        objList.push(newArr);

        newArr = [listNew2[key]];
        }

        prevNamelvl = currentNamelvl; 
    });
    if (newArr.length > 0) {
    objList.push(newArr);
    }

    for (let item in objList){

        let timeList = [];
        let tryList = [];
        let lvlList = [];
        let corrList = [];
        let allList = [];


        for (let value in objList[item]){
            const timeParts = objList[item][value].time.split(":"); 
            const minutes = parseInt(timeParts[0]); 
            const seconds = parseInt(timeParts[1]);
            const totalSeconds = minutes * 60 + seconds;
            objList[item][value].time = totalSeconds;
            timeList.push(objList[item][value].time);
            tryList.push(objList[item][value].tryCount);
            lvlList.push(objList[item][value].lvl);
            corrList.push(objList[item][value].correct);
            allList.push(objList[item][value].all)
        }

        addNewElement(objList[item][0].tryCount, objList[item][0].all, objList[item][0].namelvl, timeList, lvlList, corrList, allList);
    } 
}

/* Отображение информации при пустой странице */

if (main.innerHTML === '') {
    const emptyDiv = document.createElement('div');
    emptyDiv.textContent = 'Пока не пройдено ни одного теста';
    emptyDiv.classList.add("hiddendiv");
    main.appendChild(emptyDiv);
    const saveBtn = document.querySelector('.saveres');
    saveBtn.classList.add('hidden');
}
else {
    const emptyDiv = document.querySelector('.hiddendiv');
    if (emptyDiv) {
        emptyDiv.remove();
    }
}



       

  
           