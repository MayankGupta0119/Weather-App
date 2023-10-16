const usertab = document.querySelector("[data-userweather]");
const searchtab = document.querySelector("[data-searchweather]");
const usercontainer = document.querySelector(".weather-container-2");
const grantAcessContainer = document.querySelector(".grant-location");
const bottomData = document.querySelector(".data-at-bottom");
const searchForm = document.querySelector(".form-container");
const loadContainer = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-contianer");

//intial variables
const apikey = "d9de52db31694409b96a8c730d82276e";
let currentTab = usertab;
currentTab.classList.add("current-tab"); // css property added
getFromSessionStorage(); // there can be some cases where intially when we load the site some values of latitude and longitude were present
// therefore calling this function, if its not there it will ask for location or else will show for that location which is already there.

function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    //both tab are different then switch will occur
    nf.classList.remove("active");
    currentTab.classList.remove("current-tab"); // removed the background selected property, as this tab is deselected
    currentTab = clickedTab;
    currentTab.classList.add("current-tab"); // again added the background property(current-tab is a css proprety) to new updated current tab.

    if (!searchForm.classList.contains("active")) {
      //if active is not applied to searchform, then apply it since its been selected or clicked.
      userInfoContainer.classList.remove("active"); //as we clicked on searchtab, search form will appear and rest two user location wheather data and grantlcoation should get hide.
      grantAcessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      //this means we are at searchtab and now clicked at your tab, therefore hide searchtab
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //now when going to your tab, the location which was stored at that particular tab session, the weather for that location should be displayed in your tab .
      getFromSessionStorage();
    }
  }
}

usertab.addEventListener("click", () => {
  //pass clicked tab as input parameter to switchTab function, to change current tab
  switchTab(usertab); // tab will switch to usertab
});
searchtab.addEventListener("click", () => {
  //pass clicked tab as input parameter to switchTab function, to change current tab
  switchTab(searchtab); // tab will switch to searchtab
});

//check if location is already present in session storage
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates"); //sessionStorage.getItem this is built in function
  if (!localCoordinates) {
    //if location is not there, then that means that location is not granted, therefore ask for location
    grantAcessContainer.classList.add("active"); // this becomes visible
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}
const nf = document.querySelector("[not-found]");
const data_at_bottom = document.querySelector("[dataBottom]");
async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  //making api call, therefore apply loading screen, by removing grant access screen
  grantAcessContainer.classList.remove("active");
  data_at_bottom.classList.add("active");
  // making loader visible
  loadContainer.classList.add("active");
  //api call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`
    );
    console.log(response);
    const data = await response.json();
    console.log(data);
    loadContainer.classList.remove("active");
    //after api call we got the data, therefore remove the loading screen, and display weather info
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadContainer.classList.remove("active");
    searchForm.classList.remove("active");
  }
}

function renderWeatherInfo(data) {
  //firstly fetching all data from the data we got through api
  const cityname = document.querySelector("[data-cityname]");
  const countryicon = document.querySelector("[data-countryicon]");
  const weatherdesc = document.querySelector("[data-description]");
  const weathericon = document.querySelector("[weather-icon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humdity = document.querySelector("[data-humidity]");
  const clouds = document.querySelector("[data-cloud]");
  const bottom_cityname = document.querySelector("[cityname]");
  const bottom_countryname = document.querySelector("[countryname]");
  const bottom_tempdata = document.querySelector("[tempData]");
  const weathertext = document.querySelector("[weatherCondtionImage]");
  const wrapdiv = document.querySelector("[wrapclass]");
  console.log("-------------------------");
  console.log("grant req se aayi hui data = " + data);
  // putting in ui elements
  //using optional channing parameter ? to handle the error
  // suppose we wrote user?.address?.zipcode --> this means inside user their can be a address, if its there then we got the values else it
  //will return undefined, this will not return error. thats the advantage of using ?
  cityname.innerText = data?.name;
  countryicon.src = `https://flagcdn.com/60x45/${data?.sys?.country.toLowerCase()}.png`;
  weatherdesc.innerText = data?.weather?.[0]?.description;
  console.log(data?.weather?.[0]?.description + "----------------");
  if (data?.weather?.[0]?.description === "haze") {
    weathertext.style.backgroundImage = 'url("./haze.jpg")';
    wrapdiv.style.backgroundImage = 'url("./haze.jpg")';
    console.log("setting hola");
  } else if (data?.weather?.[0]?.description === "clear sky") {
    weathertext.style.backgroundImage = 'url("./clear-sky.jpg")';
    wrapdiv.style.backgroundImage = 'url("./clear-sky.jpg")';
  } else if (data?.weather?.[0]?.description.toLowerCase().includes("clouds")) {
    weathertext.style.backgroundImage = 'url("./cloudy.jpg")';
    wrapdiv.style.backgroundImage = 'url("./cloudy.jpg")';
  } else if (data?.weather?.[0]?.description.toLowerCase().includes("rain")) {
    weathertext.style.backgroundImage = 'url("./thunder.jpg")';
    wrapdiv.style.backgroundImage = 'url("./thunder.jpg")';
  } else if (data?.weather?.[0]?.description.toLowerCase().includes("mist")) {
    weathertext.style.backgroundImage = 'url("./mist.jpg")';
    wrapdiv.style.backgroundImage = 'url("./mist.jpg")';
  } else if (
    data?.weather?.[0]?.description.toLowerCase().includes("drizzle")
  ) {
    weathertext.style.backgroundImage = 'url("./drizzle.jpg")';
    wrapdiv.style.backgroundImage = 'url("./drizzle.jpg")';
  } else if (data?.weather?.[0]?.description.toLowerCase().includes("smoke")) {
    weathertext.style.backgroundImage = 'url("./smoke.jpg")';
    wrapdiv.style.backgroundImage = 'url("./smoke.jpg")';
  }
  weathericon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
  temp.innerText = `${data?.main?.temp} °C`;
  windspeed.innerText = `${data?.wind?.speed} m/s`;
  humdity.innerText = `${data?.main?.humidity}%`;
  clouds.innerText = `${data?.clouds?.all}%`;
  bottom_cityname.innerText = data?.name;
  bottom_countryname.innerText = data?.sys?.country.toUpperCase();
  bottom_tempdata.innerText = `Feels Like  ${data?.main?.feels_like} °C`;
}
function showPosition(position) {
  //creating coordinates object with lat and lon
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("error in getlocation");
  }
}
const grant_btn = document.querySelector("[data-grantAccess]");
grant_btn.addEventListener("click", getLocation);

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value === "") {
    return;
  } else {
    fetchSearchedWeatherInfo(searchInput.value);
  }
});
async function fetchSearchedWeatherInfo(city) {
  loadContainer.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAcessContainer.classList.remove("active");
  nf.classList.remove("active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`
    );
    const data = await response.json();
    if (data?.cod == 404) {
      loadContainer.classList.remove("active");
      nf.classList.add("active");
    } else {
      loadContainer.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    }
  } catch (err) {}
}
