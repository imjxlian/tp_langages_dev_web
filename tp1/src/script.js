'use strict';

const apiKey = 'd367d2b32c6effdcff8407f35c63c1d7';
// const apiKey = '7aa887c381f3021f19462c39c14c98ee';
const apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?units=metric&lang=fr&appid=' + apiKey + '&q=';
const iconUrl = 'http://openweathermap.org/img/w/';

const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const dataPerDay = 8;

function computeDayFromDatetime(datetime) {
  // Transformation en millisecondes
  const timestamp = datetime * 1000;
  // Création d'un objet Date
  const date = new Date(timestamp);
  // Récupération du jour de la semaine
  const day = date.getDay();
  // Récupération du nom du jour
  return days[day];
}

function render(cityName, weatherToShow) {
  // Suppression des anciens blocs
  document.getElementById('render').innerHTML = '';

  // Affichage de la ville
  document.getElementById('city-title').innerHTML = cityName;

  // Récupération du conteneur des jours
  const daysContainer = document.getElementById('render');

  weatherToShow.forEach(weather => {
    // Création des blocs pour chaque jour
    let container = document.createElement('div');
    container.className = 'col-sm';

    let title = document.createElement('h2');
    title.innerHTML = weather.date;

    let imgContainer = document.createElement('div');
    imgContainer.className = 'd-flex';
    weather.icons.forEach(icon => {
      let img = document.createElement('img');
      img.src = icon;
      imgContainer.appendChild(img);
    });

    let temp = document.createElement('p');
    temp.innerHTML = weather.temp + '°C';

    let clouds = document.createElement('p');
    clouds.innerHTML = weather.clouds + '%';

    container.appendChild(title);
    container.appendChild(imgContainer);
    container.appendChild(temp);
    container.appendChild(clouds);

    daysContainer.appendChild(container);
  });
}

function handleData(data) {
  // Récupération du nom de la ville
  const cityName = data.city.name;

  // Parcours des données reçues
  const weatherToShow = [];
  let i = 0;
  let tempSum = 0;
  let cloudsSum = 0;
  let weather = {};
  data.list.forEach(entry => {
    if (i % 8 === 0) {
      tempSum = 0;
      cloudsSum = 0;
      weather = {};
      weather.date = computeDayFromDatetime(entry.dt);
      weather.icons = [];
    }
    
    weather.icons.push(iconUrl + entry.weather[0].icon + '.png');
    tempSum += entry.main.temp;
    cloudsSum += entry.clouds.all;

    if (i % 8 === 7) {
      weather.temp = (tempSum / dataPerDay).toFixed(1);
      weather.clouds = (cloudsSum / dataPerDay).toFixed(2);
      weatherToShow.push(weather);
    }

    i++;
  });

  // Affichage des données
  render(cityName, weatherToShow);
}

function searchWeather(event) {
  // Prévention de la soumission du formulaire
  event.preventDefault();

  // Récupération du champ city renseigné par l'utilisateur
  const city = document.getElementById('city');
  const url = apiUrl + city.value;

  // Appel avec Ajax (XMLHttpRequest)
  /*
  const request = new XMLHttpRequest();
  request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
              handleData(JSON.parse(request.responseText));
          } else {
              console.log('Erreur : ' + request.status);
          }
      }
  };
  request.open('GET', url);
  request.send();
  */
  

  // Appel avec fetch ES6
  fetch(url)
    .then(response => response.json())
    .then(handleData)
    .catch(error => console.log(error));
}
