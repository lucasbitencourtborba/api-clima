
const api = {
    key: "de0833404b0795d565099a451383e707",
    base: "https://api.openweathermap.org/data/2.5/",
    lang: "pt_br",
    units: "metric"
}


const city = document.querySelector('.city')
const date = document.querySelector('.date');
const container_img = document.querySelector('.container-img');
const container_temp = document.querySelector('.container-temp prin');
const temp_number = document.querySelector('.container-temp div');
const temp_unit = document.querySelector('.container-temp span');
const weather_t = document.querySelector('.weather');
const search_input = document.querySelector('.form-control');
const search_button = document.querySelector('.btn');
const low_high = document.querySelector('.low-high');
const what = document.querySelector('.what-to-do');

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

function requireJson() {
    fetch("MOCK_DATA.json")
        .then(response => {
            return response.json();
})
        .then(obj =>{
            activities(obj)
        })
}

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

function dateBuilder(d) {
    let days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    let months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julio", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    let day = days[d.getDay()]; //getDay: 0-6
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} de ${month} de ${year}`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


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