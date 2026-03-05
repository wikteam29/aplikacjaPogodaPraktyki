//skrypt dla zapisywania ostatnio wybranej jednostki
if(!localStorage.getItem("lastCity")){
    localStorage.setItem("lastCity","Łódź")
}
document.getElementById("cityInput").value = localStorage.getItem("lastCity");

//skrypt dla zapisywania ostatnio wybranej jednostki
if(!localStorage.getItem("lastUnit")){
    localStorage.setItem("lastUnit","°C")
}
document.getElementById("unitSwitch").textContent = localStorage.getItem("lastUnit");

//skrypt dla zapisywania ostatnio wybranego trybu
if(!localStorage.getItem("lastMode")){
    localStorage.setItem("lastMode","🌙")
}
document.getElementById("BDswitch").textContent = localStorage.getItem("lastMode");
if(localStorage.getItem("lastMode") == "☀️"){
    darkMode();
}else{
    brightMode();
}

//tryb ciemny
function darkMode(){
    //emotikon
    document.getElementById("BDswitch").textContent = "☀️";
    localStorage.setItem("lastMode","☀️")

    //tło
    document.querySelector("video").src = "img vid/skyBGdark.mp4"

    //background'y
    document.querySelector("header.pageHeader").id = "darkPageHeader";//header
    document.querySelector("main.pageMain").id = "darkPageMain";//main
    document.querySelector("input").style.backgroundColor = "rgb(20, 35, 55)";//input
    document.getElementById("date").style.backgroundColor = "rgb(20, 35, 55)";//select z datą
    let sections = document.querySelectorAll("section");//sekcje
    for(let i=0;i<sections.length;i++){
        sections[i].style.backgroundColor = "rgb(20, 35, 55)";
    }

    //przyciski
    let buttons = document.querySelectorAll("button");
    for(let i=0;i<buttons.length;i++){
        buttons[i].classList.add("darkButton");
    }

    //kolor czcionki
    let everything = document.querySelectorAll("*");
    for(let i=0;i<everything.length;i++){
        everything[i].style.color = "white";
    }
}
//tryb jasny
function brightMode(){
    //emotikon
    document.getElementById("BDswitch").textContent = "🌙";
    localStorage.setItem("lastMode","🌙")

    //tło
    document.querySelector("video").src = "img vid/skyBG.mp4"

    //background'y
    document.querySelector("header.pageHeader").id = "";//header
    document.querySelector("main.pageMain").id = "";//main
    document.querySelector("input").style.backgroundColor = "white";//input
    document.getElementById("date").style.backgroundColor = "white";//select z datą
    let sections = document.querySelectorAll("section");//sekcje
    for(let i=0;i<sections.length;i++){
        sections[i].style.backgroundColor = "white";
    }

    //przyciski
    let buttons = document.querySelectorAll("button");
    for(let i=0;i<buttons.length;i++){
        buttons[i].classList.remove("darkButton");
    }

    //kolor czcionk
    let everything = document.querySelectorAll("*");
    for(let i=0;i<everything.length;i++){
        everything[i].style.color = "rgb(58, 80, 133)";
    }
}

//switch
function brightDarkSwitch(){
    let actualMode = document.getElementById("BDswitch").textContent;
    if(actualMode == "🌙"){
        darkMode();
    }else if(actualMode == "☀️"){
        brightMode();
    }
}

//skrypt dla Fahrenheit-Celsjusz switcha
function unitSwitch(){
    console.log("fsdfsfsdfds");

    let actualUnit = document.getElementById("unitSwitch").textContent;

    if(actualUnit == "°C"){
        document.getElementById("unitSwitch").textContent = "°F";
        localStorage.setItem("lastUnit","°F")
    }else{
        document.getElementById("unitSwitch").textContent = "°C";
        localStorage.setItem("lastUnit","°C")
    }

    city();
}

//skrypt dla daty
const d = new Date();
for(let i=0;i<5;i++){
    let day = d.getDate() + i;
    let month = d.getMonth() + 1;
    let year = d.getFullYear();

    let option = document.createElement("option");
    if(day < 10 && month < 10){
        option.textContent = year + "-0" + month + "-" + "0" + day;
    }else if(day < 10 && month > 10){
        option.textContent = year + "-" + month + "-" + "0" + day;
    }else if(day > 10 && month < 10){
        option.textContent = year + "-0" + month + "-" + day;
    }else{
        option.textContent = year + "-" + month + "-" + day;
    }
    
    document.getElementById("date").appendChild(option);
}

//skrypt dla godziny
function updateTime(){
    const d = new Date();
    let hour = d.getHours();
    let minutes = d.getMinutes();
    if(minutes < 10){
        minutes = "0" + minutes
    }
    document.getElementById("hour").textContent = " " + hour + ":" + minutes;
}
updateTime();
setInterval(updateTime, 5000);

//funkcje loadingu
function setStatus(text){
    document.getElementById("status").textContent = text;
}
function clearStatus(){
    document.getElementById("status").textContent = "";
}

const apiKey = "e52b84c05a752aa741c367dc2396fc41";

//skrypt dla miasta
function city(){
    let city = document.getElementById("cityInput").value;

    if(city === ""){
        setStatus("⚠️ Wpisz nazwę miasta");
        return;
    }

    localStorage.setItem("lastCity", city);
    pogoda(city);
}

const cityInput = document.getElementById("cityInput");
cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter"){ // sprawdzamy czy wciśnięto Enter
        city();
    }
});


//funkcja pogody
function pogoda(city){
    setStatus("⏳ Pobieranie danych...");

    let DegreeUnit = document.getElementById("unitSwitch").textContent;
    let unitSystem = "";
    let windUnit = "";

    if(DegreeUnit == "°C"){
        unitSystem = "metric";
        windUnit = "m/s"

    }else{
        unitSystem = "imperial"
        windUnit = "mph"
    }

    let selectedDate = document.getElementById("date").value;

    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=" + unitSystem + "&lang=pl")
    .then(response => {
        if(!response.ok){
            throw new Error("HTTP error: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        if(!data.list || data.list.length === 0){
            setStatus("❌ Brak prognozy dla tego miasta");
            return;
        }
        let dayData = data.list.filter(item => item.dt_txt.startsWith(selectedDate));
        let target = dayData.find(item => item.dt_txt.includes("12:00:00")) || dayData[0];

        document.getElementById("mainTemp").textContent = Math.round(target.main.temp) + DegreeUnit;
        document.getElementById("feelsLike").textContent = "Odczuwalna " + Math.round(target.main.feels_like) + DegreeUnit;

        document.getElementById("humidity").textContent = "💧 Wilgotność: " + target.main.humidity + "%";
        document.getElementById("pressure").textContent = "🌡 Ciśnienie: " + target.main.pressure + "hPa";
        document.getElementById("wind").textContent = "💨 Wiatr: " + target.wind.speed + windUnit;

        const cloudPercentage = target.clouds.all;
        let cloudTextWithEmoji;

        switch (true){ // używamy true, żeby warunki działały
            case (cloudPercentage === 0):
                cloudTextWithEmoji = "☀️<br>Bezchmurnie";
                break;
            case (cloudPercentage > 0 && cloudPercentage <= 25):
                cloudTextWithEmoji = "🌤️<br>Przejrzysto";
                break;
            case (cloudPercentage > 25 && cloudPercentage <= 50):
                cloudTextWithEmoji = "⛅<br>Częściowe zachmurzenie";
                break;
            case (cloudPercentage > 50 && cloudPercentage <= 75):
                cloudTextWithEmoji = "🌥️<br>Zachmurzenie umiarkowane";
                break;
            case (cloudPercentage > 75 && cloudPercentage < 100):
                cloudTextWithEmoji = "☁️<br>Pochmurno";
                break;
            case (cloudPercentage === 100):
                cloudTextWithEmoji = "☁️☁️<br>Całkowite zachmurzenie";
                break;
            default:
                cloudTextWithEmoji = "❓ Brak danych o zachmurzeniu";
        }

        document.getElementById("cloudSection").innerHTML = cloudTextWithEmoji;

        let sunrise = new Date(data.city.sunrise * 1000); 
        let sunset = new Date(data.city.sunset * 1000); 
        let sunriseString = ""; 
        let sunsetString = ""; 

        if(sunrise.getMinutes() < 10){ 
            sunriseString = sunrise.getHours() + ":0" + sunrise.getMinutes(); 
        }else{ 
            sunriseString = sunrise.getHours() + ":" + sunrise.getMinutes(); 
        } 
        
        if(sunset.getMinutes() < 10){ 
            sunsetString = sunset.getHours() + ":0" + sunset.getMinutes(); 
        }else{ 
            sunsetString = sunset.getHours() + ":" + sunset.getMinutes(); 
        }

        document.querySelector("section.sunPhaseSection").innerHTML = "🌅 Wschód słońca: " + sunriseString + "<br> 🌇 Zachód słońca: " + sunsetString + " <small>*Wschód i zachód są pokazywane tylko dla dnia bierzącego</small>";
        clearStatus();
    })
    .catch(error => {
        console.error(error);

        if(error.message.includes("404")){
            setStatus("❌ Nie znaleziono miasta");
        }else{
            setStatus("⚠️ Błąd połączenia z serwerem");
        }
    });
}

city();