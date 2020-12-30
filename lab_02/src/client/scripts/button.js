let button = document.getElementById("btn");
let stat_button = document.getElementById("Stats");

document.addEventListener("DOMContentLoaded", function(event) {       // обработчик события "браузер полностью загрузил HTML, 
                                                                      // было построено DOM-дерево, но внешние ресурсы 
                                                                      // (например, картинки <img> и стили) могут быть ещё не загружены.
    let clientCount = 0;
    let xhttp = new XMLHttpRequest();                                 // создание объекта XMLHttpRequest
    xhttp.onreadystatechange = function() {                           // обработчик события, которое происходит при каждой смене состояния объекта
        if (this.readyState === 4 && this.status === 200) {           // текущее состояние объекта (4 - данные загружены)
            clientCount = Number(this.response);
            console.log(clientCount);
            if (clientCount % 2 === 0){
                button.innerHTML = "Присоединится";
            } else {
                button.innerHTML = "Начать игру";
            }
        }
    }
    xhttp.open("POST", "http://localhost:3000/index.html", true);     // определяет метод, URL и другие опциональные параметры запроса
    xhttp.send();                                                     // отправляет запрос на сервер.
});

function buildTable(array_elements) {
    let newTable = document.createElement("table");
    let newRow = newTable.insertRow(0);
    let newCell1 = newRow.insertCell(0);
    newCell1.innerHTML = String("Номер игры");
    let newCell2 = newRow.insertCell(1);
    newCell2.innerHTML = String("Победитель");
    let newCell3 = newRow.insertCell(2);
    newCell3.innerHTML = String("Время");
    let newCell4 = newRow.insertCell(3);
    newCell4.innerHTML = String("Дата");
    for (var i = 1; i < array_elements.length + 1; i++) {
        let newRow = newTable.insertRow(i);
        let newCell1 = newRow.insertCell(0);
        newCell1.innerHTML = array_elements[i - 1].id;
        let newCell2 = newRow.insertCell(1);
        newCell2.innerHTML = array_elements[i - 1].wins;
        let newCell3 = newRow.insertCell(2);
        newCell3.innerHTML = array_elements[i - 1].t;
        let newCell4 = newRow.insertCell(3);
        newCell4.innerHTML = array_elements[i - 1].d;
    }
    let prev_block = document.getElementById("prev");
    prev_block.appendChild(newTable);
}

stat_button.addEventListener("click", function (event) {             // обработчик события "нажали на кнопку со статистикой"
    let xhttp = new XMLHttpRequest();                                // создание объекта XMLHttpRequest
    xhttp.onreadystatechange = function() {                          // обработчик события, которое происходит при каждой смене состояния объекта
        if (this.readyState === 4 && this.status === 200) {          // текущее состояние объекта (4 - данные загружены)
            buildTable(this.response);
        }
    }
    xhttp.open("POST", "http://localhost:3000/getFromDB", true);                 // определяет метод, URL и другие опциональные параметры запроса
    xhttp.responseType = 'json';                                                 // определяем тип данных, содержащихся в ответе
    xhttp.setRequestHeader("Content-type", 'application/json; charset=utf-8');   // добавляет HTTP-заголовок к запросу.
    xhttp.send();                                                                // отправляет запрос на сервер.
})
