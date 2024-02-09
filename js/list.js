// list.js

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".btn.btn-primary").addEventListener("click", showNextCharacter);
    document.querySelector(".btn.btn-light").addEventListener("click", clearAll);
});

let currentCharacterIndex = 0;

async function showNextCharacter() {
    const response = await fetch('https://rickandmortyapi.com/api/character/?page=1');
    const data = await response.json();

    var itemList = document.getElementById("my-list");
    var template = document.getElementById("list-template");

    if (currentCharacterIndex < data.results.length) {
        const character = data.results[currentCharacterIndex];
        const characterInfo = await fetch(character.url).then(response => response.json());
        const episodes = characterInfo.episode.slice(0, 3); // Limitando a 3 episodios para evitar desbordamiento
        const episodesData = await Promise.all(episodes.map(url => fetch(url).then(response => response.json())));

        var total = itemList.childElementCount + 1;
        var clone = template.content.cloneNode(true);
        clone.querySelector("[data-id='number']").textContent = `${total}`;
        clone.querySelector("[data-id='title']").textContent = character.name;
        clone.querySelector("[data-id='content']").textContent = `Status: ${character.status}, Species: ${character.species}`;
        clone.querySelector("[data-id='image']").src = character.image;

        const episodesList = clone.querySelector("[data-id='episodes']");
        episodesData.forEach(episode => {
            const episodeElement = document.createElement('div');
            episodeElement.textContent = `${episode.name}`;
            episodesList.appendChild(episodeElement);
        });

        itemList.appendChild(clone);

        currentCharacterIndex++;
    }
}

function clearAll() {
    var itemList = document.getElementById("my-list");
    itemList.replaceChildren();
    currentCharacterIndex = 0;
}
