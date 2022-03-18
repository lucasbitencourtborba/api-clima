<h1 align="center">🌥API-Clima🌥</h1>
 
 ## Descrição do Projeto
 <br>
 <p align="justify">Neste web app, foi desenvolvida uma aplicação em que você coloca o nome de sua cidade no input e ela te retorna o clima do lugar e sugere algumas atividades para serem feitas de acordo com o clima atual</p>
 <p align="justify">Esse foi um dos meus primeiros projetos, consegui aprender bastante com ele sobre como fazer requisições de API e foi muito satisfatório!</p> 
  <p align="justify">Tecnologias usadas: HTML, CSS, JAVASCRIPT, BOOTSTRAP E API WEATHER</p>
 <img style="width: 40%;" src="https://cdn.discordapp.com/attachments/673648456073478164/954425335208890408/unknown.png">
 <img style="width: 40%;" src="https://cdn.discordapp.com/attachments/673648456073478164/954425441073119282/unknown.png">
 
 ## Explicações
 - Aqui pegamos a geolocalização do navegador 
 
 ```js
window.addEventListener('load', () => {
    // Pega as coordenadas com o geolocation
    //if ("geolocation" in navigator)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    }
    else {
        alert('navegador não suporta geolozalicação');
    }
    function setPosition(position) {
        console.log(position)
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        coordResults(lat, long);
    }
    function showError(error) {
        alert(`erro: ${error.message}`);
    }
})

```
Essa function é responsável por mandar a latitude e longitude para a API weather e retorna todas as informações para a displayResults

```js
function coordResults(lat, long) {
    // Requisição para api, manda a lat e long
    fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            displayResults(response)
        });
}
 
 ```
 Chama as functions no momento em que o botão é clicado ou o enter é pressionado
 ```js
 search_button.addEventListener('click', function (){
    searchResults(search_input.value)
    requireJson()
})

search_input.addEventListener('keypress', enter)
function enter(event) {
    key = event.keyCode
    if (key === 13) {
        searchResults(search_input.value)
        requireJson()
    }
}
  ```
  Essa function pesquisa a cidade que foi digita e retorna suas informações
   ```js
   function searchResults(city) {
    fetch(`${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)

            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            displayResults(response)
        })
        
}
   ```
   Function resposável por digitar todos as informações sobre o clima referente a cidade que foi digitada
   ```js
   function displayResults(weather) {
    console.log(weather)

    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    date.innerText = dateBuilder(now)
    
    let iconName = weather.weather[0].icon;
    container_img.innerHTML = `<img src="./assets/icons/${iconName}.png">`

    let temperature = `${Math.round(weather.main.temp)}`
    temp_number.innerHTML = temperature;
    temp_unit.innerHTML = `°c`;

    let weather_tempo = weather.weather[0].description;
    weather_t.innerText = capitalizeFirstLetter(weather_tempo)

    low_high.innerText = `Min: ${Math.round(weather.main.temp_min)}°c  | Max: ${Math.round(weather.main.temp_max)}°c`;

    weather_temp = weather.weather[0].main
}
   ```
   Faz a requisição do arquivo JSON que contém as atividades
   ```js
   function requireJson() {
    fetch("MOCK_DATA.json")
        .then(response => {
            return response.json();
})
        .then(obj =>{
            activities(obj)
        })
}
   ```
   Função que cria as listas com as atividades e seu respectivos preços e coloca na página
   ```js
   function activities (json) {
    let listActivities = []
    let listPrices = []
    let listActivitiesAndPrices = []
    
    for (c in json){
        if (json[c].suggested_weather_conditions == weather_temp){
            listActivities.push(json[c].activity_title)
            if (json[c].requisites.cost != null){
                listPrices.push(json[c].requisites.cost)
            } else {
                listPrices.push('Grátis')
            }
        } else{continue}
    }

    for (n in listActivities){
        listActivitiesAndPrices.push(`${listActivities[n]}, Preço: ${listPrices[n]} <br>`)
        what.innerHTML = `Atividades sugeridas para o clima <br> ${listActivitiesAndPrices}`
    }
}
 ```





> Status do Projeto: Em desenvolvimento :warning:, pretendo ainda melhorá-lo mais para frente
