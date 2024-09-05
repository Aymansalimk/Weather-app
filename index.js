// Select the elements with the custom attributes
const userWeather = document.querySelector('[data-userWeather]');
const searchWeather = document.querySelector('[data-searchWeather]');
const cityName = document.querySelector('[data-cityName]');
const countryFlag = document.querySelector('[data-countryFlag]');
const weatherDescription = document.querySelector('[data-weatherDescription]');
const weatherIcon = document.querySelector('[data-weatherIcon]');
const temp = document.querySelector('[data-temp]');
const windSpeed = document.querySelector('[data-windSpeed]');
const humidity = document.querySelector('[data-humidity]');
const clouds = document.querySelector('[data-clouds]');
const formContainer =document.querySelector(".searchbar");
const grantLocation =document.querySelector(".grantLocationcontainer");
const loader =document.querySelector(".loading");
const usercontainer =document.querySelector(".showWeather");
const weatherCard = document.querySelector('[data-weatherCard]');
const searchitem = document.querySelector('[data-inputbar]');
const maincontainer =document.querySelector(".container");

// Now you can use these variables to manipulate the DOM
// Example: userWeather.textContent = 'Sunny';


function getFromsession(){
    const localCoordinates =sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantLocation.classList.remove('hidden');

    }
    else{
        const coordinates =JSON.parse(localCoordinates);
        fetchWeatherinfo(coordinates);


    }
}
grantLocation.addEventListener('click',getlocation);
    
function getlocation(){
    grantLocation.classList.add('hidden');
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(currentPos);
    }
    else{
        console.log('No geo locaton support');
    }
}
function currentPos(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchWeatherinfo(userCoordinates);
    
}

async function fetchWeatherinfo(coordinates){
    const {lat,lon} =coordinates; //distructing or extracting propertiesfrom coordinates object
    loader.classList.remove('hidden');
    try{
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        let data=await response.json();
        
        loader.classList.add('hidden');
        putInfoincards(data);
        usercontainer.classList.remove('hidden');
        

    }
    catch(err){
        loader.classList.add('hidden');  
    }

    

}
let currentTab=userWeather;
function switchTab(clickedTab){
    if(currentTab!=clickedTab){
        usercontainer.classList.add('hidden');
        currentTab.classList.remove('bg-slate-400');
        currentTab=clickedTab;
        currentTab.classList.add('bg-slate-400');

        if(formContainer.classList.contains('hidden')){
            formContainer.classList.remove('hidden');
            grantLocation.classList.add('hidden');
        }
        else{
            formContainer.classList.add('hidden');
            getFromsession();
        }

        


    }
}
userWeather.addEventListener("click",()=>{
    switchTab(userWeather);
});
searchWeather.addEventListener("click",()=>{
    switchTab(searchWeather);
});


function putInfoincards(data){
   
    
    cityName.innerText=data?.name;
    // countryFlag.src=`https://flagcdn.com/16x12/${data?.}.png`
    weatherDescription.innerText=data?.weather?.[0]?.description;
    if (weatherDescription.innerText.toLowerCase() === "clear sky") {
        maincontainer.classList.add('bg-gradient-to-b', 'from-blue-200', 'via-blue-100', 'to-white');
    } else if (weatherDescription.innerText.toLowerCase() === "few clouds") {
        maincontainer.classList.add('bg-gradient-to-b', 'from-gray-300', 'to-gray-500');
    } else if (weatherDescription.innerText.toLowerCase() === "scattered clouds") {
        maincontainer.classList.add('bg-gradient-to-b', 'from-gray-400', 'to-gray-600');
    } else if (weatherDescription.innerText.toLowerCase() === "broken clouds") {
        maincontainer.classList.add('bg-gradient-to-b', 'from-gray-500', 'to-gray-700');
    } else if (weatherDescription.innerText.toLowerCase() === "shower rain") {
        maincontainer.classList.add('bg-gradient-to-b', 'from-gray-600', 'to-blue-900');
    } else if (weatherDescription.innerText.toLowerCase() === "rain") {
        maincontainer.classList.add('bg-gradient-to-b', 'from-gray-500', 'to-blue-700');
    } else if (weatherDescription.innerText.toLowerCase() === "thunderstorm") {
        maincontainer.classList.add('bg-gradient-to-b', 'from-gray-700', 'to-blue-800');
    } else if (weatherDescription.innerText.toLowerCase() === "snow") {
        maincontainer.classList.add('bg-gradient-to-b', 'from-gray-100', 'to-white');
    } else if (weatherDescription.innerText.toLowerCase() === "mist") {
        maincontainer.classList.add('bg-gradient-to-b', 'from-blue-200', 'via-blue-100', 'to-yellow-100');
    } else {
        // Default background if no specific weather matches
        maincontainer.classList.add('bg-gradient-to-b', 'from-blue-200', 'to-blue-300');
    }
    
    temp.innerText=data?.main?.temp;
    windSpeed.innerText=data?.wind?.speed;
    humidity.innerText=data?.main?.humidity;
    clouds.innerText=data?.clouds?.all;

}


formContainer.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchitem.value==="") return;

    getinfobycity(searchitem.value);
})
async function getinfobycity(city){
    loader.classList.remove('hidden');
    usercontainer.classList.add('hidden');
    let response2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city }&appid=${API_key}&units=metric`);
    let data2=await response2.json();
    putInfoincards(data2);
    loader.classList.add('hidden');
    usercontainer.classList.remove('hidden');

}

