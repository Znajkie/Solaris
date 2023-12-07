const url = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies';
const urlKey = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys';

// Stars animation for overlay
const ctx = stars.getContext('2d');
const W = window.innerWidth;
const H = window.innerHeight;
const button = document.querySelector('button');
let changeColor = document.getElementById('aside-planet');
let key;

// Gör så att #overlay visas, har default som display.none
const on = () => {
  document.getElementById('overlay').style.display = 'block';
};
// Gör så att #overlay göms
const off = () => {
  document.getElementById('overlay').style.display = 'none';
};

const formatNumberWithSpaces = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Get the API KEY
const getKey = async () => {
  try {
    const response = await fetch(urlKey, {
      method: 'POST',
      headers: { 'x-zocom': key },
    });
    if (response.ok) {
      const keyData = await response.json();
      key = keyData.key;
      return key;
    } else {
      console.error('Request failed with status:', error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Get data with the generated key from GetKey
const getData = async () => {
  try {
    if (!key) {
      await getKey();
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'x-zocom': key },
    });

    if (response.ok) {
      const data = await response.json();
      const planets = data.bodies;

      // Define a mapping of planet IDs to background colors
      const planetColorMap = {
        0: '#FFD029', //Solen
        1: '#888888', //Merkurius
        2: '#E7CDCD', //Venus
        3: '#428ED4', //Jorden
        4: '#EF5F5F', //Mars
        5: '#E29468', //Juptier
        6: '#C7AA72', //Saturnus
        7: '#C9D4F1', //Uranus
        8: '#7A91A7', //Neptunus
      };
      // loops dom elements and checking planet names, adding evenlistener that checks which id is has and change the color to the new color that matches the id.
      planets.forEach((planet) => {
        let element = document.getElementById(planet.name.toLowerCase());

        if (element) {
          element.addEventListener('click', () => {
            // Check if the planet ID exists in the color map
            if (planetColorMap.hasOwnProperty(planet.id)) {
              changeColor.style.backgroundColor = planetColorMap[planet.id];
            } else {
              console.log('Invalid planet ID');
            }

            // On() = Display.block
            on();

            // Object containing the DOM element IDs and their corresponding planet properties

            const planetObject = {
              'planet-name': planet.name,
              'planet-latin': planet.latinName,
              'planet-info': planet.desc,
              'planet-cf': `<span class="bold-text">OMKRETS</span> ${formatNumberWithSpaces(planet.circumference)} km`,
              'planet-distance': `<span class="bold-text">KM FRÅN SOLEN</span> ${formatNumberWithSpaces(planet.distance)} km`,
              'planet-max': `<span class="bold-text">MAX TEMPERATUR</span> ${planet.temp.day}C`,
              'planet-min': `<span class="bold-text">MIN TEMPERATUR</span> ${planet.temp.night}C`,
            };

            // Update the DOM elements, Boolean that checks if planetObject have planetObjectEl.
            for (const planetObjectEl in planetObject) {
              if (planetObject.hasOwnProperty(planetObjectEl)) {
                const domPlanetEl = document.getElementById(planetObjectEl);
                domPlanetEl.innerHTML = planetObject[planetObjectEl];
              }
            }
            const planetMoonsEl = document.getElementById('planet-moons');
            planetMoonsEl.innerHTML = `<p><span class="bold-text">MÅNEN</span></p>`;

            if (planet.moons.length) {
              planet.moons.forEach((moon) => {
                const moonEl = document.createElement('p');
                moonEl.innerText = moon;
                planetMoonsEl.append(moonEl);
              });
            } else {
              const noMoonsEl = document.createElement('p');
              noMoonsEl.innerText = `${planet.name} has no moons.`;
              planetMoonsEl.append(noMoonsEl);
            }
          });
        } else {
          console.log(`Element for planet ${planet.name} not found`);
        }
      });
    } else {
      console.error('Request failed with status:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Activates Display:none on overlay
button.addEventListener('click', () => {
  off();
});

//Set Canvas and Background Color;
stars.width = W;
stars.height = H;
let gradient = ctx.createLinearGradient(0, 0, W, H);
gradient.addColorStop(0, '#0C164D'); // Start color
gradient.addColorStop(1, '#190B22'); // End color
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, W, H);

//Glow effect;
ctx.shadowBlur = 10;
ctx.shadowColor = 'white';

const animate = () => {
  //Random position and size of stars;
  let x = W * Math.random();
  let y = H * Math.random();
  let r = 2.5 * Math.random();

  //Draw the stars;
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  setTimeout(animate, 500);
};

animate();

getKey().then(() => getData());
