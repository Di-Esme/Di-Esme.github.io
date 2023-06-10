const main = document.querySelector(".results-main");
const listNew2 = JSON.parse(localStorage.getItem("resList"));



function createData(timeList, namelvl, idNew, lvlList){
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

    
    const ctx = document.getElementById(idNew);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: lvlList,
            datasets: [densityData]
        },
        options: {
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
        }
    });
}


function addNewElement(tryCount, time, namelvl, timeList, lvlList) {
    let trackInfo = document.createElement('div');
    trackInfo.classList.add("results-main-canvas");
    trackInfo.setAttribute('id', tryCount + '.'+ time);
    main.append(trackInfo);

    const trackInfo1 = document.getElementById(tryCount + '.'+ time);

    let newCanvas = document.createElement('canvas');
    newCanvas.classList.add("canvas");
    newCanvas.setAttribute('id', tryCount + '.'+ time +'-canvas');
    trackInfo1.append(newCanvas);

    let idNew = tryCount + '.'+ time +'-canvas';

    
    createData(timeList, namelvl, idNew, lvlList);
}






let newArr = [];
let objList = [];
let prevNamelvl = null;

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

    for (let value in objList[item]){
        const timeParts = objList[item][value].time.split(":"); 
        const minutes = parseInt(timeParts[0]); 
        const seconds = parseInt(timeParts[1]);
        const totalSeconds = minutes * 60 + seconds;
        objList[item][value].time = totalSeconds;
        timeList.push(objList[item][value].time);
        tryList.push(objList[item][value].tryCount);
        lvlList.push(objList[item][value].lvl);
    }

    addNewElement(objList[item][0].tryCount, objList[item][0].all, objList[item][0].namelvl, timeList, lvlList);
} 






  


              
           