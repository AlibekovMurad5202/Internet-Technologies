let moveCount = 2;
let clientNumber;
let isMyMove;
let playerType;
let winner;
let dateStart;
let dateEnd;

let aliveX = 1;
let aliveO = 1;
let source_game = [];
for (let i = 0; i < 10; i++){
    source_game[i] = [];
    for (let j = 0; j < 10; j++){
        source_game[i][j] = " ";
        let tmp = document.getElementById(String(i) + String(j));
        tmp.innerHTML = source_game[i][j];
    }
}
let check = 0;

let start_button = document.getElementById('start');
let table = document.getElementById("tb");

start_button.addEventListener("click", function (event) {     // обработчик события "нажали на кнопку старт"
    dateStart = new Date();
    globalMoveCount = 0;
    let xhttp = new XMLHttpRequest();                         // создание объекта XMLHttpRequest
    xhttp.onreadystatechange = function() {                   // обработчик события, которое происходит при каждой смене состояния объекта
        if (this.readyState === 4 && this.status === 200) {   // текущее состояние объекта (4 - данные загружены)
            clientNumber = Number(this.response);
            isMyMove = clientNumber === 1;
            if (isMyMove) playerType = 1;
            else playerType = 2;
            req = {
                i1: -1,
                j1: -1,
                val1: "X",
                i2: -1,
                j2: -1,
                val2: "X",
                i3: -1,
                j3: -1,
                val3: "X",
                alvX: 1,
                alvO: 1,
                move: clientNumber,
                isDisconnect: false,
                some: false
            };
            if(clientNumber === 1){
                console.log("Client === 1");
                document.getElementById("yourMove").style.display = "block";
                document.getElementById("2").style.display = 'none';
                document.getElementById("4").style.display = 'none';
            } else if (clientNumber === 2) {
                console.log("Client === 2");
                document.getElementById("yourMove").style.display = "block";
                document.getElementById("yourMove").innerHTML = "Ход противника";
                document.getElementById("1").style.display = 'none';
                document.getElementById("3").style.display = 'none';
            }
            start.style.display = "none";
            document.getElementById("game_options").style.display = "flex";
            document.getElementById("next_action").style.display = "flex";
        }
    }
    xhttp.open("POST", "http://localhost:3000/game1.html", true);       // определяет метод, URL и другие опциональные параметры запроса
    xhttp.responseType = 'text';                                        // определяем тип данных, содержащихся в ответе
    xhttp.send();                                                       // отправляет запрос на сервер.
})

// инициализация начальных данных (логика игры)
source_game[9][0] = "X";
let tmp = document.getElementById("90");
tmp.innerHTML = source_game[9][0];
source_game[0][9] = "O";
tmp = document.getElementById("09");
tmp.innerHTML = source_game[0][9];

table.onclick = function(event) {
    if (moveCount === 0) return;
    let td = event.target.closest('td');
    if (!td) return;
    let cl = td.getAttribute("class");
    if (cl === "nav") return;
    let curr_id = td.getAttribute("id");
    if (!canSetPoint(Number(curr_id[0]), Number(curr_id[1]))) return;
    source_game[Number(curr_id[0])][Number(curr_id[1])] = curr_act;
    reqForm(tapCount, Number(curr_id[0]), Number(curr_id[1]), curr_act);
    if (tapCount < 3) tapCount++;
    else tapCount = 1;
    td.innerHTML = curr_act;
    if (curr_act === 'X') aliveX++;
    if (curr_act === 'O') aliveO++;
    if (curr_act === '*') aliveO--;
    if (curr_act === '%') aliveX--;
    if (aliveX === 0){
        confirm("Вы выйграли");
        if (playerType === 1) winner = 'X';
        else winner = 'O';
        req.isDisconnect = true;
        transition();     // завершение игры
    }
    if (aliveO === 0){
        confirm("Вы выйграли");
        if (playerType === 1) winner = 'X';
        else winner = 'O';
        req.isDisconnect = true;
        transition();     // завершение игры
    }
    moveCount--;
}

// текущее действие (логика игры)
let curr_act = " ";
document.getElementById('1').addEventListener("click", function(){
    curr_act = 'X';
    this.style.backgroundColor = "blue";
    document.getElementById('3').style.backgroundColor = "red";
});
document.getElementById('2').addEventListener("click", function(){
    curr_act = 'O';
    this.style.backgroundColor = "blue";
    document.getElementById('4').style.backgroundColor = "red";
});
document.getElementById('3').addEventListener("click", function(){
    curr_act = '*';
    this.style.backgroundColor = "blue";
    document.getElementById('1').style.backgroundColor = "red";
});
document.getElementById('4').addEventListener("click", function(){
    curr_act = '%';
    this.style.backgroundColor = "blue";
    document.getElementById('2').style.backgroundColor = "red";
});

// проверки на возможность поставить точку (логика игры)
tapCount = 1;
function canSetPoint(i, j) {
    if (source_game[i][j] === " " && curr_act !== "*" && curr_act !== "%") {
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if (k === i && c === j) continue;
                if (k < 0 || c < 0 || k > 9 || c > 9) continue;
                if (document.getElementById(String(k) + String(c)).innerHTML === curr_act ||
                    document.getElementById(String(k) + String(c)).innerHTML === "*" && curr_act === "X" ||
                    document.getElementById(String(k) + String(c)).innerHTML === "%" && curr_act === "O") {
                    return true;
                }
            }
        }
        return false;
    }
    if ((source_game[i][j] === "X" && curr_act === "%") || (source_game[i][j] === "O" && curr_act === "*")){
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if (k === i && c === j) continue;
                if (k < 0 || c < 0 || k > 9 || c > 9) continue;
                if (document.getElementById(String(k) + String(c)).innerHTML === "O" && curr_act === "%" ||
                    document.getElementById(String(k) + String(c)).innerHTML === "X" && curr_act === "*") {
                    return true;
                }

            }
        }
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if (k === i && c === j) continue;
                if (k < 0 || c < 0 || k > 9 || c > 9) continue;
                if (document.getElementById(String(k) + String(c)).innerHTML === "*" && curr_act === "*" ||
                    document.getElementById(String(k) + String(c)).innerHTML === "%" && curr_act === "%") {
                    if(canSetPointRec(k, c, i, j)) return true;
                }
            }
        }
    }
    if (source_game[i][j] === "*" && curr_act === "*" || source_game[i][j] === "%" && curr_act === "%"){
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if (k === i && c === j) continue;
                if (k < 0 || c < 0 || k > 9 || c > 9) continue;
                if (document.getElementById(String(k) + String(c)).innerHTML === "O" && curr_act === "%" ||
                    document.getElementById(String(k) + String(c)).innerHTML === "X" && curr_act === "*"){
                    return true;
                }
            }
        }
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if (k === i && c === j) continue;
                if (k < 0 || c < 0 || k > 9 || c > 9) continue;
                if (document.getElementById(String(k) + String(c)).innerHTML === "*" && curr_act === "*" ||
                    document.getElementById(String(k) + String(c)).innerHTML === "%" && curr_act === "%") {
                    if (canSetPointRec(k, c, i, j)) return true;
                }
            }
        }
    }
    return false;
}

// рекурсивные проверки на возможность поставить точку (логика игры)
function canSetPointRec(i, j, _i, _j) {
    if ((source_game[i][j] === "X" && curr_act === "%") || (source_game[i][j] === "O" && curr_act === "*")) {
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if ((k === i && c === j) || (k === _i && c === _j)) continue;
                if (k < 0 || c < 0 || k > 9 || c > 9) continue;
                if (document.getElementById(String(k) + String(c)).innerHTML === "O" && curr_act === "%" ||
                    document.getElementById(String(k) + String(c)).innerHTML === "X" && curr_act === "*") {
                    return true;
                }

            }
        }
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if ((k === i && c === j) || (k === _i && c === _j)) continue;
                if (k < 0 || c < 0 || k > 9 || c > 9) continue;
                if (document.getElementById(String(k) + String(c)).innerHTML === "*" && curr_act === "*" ||
                    document.getElementById(String(k) + String(c)).innerHTML === "%" && curr_act === "%") {
                    if (canSetPointRec(k, c, i, j)) return true;
                }
            }
        }
    }
    if (source_game[i][j] === "*" && curr_act === "*" || source_game[i][j] === "%" && curr_act === "%") {
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if ((k === i && c === j) || (k === _i && c === _j)) continue;
                if (k < 0 || c < 0 || k > 9 || c > 9) continue;
                if (document.getElementById(String(k) + String(c)).innerHTML === "O" && curr_act === "%" ||
                    document.getElementById(String(k) + String(c)).innerHTML === "X" && curr_act === "*") {
                    return true;
                }
            }
        }
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if ((k === i && c === j) || (k === _i && c === _j)) continue;
                if (k < 0 || c < 0 || k > 9 || c > 9) continue;
                if (document.getElementById(String(k) + String(c)).innerHTML === "*" && curr_act === "*" ||
                    document.getElementById(String(k) + String(c)).innerHTML === "%" && curr_act === "%") {
                    if (canSetPointRec(k, c, i, j)) return true;
                }
            }
        }
    }
    return false;
}

// форма запроса - хода (логика игры)
let req;
function reqForm(count, i, j, val){
    if (count === 1){
        req.i1 = i;
        req.j1 = j;
        req.val1 = val;
    } else if (count === 2){
        req.i2 = i;
        req.j2 = j;
        req.val2 = val;
    } else if (count === 3){
        req.i3 = i;
        req.j3 = j;
        req.val3 = val;
    }
}

// следующее действие (логика игры)
let next_act = document.getElementById("next_act");
next_act.onclick = function(event) {
    console.log("isMyMove" + String(isMyMove));
    console.log("moveCount" + String(moveCount));
    if (isMyMove === true) {
        if (moveCount !== 0) {
            let xhttp = new XMLHttpRequest();                          // создание объекта XMLHttpRequest
            skipAct();
            xhttp.open("POST", "http://localhost:3000/do_act", true);  // определяет метод, URL и другие опциональные параметры запроса
            xhttp.setRequestHeader("Content-type", 'application/json; charset=utf-8'); // добавляет HTTP-заголовок к запросу.
            xhttp.send(JSON.stringify(req));                           // конвертирует объект JavaScript в JSON-строку отправляем запрос на сервер.
        }
        else {
            moveCount = 3;
            let xhttp = new XMLHttpRequest();                          // создание объекта XMLHttpRequest
            xhttp.open("POST", "http://localhost:3000/do_act", true);  // определяет метод, URL и другие опциональные параметры запроса
            xhttp.setRequestHeader("Content-type", 'application/json; charset=utf-8'); // добавляет HTTP-заголовок к запросу.
            req.alvX = aliveX;
            req.alvO = aliveO;
            xhttp.send(JSON.stringify(req));                           // конвертирует объект JavaScript в JSON-строку отправляем запрос на сервер.
        }
    }
    isMyMove = false;
    document.getElementById("yourMove").innerHTML = "Ход противника";
}

let inData;

// subscribe - функция на клиенте, реализующая long polling
subscribe('/subscribe');
function subscribe(url) {
    var xhr = new XMLHttpRequest();
    xhr.onerror = xhr.onabort = xhr.ontimeout = function() {
        subscribe(url);
    }
    xhr.onreadystatechange = function() {
        if (this.readyState !== 4) {
            return;
        }
        if (this.status === 200) {
            inData = JSON.parse(this.responseText);
            console.log(inData);
            setResponseData(inData);
            xhr.val1 = 'Z';
            xhr.val2 = 'Z';
            xhr.val3 = 'Z';
        } else {
            console.log("Сервер не доступен");
        }
        subscribe(url);
    }
    xhr.open("GET", url, true);
    xhr.send();
}

function skipAct() {
    if (req.val1 !== 'Z') {
        id = String(req.i1) + String(req.j1);
        document.getElementById(id).innerHTML = req.val1;
        switch (req.val1){
            case 'O':
                source_game[Number(id[0])][Number(id[1])] = ' ';
                document.getElementById(id).innerHTML = ' ';
                aliveO--;
                break;
            case 'X':
                source_game[Number(id[0])][Number(id[1])] = ' ';
                document.getElementById(id).innerHTML = ' ';
                aliveX--;
                break;
            case '*':
                source_game[Number(id[0])][Number(id[1])] = 'O';
                document.getElementById(id).innerHTML = 'O';
                aliveO++;
                break;
            case '%':
                source_game[Number(id[0])][Number(id[1])] = 'X';
                document.getElementById(id).innerHTML = 'X';
                aliveX++;
                break;
        }
    }
    if (req.val2 !== 'Z') {
        id = String(req.i2) + String(req.j2);
        switch (req.val2) {
            case 'O':
                source_game[Number(id[0])][Number(id[1])] = ' ';
                document.getElementById(id).innerHTML = ' ';
                aliveO--;
                break;
            case 'X':
                source_game[Number(id[0])][Number(id[1])] = ' ';
                document.getElementById(id).innerHTML = ' ';
                aliveX--;
                break;
            case '*':
                source_game[Number(id[0])][Number(id[1])] = 'O';
                document.getElementById(id).innerHTML = 'O';
                aliveO++;
                break;
            case '%':
                source_game[Number(id[0])][Number(id[1])] = 'X';
                document.getElementById(id).innerHTML = 'X';
                aliveX++;
                break;
        }
    }
    if (req.val3 !== 'Z') {
        id = String(req.i3) + String(req.j3);
        document.getElementById(id).innerHTML = req.val3;
        switch (req.val3) {
            case 'O':
                source_game[Number(id[0])][Number(id[1])] = ' ';
                document.getElementById(id).innerHTML = ' ';
                aliveO--;
                break;
            case 'X':
                source_game[Number(id[0])][Number(id[1])] = ' ';
                document.getElementById(id).innerHTML = ' ';
                aliveX--;
                break;
            case '*':
                source_game[Number(id[0])][Number(id[1])] = 'O';
                document.getElementById(id).innerHTML = 'O';
                aliveO++;
                break;
            case '%':
                source_game[Number(id[0])][Number(id[1])] = 'X';
                document.getElementById(id).innerHTML = 'X';
                aliveX++;
                break;
        }
    }
    req.alvX = aliveX;
    req.alvO = aliveO;
    req.some = true;
    isMyMove = false;
    document.getElementById("yourMove").innerHTML = "Ход противника";
}

function setResponseData(data){
    let countIsTr = 0;
    if (data.some !== true) {
        let id = String(data.i1) + String(data.j1);
        if (id !== "-1-1") {
            document.getElementById(id).innerHTML = data.val1;
            source_game[Number(id[0])][Number(id[1])] = data.val1;
            countIsTr++;
        }
        id = String(data.i2) + String(data.j2);
        if (id !== "-1-1") {
            document.getElementById(id).innerHTML = data.val2;
            source_game[Number(id[0])][Number(id[1])] = data.val2;
            countIsTr++;
        }
        id = String(data.i3) + String(data.j3);
        if (id !== "-1-1") {
            document.getElementById(id).innerHTML = data.val3;
            source_game[Number(id[0])][Number(id[1])] = data.val3;
            countIsTr++;
        }
    } else countIsTr = 3;
    if (countIsTr >= 2 && clientNumber !== data.move){
        isMyMove = true;
        aliveX = data.alvX
        aliveO = data.alvO
        document.getElementById("yourMove").innerHTML = "Твой ход";
    }
}

// завершение игры
function transition(){
    dateEnd = new Date();
    console.log(dateEnd.getMinutes() - dateStart.getMinutes());
    console.log(dateEnd.getSeconds() - dateStart.getSeconds())
    let timeOfGame = {
        minutes: dateEnd.getMinutes() - dateStart.getMinutes(),
        seconds: dateEnd.getSeconds() - dateStart.getSeconds()
    };
    console.log(JSON.stringify(dateEnd));
    let xhttp = new XMLHttpRequest();                            // создание объекта XMLHttpRequest
    xhttp.onreadystatechange = function() {                      // обработчик события, которое происходит при каждой смене состояния объекта
        if (this.readyState === 4 && this.status === 200) {      // текущее состояние объекта (4 - данные загружены)
            document.write(this.response);
        }
    }
    xhttp.open("GET", "http://localhost:3000/gameover", true);   // определяет метод, URL и другие опциональные параметры запроса
    xhttp.responseType = "text";                                 // определяем тип данных, содержащихся в ответе
    xhttp.send();                                                // отправляем запрос на сервер.
    xhttp = new XMLHttpRequest();                                // создание объекта XMLHttpRequest
    xhttp.open("POST", "http://localhost:3000/insertdb", true);  // определяет метод, URL и другие опциональные параметры запроса
    xhttp.setRequestHeader("Content-type", 'application/json; charset=utf-8'); // добавляет HTTP-заголовок к запросу.
    var send = { data: dateStart, gameLen: timeOfGame, win: winner };
    xhttp.send(JSON.stringify(send));                            // конвертирует объект JavaScript в JSON-строку отправляем запрос на сервер.
}

// сдаться (логика игры)
document.getElementById("give_up").onclick = function(event){
    confirm("Вы проиграли");
    req.isDisconnect = true;
    if (playerType === 1) {
        winner = 'O';
        check = 1;
    } else {
        winner = 'X';
        check = 2;
    }
    for (let i = 0; i < 10; i++) {
        source_game[i] = [];
        for (let j = 0; j < 10; j++){
            source_game[i][j] = " ";
            let tmp = document.getElementById(String(i) + String(j));
            tmp.innerHTML = source_game[i][j];
        }
    }
    transition();
};