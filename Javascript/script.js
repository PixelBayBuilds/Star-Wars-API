// Fetch the list of films from the SWAPI
fetch('https://swapi.dev/api/films/')
.then(response => response.json())
.then(data => {
const filmMap = new Map();
  // Add all the films to the map
data.results.forEach(film => {
    filmMap.set(film.url, film.title);
});
  // Fetch the list of characters from the SWAPI
fetch('https://swapi.dev/api/people/')
    .then(response => response.json())
    .then(data => {
      // Loop through the characters and add them to the list
    data.results.forEach(character => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${character.name} (Appears in: <ul id="${character.url}"></ul>)`
          // Fetch the films the character appears in
    character.films.forEach(async filmUrl => {
        try {
            const response = await fetch(filmUrl);
            const filmData = await response.json();
          // Add the film to the list under the corresponding character
        const filmItem = document.createElement('li');
        filmItem.innerHTML = `<a href="${filmData.url}" onclick="loadFilm(event)">${filmData.title}</a>`;
        document.getElementById(character.url).appendChild(filmItem);
    } catch (error) {
        console.error(error);
      }
    });

    document.getElementById('character-list').appendChild(listItem);
});
})
.catch(error => console.error(error));
});

// Function to load a film page and display the characters in that film
async function loadFilm(event) {
    event.preventDefault();
    const filmUrl = event.target.getAttribute('href');
    try {
      const response = await fetch(filmUrl);
      const filmData = await response.json();
      const characterList = await Promise.all(
        filmData.characters.map(async characterUrl => {
          try {
            const response = await fetch(characterUrl);
            const characterData = await response.json();
            return `<li><a href="${characterData.url}" onclick="loadCharacter(event)">${characterData.name}</a></li>`;
          } catch (error) {
            console.error(error);
          }
        })
      );
      const filmPage = `
        <h2>${filmData.title}</h2>
        <p>Director: ${filmData.director}</p>
        <p>Producer: ${filmData.producer}</p>
        <p>Release Date: ${filmData.release_date}</p>
        <ul>${characterList.join('')}</ul>
        
      `;
      document.body.innerHTML = filmPage;
    } catch (error) {
      console.error(error);
    }
  }

// Function to load a character page and display the films they appear in
async function loadCharacter(event) {
    event.preventDefault();
    const characterUrl = event.target.getAttribute('href');
    try {
      const response = await fetch(characterUrl);
      const characterData = await response.json();
      const filmList = await Promise.all(
        characterData.films.map(async filmUrl => {
          try {
            const response = await fetch(filmUrl);
            const filmData = await response.json();
            return `<li><a href="${filmData.url}" onclick="loadFilm(event)">${filmData.title}</a></li>`;
        } catch (error) {
            console.error(error);
          }
        })
      );
    const characterPage = `
        <h2>${characterData.name}</h2>
    <p>Height: ${characterData.height}</p>
    <p>Mass: ${characterData.mass}</p>
    <p>Hair Color: ${characterData.hair_color}</p>
    <p>Skin Color: ${characterData.skin_color}</p>
    <p>Eye Color: ${characterData.eye_color}</p>
    <p>Birth Year: ${characterData.birth_year}</p>
    <p>Gender: ${characterData.gender}</p>
        <p>Appears in:</p>
        <ul>${filmList.join('')}</ul>

    `;
    document.body.innerHTML = characterPage;
} catch (error) {
    console.error(error);
}
}