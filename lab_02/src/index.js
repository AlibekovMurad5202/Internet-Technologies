let express = require("express");   // получаем модуль express (предоставляет ряд готовых абстракций, упрощающих создание сервера и серверной логики)
let app = express();                                   // создаём объект приложения
let bodyParser = require("body-parser");               // получаем модуль body-parser (для получения данных форм из запроса)
let database = require("./database");                  // получаем модуль database

// создаю парсер, с параметром {extended: true}, т.е. будут парситься объекты любого типа, а не только строки и массивы
let urlencodedParser = bodyParser.urlencoded({extended: true});

let clc1 = 0;
let clientCount = 0;
let gameOverCounts = 0;
let clientOut = false;


// устанавливаем (определяем) обработчик для маршрута "/index.html" (метод GET)
app.get('/index.html', function (request, response) {
    response.sendFile(__dirname + '/client/index.html');   // отправка ответа - html страницы
});

// устанавливаем обработчик для маршрута "/index.html" (метод POST)
app.post('/index.html', urlencodedParser, function(request, response) {
    clc1++;
    return response.send(String(clc1));  // отправка ответа - строки
});

// устанавливаем обработчик для маршрута "/game1.html" (метод POST)
app.post('/game1.html', urlencodedParser, function(request, response) {
    clientCount++;
    return response.send(String(clientCount));  // отправка ответа - строки
});

// устанавливаем обработчик для маршрута "/game.html" (метод GET)
app.get('/game.html', function (request, response) {
    response.sendFile(__dirname + '/client/game.html');   // отправка ответа - html страницы
});

app.use(express.static(__dirname + "/client"));   // работа со статическими файлами html в express
app.use(express.urlencoded({extended: true}));   // планируется использовать сложные алгоритмы глубокого парсинга, со сложными объектами
app.use(bodyParser.json());   // планируется работа с json


// начинаем прослушивание подключений на 3000 порту
app.listen(3000, function () {
    console.log('App listening on port 3000!');
});

let req = {
    i1: -1,
    j1: -1,
    val1: "X",
    i2: -1,
    j2: -1,
    val2: "X",
    i3: -1,
    j3: -1,
    val3: "X",
    move: -1,
    alvX: 1,
    alvO: 1,
    isDisconnect: false
};

let move = 1;
let data;

// устанавливаем обработчик для маршрута "/game.html" (метод POST)
app.post('/game.html', function (request, response) {
    data = request.body;
    if (move === data.move && clientOut === false){
        req = data;
        if (move === 1) move = 2;
        else if (move === 2) move = 1;
    }
    return response.json(req);   // отправка ответа - json объекта
});

let clients = [];
// устанавливаем обработчик для маршрута "/do_act" (метод POST)
app.post('/do_act', urlencodedParser, function (request, response) {
    data = request.body;
    if (move === data.move && clientOut === false){
        req = data;
        if (move === 1) move = 2;
        else if (move === 2) move = 1;
    }
    for (let i = 0; i < clients.length; i++) {
        clients[i].json(req);
    }
    clients = [];
});

// устанавливаем обработчик для маршрута "/subscribe" (метод GET)
app.get('/subscribe', function (request, response) {
    let id = clients.push(response) - 1;
    request.on('close', function() {
        delete clients[id];
    })
})

// устанавливаем обработчик для маршрута "/gameover" (метод GET)
app.get("/gameover", urlencodedParser, function(request, response){
    clientOut = true;
    clientCount--;
    if (gameOverCounts === 0) {
        response.sendFile(__dirname + '/client/index.html');
        gameOverCounts++;
    }
});

// устанавливаем обработчик для маршрута "/gameover" (метод POST)
app.post("/gameover", urlencodedParser, function(request, response){
    if (clientOut === true)
        response.send("no");
});

// устанавливаем обработчик для маршрута "/insertdb" (метод POST)
app.post("/insertdb", urlencodedParser, function (request, response) {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;   // смещение временной зоны
    let data = new Date(Date.now() - tzoffset).toISOString().slice(0, 19).replace('T', ' ');   // сохраняем текущее время в нужном виде
    if (request.body.win !== undefined) {
        // работаем с БД
        database.query('INSERT INTO stat_games SET wins = ?, t = ?, d = ?', [request.body.win, Math.abs(request.body.gameLen.minutes * 60 - Math.abs(request.body.gameLen.seconds)), data]);
    }
});

// устанавливаем обработчик для маршрута "/getFromDB" (метод POST)
app.post("/getFromDB", urlencodedParser, function(request, response){
    // работаем с БД
    let data = database.query('SELECT * FROM stat_games');
    console.log(data);
    response.send(data);
});